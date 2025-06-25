# Bulk Photo Upload Setup with Single Email Notification

This guide will help you set up Google Apps Script to handle bulk photo uploads with a single email notification instead of individual notifications for each photo.

## 🚀 Benefits of Bulk Upload:

- ✅ **Single email notification for multiple photos**
- ✅ **Better performance**
- ✅ **Reduced email spam**
- ✅ **Cleaner user experience**
- ✅ **No OAuth verification required**

## 📋 Setup Steps:

### Step 1: Create Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Rename the project to "Wedding Bulk Photo Upload Handler"

### Step 2: Replace the Default Code

Replace the default code in the editor with the content from `bulk-upload-google-apps-script.js` file.

### Step 3: Configure the Script

1. **Update Admin Email**: Replace `'montengro.cyndie1416@gmail.com'` with your actual email address in the `sendAdminBulkNotification` function.

2. **Update Folder ID**: Replace `'1TbeQiFUrkyv7Y-bfwFspPdTkRNY-INXV'` with your actual Google Drive folder ID.

3. **Save the Project**: Click the save button (floppy disk icon) and give it a name.

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
2. Replace the `GOOGLE_APPS_SCRIPT_URL` with the Web App URL you copied in Step 4
3. Save the file

### Step 6: Test the Bulk Upload Feature

1. Go to your wedding website gallery page
2. Try uploading multiple photos at once (up to 10 photos)
3. Check your Google Drive for the uploaded photos
4. Check your email for a single bulk confirmation and admin notification

## 📧 Email Notifications:

### Guest Confirmation Email:
- **Subject**: "Bulk Photo Upload Confirmation - X Photos"
- **Content**: 
  - Upload summary (successful vs failed)
  - List of all successfully uploaded files
  - List of any failed uploads with error details
  - Thank you message

### Admin Notification Email:
- **Subject**: "Bulk Photo Upload - Guest Name (X/Y successful)"
- **Content**:
  - Guest information (name, email, description)
  - Upload summary statistics
  - List of all uploaded files with direct links
  - List of failed uploads with error details
  - Instructions for admin review

## 🔧 How It Works:

1. **File Selection**: User selects multiple photos (up to 10)
2. **Preview**: Shows preview of all selected photos
3. **Bulk Processing**: All files are converted to base64 and prepared
4. **Single Request**: All files are sent in one HTTP request to Google Apps Script
5. **Bulk Processing**: Google Apps Script processes all files in sequence
6. **Single Email**: One confirmation email sent to guest
7. **Single Admin Notification**: One notification email sent to admin

## 📊 Upload Summary:

The system provides detailed feedback:
- **Total files attempted**: X
- **Successfully uploaded**: Y
- **Failed uploads**: Z
- **Individual file status**: Each file with success/failure details

## 🎯 Advantages:

- **Reduced email clutter**: Only one email per upload session
- **Better performance**: Single HTTP request instead of multiple
- **Improved user experience**: Faster upload process
- **Better error handling**: Comprehensive error reporting
- **Admin efficiency**: Single notification with all details

## 🔒 Security:

- **Only you can access the script**
- **Files are stored in your Google Drive**
- **No external authentication required**
- **Secure file handling**
- **File permissions automatically set**

## 🚨 Troubleshooting:

### If uploads fail:
1. Check the Google Apps Script logs
2. Verify the folder ID is correct
3. Ensure the admin email is valid
4. Check file size limits (Google Apps Script has limits)

### If emails don't send:
1. Check Gmail API permissions
2. Verify email addresses are correct
3. Check Google Apps Script quotas

This bulk upload solution provides a much better user experience while maintaining all the security and functionality of the original system! 