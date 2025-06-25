# 🔧 TROUBLESHOOTING: Email Not Working

## 🚨 IMMEDIATE STEPS TO FIX:

### Step 1: Test the Form
1. Open `test-form.html` in your browser
2. Fill in a test name and email
3. Submit the form
4. Check the browser console (F12 → Console tab)
5. Look for any error messages

### Step 2: Check Formspree Setup
1. Go to [Formspree.io](https://formspree.io/)
2. Log into your account
3. Check if form `xblypdkv` exists and is active
4. Verify the email `montengro.cyndie1416@gmail.com` is set as the recipient

### Step 3: Check Your Email
1. Check your spam/junk folder
2. Check if you received any Formspree activation emails
3. Make sure `montengro.cyndie1416@gmail.com` is correct

## 🔍 DEBUGGING STEPS:

### Check Browser Console
1. Open your website
2. Press F12 to open developer tools
3. Go to Console tab
4. Submit the form
5. Look for these messages:
   - "Attempting to send email for: [name] [email]"
   - "Formspree response: [response]"
   - "Email sent successfully via Formspree"
   - Any error messages

### Test Formspree Directly
Try this direct test:
1. Go to: https://formspree.io/f/xblypdkv
2. Fill out the form there
3. See if you receive an email

## 🛠️ ALTERNATIVE SOLUTIONS:

### Option 1: Create New Formspree Form
1. Go to [Formspree.io](https://formspree.io/)
2. Create a new form
3. Copy the new form ID
4. Update `js/guest-form.js` with the new ID

### Option 2: Use EmailJS (More Reliable)
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Create free account
3. Set up email service
4. Update the JavaScript with your EmailJS credentials

### Option 3: Use Netlify Forms (If hosted on Netlify)
1. Add `netlify` attribute to forms
2. Forms will be handled automatically

## 📧 EMAIL CONTENT EXPECTED:

When working, you should receive:
```
Subject: Wedding Guest Attendance - [Guest Name]
From: [Guest Email]
To: montengro.cyndie1416@gmail.com

Content:
Guest Attendance Confirmation

Name: [Guest Name]
Email: [Guest Email]

This guest has confirmed their attendance for the wedding on October 18, 2025.

Please add this guest to your attendance list.
```

## 🚀 QUICK FIXES:

### If Formspree isn't working:
1. Replace the form ID in `js/guest-form.js`:
```javascript
fetch('https://formspree.io/f/YOUR_NEW_FORM_ID', {
```

### If you want immediate emails:
1. The mailto fallback should always work
2. It opens the user's email client
3. They can send the email manually

### If nothing works:
1. Check if JavaScript is enabled
2. Try a different browser
3. Check if the website is hosted properly

## 📞 NEED HELP?

If you're still having issues:
1. Check the browser console for errors
2. Try the test form at `test-form.html`
3. Verify your Formspree account is active
4. Make sure the email address is correct

---

**The forms should work! Let's debug this step by step.**

# Troubleshooting Guide - Wedding Photo Upload System

## "Failed to fetch" Error Resolution

### Step 1: Verify Google Apps Script Setup

1. **Check Script URL**:
   - Make sure your Google Apps Script URL ends with `/exec` (not `/dev`)
   - Current URL: `https://script.google.com/macros/s/AKfycbzqhjk9xjME1X18aiBkVTDdW0NtDzLaR8s5BTrSZa5uWHtdpK5gK5e05w4HqhBFEgYv/exec`

2. **Test Script Directly**:
   - Open `test-google-script.html` in your browser
   - Click "Test GET" - should show "Wedding Photo Upload Service is running!"
   - If GET fails, your script deployment has issues

3. **Redeploy Script**:
   - Go to [script.google.com](https://script.google.com)
   - Open your project
   - Click "Deploy" → "Manage deployments"
   - Click the pencil icon to edit
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
   - Copy the new `/exec` URL

### Step 2: Update Website URLs

After getting the new script URL, update these files:

**In `js/photo-upload.js` (line 15):**
```javascript
const GOOGLE_APPS_SCRIPT_URL = 'YOUR_NEW_SCRIPT_URL_HERE';
```

**In `admin-photos.html` (line 378):**
```javascript
const RENAME_SCRIPT_URL = 'YOUR_NEW_SCRIPT_URL_HERE';
```

### Step 3: Test Upload Functionality

1. **Upload a Test Photo**:
   - Go to your wedding website gallery page
   - Fill out the guest photo upload form
   - Upload a test image
   - Check browser console for errors

2. **Check Google Drive**:
   - Look for a "Wedding Guest Photos" folder
   - Check for date-based subfolders
   - Verify files are being created

3. **Check Email Notifications**:
   - Look for confirmation emails
   - Check spam folder if needed

### Step 4: Test Admin Panel

1. **Open Admin Panel**:
   - Go to `admin-photos.html`
   - Check if uploaded photos appear
   - Verify images are displaying

2. **Test Approval/Rejection**:
   - Click "Approve" on a pending submission
   - Check if files are renamed in Google Drive
   - Verify admin panel updates

## Common Issues and Solutions

### Issue: "Failed to fetch" on GET request
**Solution**: 
- Redeploy your Google Apps Script
- Make sure "Who has access" is set to "Anyone"
- Use the `/exec` endpoint URL

### Issue: Images not displaying in admin panel
**Solution**:
- Check if `google_drive_url` is stored in submission data
- Verify file permissions are set to "Anyone with link can view"
- Check browser console for CORS errors

### Issue: File renaming not working
**Solution**:
- Ensure the script has the `handleRename` function
- Check that file IDs are being stored correctly
- Verify the rename script URL is correct

### Issue: No email notifications
**Solution**:
- Check if Gmail API is enabled in Google Apps Script
- Verify the admin email address is correct
- Check spam folder

## Testing Checklist

- [ ] Google Apps Script responds to GET request
- [ ] Photo upload creates files in Google Drive
- [ ] Admin panel displays uploaded images
- [ ] Approval/rejection renames files
- [ ] Email notifications are received
- [ ] File permissions allow public viewing

## Debug Information

### Check Browser Console
Open browser developer tools (F12) and look for:
- Network errors
- JavaScript errors
- CORS issues

### Check Google Apps Script Logs
1. Go to [script.google.com](https://script.google.com)
2. Open your project
3. Click "Executions" in the left sidebar
4. Check recent executions for errors

### Test URLs
- **GET Test**: `https://script.google.com/macros/s/YOUR_ID/exec`
- **POST Test**: Use the test form in `test-google-script.html`

## Emergency Fix

If nothing works, try this simplified script:

```javascript
function doGet(e) {
  return ContentService
    .createTextOutput("Wedding Photo Upload Service is running!")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const params = e.parameter;
    
    if (params.action === 'rename') {
      const file = DriveApp.getFileById(params.fileId);
      file.setName(params.newName);
      return ContentService
        .createTextOutput(JSON.stringify({success: true}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Simple upload
    const blob = Utilities.newBlob("Test file", "text/plain", "test.txt");
    const file = DriveApp.createFile(blob);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        fileId: file.getId(),
        fileUrl: file.getDownloadUrl()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

This minimal script should work for basic testing. 