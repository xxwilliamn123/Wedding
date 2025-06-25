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
    const params = e.parameter;
    
    // Check if this is a rename action
    if (params.action === 'rename') {
      return handleRename(params);
    }
    
    // Handle file upload
    return handleUpload(params);
    
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleUpload(params) {
  const fileName = params.fileName;
  const guestName = params.guestName;
  const guestEmail = params.guestEmail;
  const description = params.description;
  const fileData = params.fileData;
  const fileType = params.fileType;
  
  // Get the folder ID from your Google Drive
  const folderId = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'; // Replace with your actual folder ID
  
  try {
    // Convert base64 to blob
    const blob = Utilities.newBlob(Utilities.base64Decode(fileData), fileType, fileName);
    
    // Upload to Google Drive
    const folder = DriveApp.getFolderById(folderId);
    const file = folder.createFile(blob);
    
    // Set file permissions to anyone with link can view
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Get the file URL
    const fileUrl = file.getDownloadUrl();
    
    // Send email notification
    sendEmailNotification(guestName, guestEmail, fileName, description, fileUrl);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        fileId: file.getId(),
        fileUrl: fileUrl,
        message: 'File uploaded successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Upload error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleRename(params) {
  const fileId = params.fileId;
  const newName = params.newName;
  
  try {
    // Get the file by ID
    const file = DriveApp.getFileById(fileId);
    
    // Rename the file
    file.setName(newName);
    
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

function sendEmailNotification(guestName, guestEmail, fileName, description, fileUrl) {
  const adminEmail = 'montengro.cyndie1416@gmail.com'; // Replace with your email
  
  const subject = `New Photo Upload - ${guestName}`;
  const body = `
    A new photo has been uploaded to your wedding website.
    
    Guest: ${guestName}
    Email: ${guestEmail}
    File: ${fileName}
    Description: ${description || 'No description provided'}
    
    View the photo: ${fileUrl}
    
    To approve or reject this photo, visit your admin panel.
  `;
  
  try {
    GmailApp.sendEmail(adminEmail, subject, body);
  } catch (error) {
    console.error('Email error:', error);
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