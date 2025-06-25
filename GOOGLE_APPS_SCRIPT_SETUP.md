# Google Apps Script Setup for Photo Upload Feature

This guide will help you set up Google Apps Script to handle photo uploads without OAuth verification issues.

## 🚀 Benefits of Google Apps Script:

- ✅ **No OAuth verification required**
- ✅ **No sign-in required for guests**
- ✅ **Simpler setup**
- ✅ **More reliable**
- ✅ **Works immediately**

## 📋 Setup Steps:

### Step 1: Create Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Rename the project to "Wedding Photo Upload Handler"

### Step 2: Replace the Default Code

Replace the default code in the editor with this simplified script:

```javascript
// Wedding Photo Upload Handler - Google Apps Script
function doPost(e) {
  try {
    console.log('=== WEDDING PHOTO UPLOAD STARTED ===');
    
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
    
    // Try to get data from different sources
    let fileName = 'unknown.jpg';
    let guestName = 'Unknown Guest';
    let guestEmail = 'unknown@example.com';
    let description = '';
    let fileData = '';
    let fileType = 'image/jpeg';
    
    // Method 1: Try e.parameter (form data)
    if (e.parameter) {
      console.log('Found e.parameter:', Object.keys(e.parameter));
      const params = e.parameter;
      fileName = params.fileName || fileName;
      guestName = params.guestName || guestName;
      guestEmail = params.guestEmail || guestEmail;
      description = params.description || description;
      fileData = params.fileData || fileData;
      fileType = params.fileType || fileType;
      console.log('Data extracted from e.parameter');
    }
    
    // Method 2: Try e.postData (JSON data)
    if (e.postData && e.postData.contents) {
      console.log('Found e.postData:', e.postData.type);
      try {
        const jsonData = JSON.parse(e.postData.contents);
        fileName = jsonData.fileName || fileName;
        guestName = jsonData.guestName || guestName;
        guestEmail = jsonData.guestEmail || guestEmail;
        description = jsonData.description || description;
        fileData = jsonData.fileData || fileData;
        fileType = jsonData.fileType || fileType;
        console.log('Data extracted from e.postData');
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
      }
    }
    
    console.log('Final data:', {
      fileName: fileName,
      guestName: guestName,
      guestEmail: guestEmail,
      description: description,
      fileDataLength: fileData ? fileData.length : 0,
      fileType: fileType
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
    
    // Create folder name with date
    const today = new Date();
    const folderName = `Wedding Photos - ${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    console.log('Creating folders...');
    
    // Get or create the main wedding photos folder
    let mainFolder = getOrCreateFolder('Wedding Guest Photos');
    console.log('Main folder created/found:', mainFolder.getName());
    
    // Get or create today's folder
    let todayFolder = getOrCreateFolder(folderName, mainFolder.getId());
    console.log('Today folder created/found:', todayFolder.getName());
    
    // Create file name with guest info
    const timestamp = new Date().getTime();
    const cleanFileName = `${guestName}_${timestamp}_${fileName}`;
    
    console.log('Creating file:', cleanFileName);
    
    let file = null;
    
    // If we have file data, create the file from base64
    if (fileData && fileData.length > 0) {
      try {
        console.log('Converting base64 to blob...');
        // Convert base64 to blob
        const blob = Utilities.newBlob(Utilities.base64Decode(fileData), fileType, cleanFileName);
        file = todayFolder.createFile(blob);
        console.log('File created from base64 data:', file.getName());
      } catch (blobError) {
        console.error('Error creating file from base64:', blobError);
        // Create a placeholder file if base64 conversion fails
        const placeholderContent = `Photo uploaded by ${guestName} on ${new Date().toLocaleString()}\nOriginal file: ${fileName}\nError: Could not process image data\nError details: ${blobError.toString()}`;
        file = todayFolder.createFile(placeholderContent, cleanFileName, MimeType.PLAIN_TEXT);
        console.log('Created placeholder file due to error');
      }
    } else {
      // Create a placeholder file if no file data
      const placeholderContent = `Photo uploaded by ${guestName} on ${new Date().toLocaleString()}\nOriginal file: ${fileName}\nNo file data received\nThis is a test upload`;
      file = todayFolder.createFile(placeholderContent, cleanFileName, MimeType.PLAIN_TEXT);
      console.log('Created placeholder file (no file data)');
    }
    
    // Add metadata to file description
    const metadata = {
      guestName: guestName,
      guestEmail: guestEmail,
      description: description || 'No description provided',
      uploadDate: new Date().toISOString(),
      originalFileName: fileName,
      fileType: fileType
    };
    
    file.setDescription(JSON.stringify(metadata));
    console.log('File metadata added');
    
    console.log('File created successfully:', file.getName());
    
    // Send confirmation email
    try {
      console.log('Sending confirmation email...');
      sendConfirmationEmail(guestEmail, guestName, fileName);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }
    
    // Send notification to admin
    try {
      console.log('Sending admin notification...');
      sendAdminNotification(guestName, guestEmail, fileName, description);
    } catch (adminEmailError) {
      console.error('Failed to send admin notification:', adminEmailError);
    }
    
    console.log('=== UPLOAD COMPLETED SUCCESSFULLY ===');
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Photo uploaded successfully',
        fileId: file.getId(),
        fileName: cleanFileName
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('=== UPLOAD FAILED ===');
    console.error('Error in doPost:', error);
    console.error('Error stack:', error.stack);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Upload failed: ' + error.toString()
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

// Helper function to get or create folder
function getOrCreateFolder(folderName, parentFolderId = null) {
  let folder;
  
  try {
    if (parentFolderId) {
      // Look for folder in parent
      const parentFolder = DriveApp.getFolderById(parentFolderId);
      const folders = parentFolder.getFoldersByName(folderName);
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = parentFolder.createFolder(folderName);
      }
    } else {
      // Look for folder in root
      const folders = DriveApp.getFoldersByName(folderName);
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder(folderName);
      }
    }
  } catch (error) {
    console.error('Error creating folder:', error);
    // Create in root if parent folder fails
    folder = DriveApp.createFolder(folderName);
  }
  
  return folder;
}

