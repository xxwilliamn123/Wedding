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