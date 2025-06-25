# Email Setup Guide for Wedding Website

## Overview
The guest attendance forms across all pages are now configured to send emails to `montengro.cyndie1416@gmail.com` when guests confirm their attendance.

## Current Implementation
The forms currently use a fallback method that opens the user's default email client with a pre-filled email to the couple.

## Enhanced EmailJS Setup (Recommended)

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Add EmailJS to Your Website
Add the EmailJS script to all HTML pages before the closing `</body>` tag:

```html
<!-- EmailJS -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

### Step 3: Configure EmailJS
1. In your EmailJS dashboard, create a new Email Service
2. Choose your email provider (Gmail, Outlook, etc.)
3. Connect your email account
4. Create an email template with the following variables:
   - `to_email`
   - `from_name`
   - `from_email`
   - `message`

### Step 4: Update JavaScript Configuration
In `js/guest-form.js`, replace the placeholder values:

```javascript
emailjs.init("YOUR_EMAILJS_USER_ID"); // Your EmailJS user ID
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
```

Replace:
- `YOUR_EMAILJS_USER_ID` with your actual EmailJS user ID
- `YOUR_SERVICE_ID` with your email service ID
- `YOUR_TEMPLATE_ID` with your email template ID

## Alternative: Formspree Setup

If you prefer Formspree:

1. Go to [Formspree.io](https://formspree.io/)
2. Create a free account
3. Create a new form
4. Replace `YOUR_FORMSPREE_ID` in the JavaScript with your actual form ID
5. Uncomment the Formspree function in `js/guest-form.js`

## Testing
1. Fill out the guest attendance form on any page
2. Submit the form
3. Check that an email is sent to `montengro.cyndie1416@gmail.com`
4. Verify the email contains the guest's name and email address

## Files Modified
- `js/guest-form.js` - Main form handling script
- `index.html` - Added form handler script
- `guest.html` - Added form handler script
- `groom-bride.html` - Added form handler script
- `when-where.html` - Added form handler script
- `gallery.html` - Added form handler script
- `blog.html` - Added form handler script

## Form Features
- ✅ Form validation (name and email required)
- ✅ Email format validation
- ✅ Loading state during submission
- ✅ Success message after submission
- ✅ Form reset after successful submission
- ✅ Works across all pages
- ✅ Fallback to mailto if EmailJS is not available

## Troubleshooting
- If emails are not being sent, check the browser console for errors
- Ensure EmailJS is properly configured with correct IDs
- Verify that the email address `montengro.cyndie1416@gmail.com` is correct
- Test the fallback mailto functionality if EmailJS fails 