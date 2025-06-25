// Wedding Photo Upload Handler - Google Apps Script (Bulk Upload Version)
function doPost(e) {
  try {
    console.log('=== WEDDING BULK PHOTO UPLOAD STARTED ===');
    
    // Check if event object exists
    if (!e) {
      console.error('Event object is undefined');
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'No request data received'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    console.log('Event object received:', typeof e);
    console.log('Event keys:', Object.keys(e));
    
    const params = e.parameter;
    console.log('Parameters received:', Object.keys(params));
    
    // Check if this is a rename action
    if (params.action === 'rename') {
      console.log('Handling rename action...');
      return handleRename(params);
    }
    
    // Check if this is a listFiles action
    if (params.action === 'listFiles') {
      console.log('Handling listFiles action...');
      return handleListFiles(params);
    }
    
    // Handle bulk file upload
    console.log('Handling bulk file upload...');
    return handleBulkUpload(params);
    
  } catch (error) {
    console.error('=== BULK UPLOAD FAILED ===');
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Upload failed: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleBulkUpload(params) {
  const guestName = params.guestName || 'Unknown Guest';
  const guestEmail = params.guestEmail || 'unknown@example.com';
  const description = params.description || '';
  
  console.log('Bulk upload data:', {
    guestName: guestName,
    guestEmail: guestEmail,
    description: description
  });
  
  // Validate required fields
  if (!guestName || guestName === 'Unknown Guest') {
    console.error('Missing guest name');
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Missing guest name'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (!guestEmail || guestEmail === 'unknown@example.com') {
    console.error('Missing guest email');
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Missing guest email'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Parse bulk file data
  let fileDataArray = [];
  try {
    if (params.fileDataArray) {
      fileDataArray = JSON.parse(params.fileDataArray);
    }
  } catch (parseError) {
    console.error('Error parsing file data array:', parseError);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Invalid file data format'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (fileDataArray.length === 0) {
    console.error('No files to upload');
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'No files provided for upload'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  console.log(`Processing ${fileDataArray.length} files for bulk upload`);
  
  // Use your specific Google Drive folder ID
  const folderId = '1TbeQiFUrkyv7Y-bfwFspPdTkRNY-INXV';
  
  console.log('Using folder ID:', folderId);
  
  try {
    // Get the folder
    const folder = DriveApp.getFolderById(folderId);
    console.log('Found folder:', folder.getName());
    
    const uploadedFiles = [];
    const failedFiles = [];
    const timestamp = new Date().getTime();
    
    // Process each file in the bulk upload
    for (let i = 0; i < fileDataArray.length; i++) {
      const fileData = fileDataArray[i];
      const fileName = fileData.fileName || `unknown_${i}.jpg`;
      const fileType = fileData.fileType || 'image/jpeg';
      const base64Data = fileData.fileData || '';
      
      console.log(`Processing file ${i + 1}/${fileDataArray.length}: ${fileName}`);
      
      try {
        // Create file name with guest info and timestamp
        const cleanFileName = `${guestName}_${timestamp}_${i + 1}_${fileName}`;
        
        let file = null;
        
        // If we have file data, create the file from base64
        if (base64Data && base64Data.length > 0) {
          try {
            console.log('Converting base64 to blob...');
            // Convert base64 to blob
            const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), fileType, cleanFileName);
            file = folder.createFile(blob);
            console.log('File created from base64 data:', file.getName());
          } catch (blobError) {
            console.error('Error creating file from base64:', blobError);
            // Create a placeholder file if base64 conversion fails
            const placeholderContent = `Photo uploaded by ${guestName} on ${new Date().toLocaleString()}\nOriginal file: ${fileName}\nError: Could not process image data\nError details: ${blobError.toString()}`;
            file = folder.createFile(placeholderContent, cleanFileName, MimeType.PLAIN_TEXT);
            console.log('Created placeholder file due to error');
          }
        } else {
          // Create a placeholder file if no file data
          const placeholderContent = `Photo uploaded by ${guestName} on ${new Date().toLocaleString()}\nOriginal file: ${fileName}\nNo file data received\nThis is a test upload`;
          file = folder.createFile(placeholderContent, cleanFileName, MimeType.PLAIN_TEXT);
          console.log('Created placeholder file (no file data)');
        }
        
        // Add metadata to file description
        const metadata = {
          guestName: guestName,
          guestEmail: guestEmail,
          description: description || 'No description provided',
          uploadDate: new Date().toISOString(),
          originalFileName: fileName,
          fileType: fileType,
          bulkUploadIndex: i + 1,
          totalFiles: fileDataArray.length
        };
        
        file.setDescription(JSON.stringify(metadata));
        console.log('File metadata added');
        
        // Set file permissions to anyone with link can view
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        console.log('File permissions set');
        
        // Get the file URL for display
        const fileUrl = file.getDownloadUrl();
        console.log('File URL:', fileUrl);
        
        uploadedFiles.push({
          originalName: fileName,
          googleDriveId: file.getId(),
          googleDriveUrl: fileUrl,
          fileName: cleanFileName,
          fileSize: file.getSize(),
          mimeType: file.getMimeType()
        });
        
        console.log(`File ${i + 1} uploaded successfully:`, cleanFileName);
        
      } catch (fileError) {
        console.error(`Error uploading file ${fileName}:`, fileError);
        failedFiles.push({
          fileName: fileName,
          error: fileError.toString()
        });
      }
    }
    
    console.log(`Bulk upload completed. Success: ${uploadedFiles.length}, Failed: ${failedFiles.length}`);
    
    // Send single confirmation email for bulk upload
    try {
      console.log('Sending bulk upload confirmation email...');
      sendBulkConfirmationEmail(guestEmail, guestName, uploadedFiles, failedFiles, description);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }
    
    // Send single notification to admin for bulk upload
    try {
      console.log('Sending admin bulk notification...');
      sendAdminBulkNotification(guestName, guestEmail, uploadedFiles, failedFiles, description);
    } catch (adminEmailError) {
      console.error('Failed to send admin notification:', adminEmailError);
    }
    
    console.log('=== BULK UPLOAD COMPLETED SUCCESSFULLY ===');
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: `Bulk upload completed. ${uploadedFiles.length} files uploaded successfully.`,
        uploadedFiles: uploadedFiles,
        failedFiles: failedFiles,
        totalFiles: fileDataArray.length,
        successfulUploads: uploadedFiles.length,
        failedUploads: failedFiles.length
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Folder or bulk upload error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error accessing folder or processing bulk upload: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleRename(params) {
  const fileId = params.fileId;
  const newName = params.newName;
  
  console.log('Rename request:', { fileId: fileId, newName: newName });
  
  if (!fileId || !newName) {
    console.error('Missing fileId or newName for rename');
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Missing fileId or newName'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    // Get the file by ID
    const file = DriveApp.getFileById(fileId);
    console.log('Found file:', file.getName());
    
    // Rename the file
    file.setName(newName);
    console.log('File renamed to:', newName);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'File renamed successfully',
        newName: newName
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Rename error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleListFiles(params) {
  const folderId = params.folderId || '1TbeQiFUrkyv7Y-bfwFspPdTkRNY-INXV';
  
  console.log('ListFiles request for folder:', folderId);
  
  try {
    // Get the folder
    const folder = DriveApp.getFolderById(folderId);
    console.log('Found folder:', folder.getName());
    
    // Get all files in the folder
    const files = folder.getFiles();
    const fileList = [];
    
    while (files.hasNext()) {
      const file = files.next();
      
      // Set file permissions to anyone with link can view (for image display)
      try {
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (permError) {
        console.log('Permission already set for:', file.getName());
      }
      
      const fileInfo = {
        id: file.getId(),
        name: file.getName(),
        size: file.getSize(),
        mimeType: file.getMimeType(),
        description: file.getDescription(),
        createdTime: file.getDateCreated().toISOString(),
        webContentLink: `https://drive.google.com/uc?id=${file.getId()}&export=view`,
        webViewLink: `https://drive.google.com/file/d/${file.getId()}/view`
      };
      fileList.push(fileInfo);
    }
    
    console.log(`Found ${fileList.length} files in folder`);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: `Found ${fileList.length} files`,
        files: fileList
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('ListFiles error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  console.log('GET request received');
  return ContentService
    .createTextOutput("Wedding Photo Upload Service is running!")
    .setMimeType(ContentService.MimeType.TEXT);
}

// Send bulk confirmation email to guest
function sendBulkConfirmationEmail(guestEmail, guestName, uploadedFiles, failedFiles, description) {
  const subject = `Bulk Photo Upload Confirmation - ${uploadedFiles.length} Photos`;
  const totalFiles = uploadedFiles.length + failedFiles.length;
  
  let body = `
    Dear ${guestName},
    
    Thank you for uploading ${totalFiles} photos to our wedding website!
    
    📸 Upload Summary:
    ✅ Successfully uploaded: ${uploadedFiles.length} photos
    ❌ Failed uploads: ${failedFiles.length} photos
    
    Your photos have been received and will be reviewed within 24-48 hours. 
    Once approved, they will appear in our wedding gallery.
  `;
  
  if (uploadedFiles.length > 0) {
    body += `\n\n📁 Successfully Uploaded Files:\n`;
    uploadedFiles.forEach((file, index) => {
      body += `${index + 1}. ${file.originalName}\n`;
    });
  }
  
  if (failedFiles.length > 0) {
    body += `\n\n❌ Failed Uploads:\n`;
    failedFiles.forEach((file, index) => {
      body += `${index + 1}. ${file.fileName} - ${file.error}\n`;
    });
  }
  
  body += `
    
    If you have any questions, please don't hesitate to contact us.
    
    Best regards,
    The Wedding Couple
  `;
  
  try {
    GmailApp.sendEmail(guestEmail, subject, body);
    console.log('Bulk confirmation email sent to:', guestEmail);
  } catch (error) {
    console.error('Failed to send bulk confirmation email:', error);
  }
}

// Send bulk notification to admin
function sendAdminBulkNotification(guestName, guestEmail, uploadedFiles, failedFiles, description) {
  const adminEmail = 'montengro.cyndie1416@gmail.com'; // Your email
  const totalFiles = uploadedFiles.length + failedFiles.length;
  
  const subject = `Bulk Photo Upload - ${guestName} (${uploadedFiles.length}/${totalFiles} successful)`;
  
  let body = `
    A bulk photo upload has been completed on your wedding website.
    
    👤 Guest Information:
    Name: ${guestName}
    Email: ${guestEmail}
    Description: ${description || 'No description provided'}
    
    📊 Upload Summary:
    Total files: ${totalFiles}
    Successfully uploaded: ${uploadedFiles.length}
    Failed uploads: ${failedFiles.length}
  `;
  
  if (uploadedFiles.length > 0) {
    body += `\n\n✅ Successfully Uploaded Files:\n`;
    uploadedFiles.forEach((file, index) => {
      body += `${index + 1}. ${file.originalName}\n   Size: ${(file.fileSize / 1024).toFixed(1)} KB\n   View: ${file.googleDriveUrl}\n\n`;
    });
  }
  
  if (failedFiles.length > 0) {
    body += `\n❌ Failed Uploads:\n`;
    failedFiles.forEach((file, index) => {
      body += `${index + 1}. ${file.fileName}\n   Error: ${file.error}\n\n`;
    });
  }
  
  body += `
    To approve or reject these photos, visit your admin panel.
  `;
  
  try {
    GmailApp.sendEmail(adminEmail, subject, body);
    console.log('Admin bulk notification sent to:', adminEmail);
  } catch (error) {
    console.error('Failed to send admin bulk notification:', error);
  }
}

// Test function to verify setup
function testSetup() {
  console.log('Google Apps Script is working correctly!');
  try {
    const folder = DriveApp.getFolderById('1TbeQiFUrkyv7Y-bfwFspPdTkRNY-INXV');
    console.log('Folder ID:', folder.getId());
    console.log('Folder name:', folder.getName());
    return true;
  } catch (error) {
    console.error('Test setup failed:', error);
    return false;
  }
} 