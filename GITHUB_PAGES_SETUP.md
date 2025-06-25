# Google Drive Setup for GitHub Pages

Your wedding website is hosted on GitHub Pages at: [https://xxwilliamn123.github.io/Wedding/](https://xxwilliamn123.github.io/Wedding/)

## 🚀 Quick Setup for GitHub Pages

### Step 1: Google Cloud Console Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create New Project** (or use existing)
3. **Enable Google Drive API**:
   - Go to "APIs & Services" → "Library"
   - Search "Google Drive API" → Enable

### Step 2: Create OAuth 2.0 Credentials

1. **Go to "APIs & Services" → "Credentials"**
2. **Click "Create Credentials" → "OAuth 2.0 Client IDs"**
3. **Application type**: Web application
4. **Authorized JavaScript origins** (add these):
   ```
   https://xxwilliamn123.github.io
   http://localhost:3000
   ```
5. **Authorized redirect URIs** (add these):
   ```
   https://xxwilliamn123.github.io/Wedding/gallery.html
   http://localhost:3000/gallery.html
   ```
6. **Save the Client ID**

### Step 3: Create API Key

1. **In "Credentials" → "Create Credentials" → "API Key"**
2. **Save the API Key**
3. **Optional**: Restrict to Google Drive API only

### Step 4: Create Google Drive Folder

1. **Go to [Google Drive](https://drive.google.com/)**
2. **Create folder**: "William & Cyndie Wedding Photos"
3. **Get Folder ID**:
   - Right-click folder → "Share" → "Copy link"
   - Extract ID from URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`

### Step 5: Update Your Code

Edit `js/photo-upload.js` and replace these values:

```javascript
// Replace with your actual values
const GOOGLE_DRIVE_FOLDER_ID = '1ABC123DEF456GHI789JKL'; // Your folder ID
const CLIENT_ID = '123456789-abcdefghijklmnop.apps.googleusercontent.com'; // Your client ID
const API_KEY = 'AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz'; // Your API key
```

### Step 6: Test the Integration

1. **Commit and push** your changes to GitHub
2. **Wait 2-3 minutes** for GitHub Pages to update
3. **Visit**: [https://xxwilliamn123.github.io/Wedding/gallery.html](https://xxwilliamn123.github.io/Wedding/gallery.html)
4. **Try uploading** a test photo

## 🔒 Security for GitHub Pages

### API Key Restrictions:
1. **Go to Google Cloud Console** → "APIs & Services" → "Credentials"
2. **Click on your API key**
3. **Application restrictions**: HTTP referrers
4. **Add**: `https://xxwilliamn123.github.io/*`
5. **API restrictions**: Restrict key → Google Drive API

### OAuth Restrictions:
- Only `https://xxwilliamn123.github.io` is authorized
- Minimal scope: `drive.file` only

## 📧 Email Notifications Setup

### Option 1: EmailJS (Recommended)
1. **Sign up at [EmailJS](https://www.emailjs.com/)**
2. **Create email template**:
   ```
   Subject: New Wedding Photo Upload
   Body: 
   Guest: {{guest_name}}
   Email: {{guest_email}}
   Photos: {{photo_count}}
   Date: {{submission_date}}
   ```
3. **Update code** in `js/photo-upload.js`:
   ```javascript
   emailjs.send('your_service_id', 'your_template_id', {
       guest_name: submission.guest_name,
       guest_email: submission.guest_email,
       photo_count: submission.files.length,
       submission_date: submission.submission_date
   });
   ```

### Option 2: Google Apps Script
1. **Create Google Apps Script** project
2. **Set up web app** endpoint
3. **Send notifications** via Gmail

## 🛠️ Troubleshooting

### Common Issues:

**"Google Drive API not enabled"**
- ✅ Enable Google Drive API in Step 1

**"Invalid client ID"**
- ✅ Check Client ID from Step 2
- ✅ Verify domain in authorized origins

**"CORS errors"**
- ✅ Make sure using `https://xxwilliamn123.github.io`
- ✅ Check API key restrictions

**"Access denied"**
- ✅ Verify folder ID is correct
- ✅ Check folder permissions

### Testing Process:

1. **Local Testing**:
   ```bash
   # Start local server
   python -m http.server 3000
   # Visit: http://localhost:3000/gallery.html
   ```

2. **Production Testing**:
   - Visit: [https://xxwilliamn123.github.io/Wedding/gallery.html](https://xxwilliamn123.github.io/Wedding/gallery.html)
   - Test photo upload
   - Check Google Drive folder

## 📱 Mobile Testing

Test on mobile devices:
- [https://xxwilliamn123.github.io/Wedding/gallery.html](https://xxwilliamn123.github.io/Wedding/gallery.html)
- Ensure Google sign-in works
- Test photo selection and upload

## 🎯 Expected Workflow

1. **Guest visits** gallery page
2. **Clicks upload** section
3. **Fills form** with name, email, description
4. **Selects photos** (max 10, JPG/PNG)
5. **Signs in** to Google (first time only)
6. **Photos upload** to your Google Drive folder
7. **Success message** appears
8. **You receive** email notification
9. **Review photos** in Google Drive
10. **Approve/reject** via admin panel

## 📞 Support

If you need help:
1. **Check browser console** for errors
2. **Verify all credentials** are correct
3. **Test with simple file** first
4. **Check GitHub Pages** deployment status

## 🎉 Success Indicators

✅ Photos appear in Google Drive folder  
✅ Email notifications received  
✅ Admin panel shows submissions  
✅ Mobile uploads work  
✅ No console errors  

Your wedding photo upload system will be live and working perfectly on GitHub Pages! 