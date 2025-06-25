# Google Drive Integration Setup Guide

This guide will help you set up Google Drive integration for your wedding photo upload system.

**Your Website**: [https://xxwilliamn123.github.io/Wedding/](https://xxwilliamn123.github.io/Wedding/)

## 🚀 Benefits of Google Drive Integration

- **Cloud Storage**: Photos are stored securely in Google Drive
- **Easy Access**: View and manage photos from anywhere
- **Automatic Backup**: No risk of losing photos
- **Sharing**: Easy to share approved photos with family and friends
- **Organization**: Photos are automatically organized in folders

## 📋 Prerequisites

1. **Google Account**: You need a Google account
2. **Google Cloud Project**: Create a project in Google Cloud Console
3. **Web Hosting**: Your website is hosted on GitHub Pages ✅

## 🔧 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "William & Cyndie Wedding Photos")
4. Click "Create"

### Step 2: Enable Google Drive API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on it and press "Enable"

### Step 3: Create Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add your website URL to "Authorized JavaScript origins":
   - `https://xxwilliamn123.github.io`
   - `http://localhost:3000` (for testing)
5. Add authorized redirect URIs:
   - `https://xxwilliamn123.github.io/Wedding/gallery.html`
   - `http://localhost:3000/gallery.html` (for testing)
6. Click "Create"
7. **Save the Client ID** - you'll need this

### Step 4: Create API Key

1. In "Credentials", click "Create Credentials" → "API Key"
2. **Save the API Key** - you'll need this
3. **Restrict the API key** (recommended):
   - Click on the API key
   - Application restrictions: HTTP referrers
   - Add: `https://xxwilliamn123.github.io/*`
   - API restrictions: Restrict key → Google Drive API

### Step 5: Create Google Drive Folder

1. Go to [Google Drive](https://drive.google.com/)
2. Create a new folder called "William & Cyndie Wedding Photos"
3. Right-click the folder → "Share" → "Copy link"
4. The folder ID is in the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
5. **Save the Folder ID** - you'll need this

### Step 6: Configure Your Website

Update the configuration in `js/photo-upload.js`:

```javascript
// Replace these values with your actual credentials
const GOOGLE_DRIVE_FOLDER_ID = 'YOUR_FOLDER_ID_HERE';
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const API_KEY = 'YOUR_API_KEY_HERE';
```

### Step 7: Test the Integration

1. Commit and push your changes to GitHub
2. Wait 2-3 minutes for GitHub Pages to update
3. Visit: [https://xxwilliamn123.github.io/Wedding/gallery.html](https://xxwilliamn123.github.io/Wedding/gallery.html)
4. Try uploading a photo
5. Check your Google Drive folder for the uploaded file

## 🔒 Security Considerations

1. **API Key Restrictions**: Restrict your API key to only Google Drive API and your domain
2. **OAuth Scopes**: The app only requests `drive.file` scope (minimal permissions)
3. **Folder Access**: Only you have access to the Google Drive folder
4. **HTTPS**: GitHub Pages provides HTTPS automatically ✅
5. **Domain Restrictions**: Only `https://xxwilliamn123.github.io` is authorized

## 📧 Email Notifications (Optional)

To receive email notifications when photos are uploaded:

1. Set up [EmailJS](https://www.emailjs.com/) account
2. Create an email template:
   ```
   Subject: New Wedding Photo Upload - William & Cyndie
   Body: 
   Guest: {{guest_name}}
   Email: {{guest_email}}
   Photos: {{photo_count}}
   Date: {{submission_date}}
   ```
3. Update the `sendNotification` function in the code
4. Replace `'your_service_id'` and `'your_template_id'` with your actual IDs

## 🛠️ Troubleshooting

### Common Issues:

1. **"Google Drive API not enabled"**
   - Make sure you enabled the Google Drive API in Step 2

2. **"Invalid client ID"**
   - Double-check your Client ID from Step 3
   - Make sure `https://xxwilliamn123.github.io` is in authorized origins

3. **"Access denied"**
   - Check that your folder ID is correct
   - Make sure the folder exists and is accessible

4. **"CORS errors"**
   - Make sure you're using `https://xxwilliamn123.github.io/Wedding/gallery.html`
   - Check API key restrictions include your domain

### Testing Locally:

For local testing, you can use:
- `http://localhost:3000` (if using a local server)
- `http://127.0.0.1:3000`

### Production Testing:

Visit your live site: [https://xxwilliamn123.github.io/Wedding/gallery.html](https://xxwilliamn123.github.io/Wedding/gallery.html)

## 📱 Mobile Compatibility

The Google Drive integration works on mobile devices, but users will need to:
1. Sign in to their Google account
2. Grant permission to upload files
3. Have a stable internet connection

## 🔄 Alternative: Google Apps Script

If you prefer a simpler setup, you can also use Google Apps Script:

1. Create a Google Apps Script project
2. Set up a web app endpoint
3. Modify the upload code to use fetch() to your Apps Script URL
4. This eliminates the need for OAuth setup

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all credentials are correct
3. Ensure your website is hosted (GitHub Pages ✅)
4. Test with a simple file first
5. Check GitHub Pages deployment status

## 🎉 Success!

Once configured, your guests will be able to:
- Upload photos directly to your Google Drive
- See upload progress and confirmation
- Have their photos automatically organized
- Receive notifications when photos are approved

You'll be able to:
- View all uploaded photos in your Google Drive folder
- Manage and approve photos through the admin panel
- Share approved photos easily
- Access photos from anywhere

**Your wedding photo upload system will be live at**: [https://xxwilliamn123.github.io/Wedding/gallery.html](https://xxwilliamn123.github.io/Wedding/gallery.html) 