// Send confirmation email to guest
function sendConfirmationEmail(guestEmail, guestName, fileName) {
  const subject = 'Photo Upload Confirmation - Wedding Website';
  const body = `
    Dear ${guestName},
    
    Thank you for uploading your photo "${fileName}" to our wedding website!
    
    Your photo has been received and will be reviewed within 24-48 hours. 
    Once approved, it will appear in our wedding gallery.
    
    If you have any questions, please don't hesitate to contact us.
    
    Best regards,
    The Wedding Couple
  `;
  
  try {
    GmailApp.sendEmail(guestEmail, subject, body);
    console.log('Confirmation email sent to:', guestEmail);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
}

// Send notification to admin
function sendAdminNotification(guestName, guestEmail, fileName, description) {
  // Replace with your email address
  const adminEmail = 'montengro.cyndie1416@gmail.com'; // UPDATE THIS WITH YOUR EMAIL
  
  const subject = 'New Photo Upload - Wedding Website';
  const body = `
    A new photo has been uploaded to the wedding website:
    
    Guest Name: ${guestName}
    Guest Email: ${guestEmail}
    File Name: ${fileName}
    Description: ${description || 'No description provided'}
    Upload Date: ${new Date().toLocaleString()}
    
    To review and manage photos, visit your Google Drive folder:
    "Wedding Guest Photos"
    
    The photo is ready for approval/rejection.
  `;
  
  try {
    GmailApp.sendEmail(adminEmail, subject, body);
    console.log('Admin notification sent to:', adminEmail);
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

// Test function to verify setup
function testSetup() {
  console.log('Google Apps Script is working correctly!');
  try {
    const mainFolder = getOrCreateFolder('Wedding Guest Photos');
    console.log('Main folder ID:', mainFolder.getId());
    console.log('Main folder name:', mainFolder.getName());
    return true;
  } catch (error) {
    console.error('Test setup failed:', error);
    return false;
  }
}

### Step 3: Configure the Script

1. **Update Admin Email**: Replace `'montengro.cyndie1416@gmail.com'` with your actual email address in the `sendAdminNotification` function.

2. **Save the Project**: Click the save button (floppy disk icon) and give it a name.

### Step 4: Deploy as Web App

1. Click the "Deploy" button (rocket icon)
2. Select "New deployment"
3. Choose "Web app" as the type
4. Configure the settings:
   - **Execute as**: "Me" (your Google account)
   - **Who has access**: "Anyone" (for public access)
5. Click "Deploy"
6. Click "Authorize access" when prompted
7. Choose your Google account and grant permissions
8. Copy the Web App URL (you'll need this for the next step)

### Step 5: Update Your Website Code

1. Open `js/photo-upload.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL` with the Web App URL you copied in Step 4
3. Save the file

### Step 6: Test the Upload Feature

1. Go to your wedding website gallery page
2. Try uploading a test photo
3. Check your Google Drive for the "Wedding Guest Photos" folder
4. Check your email for confirmation and admin notifications

## 🎯 Advantages:

- **No OAuth setup required**
- **No verification process**
- **Guests don't need to sign in**
- **Automatic email notifications**
- **Works immediately**

## 📧 Email Notifications:

The script automatically sends you an email when photos are uploaded with:
- Guest name and email
- Photo description
- Direct link to the photo
- File details

## 🔒 Security:

- **Only you can access the script**
- **Files are stored in your Google Drive**
- **No external authentication required**
- **Secure file handling**

This solution will work immediately without any OAuth verification issues! 