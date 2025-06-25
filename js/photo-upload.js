// Guest Photo Upload Handler - Google Drive Integration
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('guest-photo-upload-form');
    const fileInput = document.getElementById('photo-upload');
    const previewContainer = document.getElementById('preview-container');
    const uploadPreview = document.getElementById('upload-preview');
    
    // File validation constants
    const MAX_FILES = 10;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
    
    // Google Drive API configuration
    const GOOGLE_DRIVE_FOLDER_ID = '12_cbg4e4_yR7BuScccf7StKtWGYp_-Uj';
    const CLIENT_ID = '827239835191-a9253av5isgv64lf7hirc41cn5b8odl2.apps.googleusercontent.com';
    const API_KEY = 'AIzaSyCK8nThAdDVVlGSjdyRzkJHd6-7SJdHaDw';
    
    // Initialize Google Drive API
    initializeGoogleDrive();
    
    // Handle file selection and preview
    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        // Validate number of files
        if (files.length > MAX_FILES) {
            alert(`Please select maximum ${MAX_FILES} photos only.`);
            fileInput.value = '';
            return;
        }
        
        // Validate file types and sizes
        const validFiles = [];
        const invalidFiles = [];
        
        files.forEach(file => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                invalidFiles.push(`${file.name} - Invalid file type`);
            } else if (file.size > MAX_FILE_SIZE) {
                invalidFiles.push(`${file.name} - File too large (max 5MB)`);
            } else {
                validFiles.push(file);
            }
        });
        
        if (invalidFiles.length > 0) {
            alert('Some files were rejected:\n' + invalidFiles.join('\n'));
        }
        
        // Show preview for valid files
        if (validFiles.length > 0) {
            showPreview(validFiles);
        } else {
            hidePreview();
        }
    });
    
    // Show file preview
    function showPreview(files) {
        previewContainer.innerHTML = '';
        uploadPreview.style.display = 'block';
        
        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewDiv = document.createElement('div');
                previewDiv.className = 'col-md-3 col-sm-4 col-xs-6';
                previewDiv.style.marginBottom = '15px';
                
                previewDiv.innerHTML = `
                    <div style="position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <img src="${e.target.result}" alt="Preview ${index + 1}" 
                             style="width: 100%; height: 150px; object-fit: cover;">
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 5px; font-size: 12px; text-align: center;">
                            ${file.name}
                        </div>
                    </div>
                `;
                
                previewContainer.appendChild(previewDiv);
            };
            reader.readAsDataURL(file);
        });
    }
    
    // Hide preview
    function hidePreview() {
        uploadPreview.style.display = 'none';
        previewContainer.innerHTML = '';
    }
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="icon-spinner" style="margin-right: 8px;"></i>Uploading to Google Drive...';
        submitBtn.disabled = true;
        
        // Upload to Google Drive
        uploadToGoogleDrive(formData)
            .then(() => {
                showSuccessMessage('Photos uploaded successfully to Google Drive! They will be reviewed and approved within 24-48 hours.');
                form.reset();
                hidePreview();
            })
            .catch(error => {
                console.error('Error:', error);
                showErrorMessage('An error occurred while uploading. Please try again.');
            })
            .finally(() => {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
    
    // Initialize Google Drive API
    function initializeGoogleDrive() {
        // Load Google Drive API
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = function() {
            gapi.load('client:auth2', initClient);
        };
        document.head.appendChild(script);
    }
    
    // Initialize Google Drive client
    function initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            scope: 'https://www.googleapis.com/auth/drive.file'
        }).then(function() {
            console.log('Google Drive API initialized');
        }).catch(function(error) {
            console.error('Error initializing Google Drive API:', error);
        });
    }
    
    // Upload files to Google Drive
    async function uploadToGoogleDrive(formData) {
        const files = formData.getAll('photos[]');
        const guestName = formData.get('guest_name');
        const guestEmail = formData.get('guest_email');
        const photoDescription = formData.get('photo_description');
        
        // Authenticate with Google Drive
        const authInstance = gapi.auth2.getAuthInstance();
        if (!authInstance.isSignedIn.get()) {
            await authInstance.signIn();
        }
        
        const submission = {
            id: generateId(),
            guest_name: guestName,
            guest_email: guestEmail,
            photo_description: photoDescription,
            files: [],
            submission_date: new Date().toISOString(),
            status: 'pending',
            approved_by: null,
            approved_date: null
        };
        
        // Upload each file to Google Drive
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const driveFile = await uploadFileToDrive(file, guestName);
            
            submission.files.push({
                original_name: file.name,
                drive_file_id: driveFile.id,
                drive_file_name: driveFile.name,
                file_size: file.size,
                file_type: file.type,
                drive_web_view_link: driveFile.webViewLink
            });
        }
        
        // Save submission metadata to localStorage (or you can use a database)
        saveSubmission(submission);
        
        // Send notification
        sendNotification(submission);
    }
    
    // Upload single file to Google Drive
    function uploadFileToDrive(file, guestName) {
        const metadata = {
            name: `${guestName}_${Date.now()}_${file.name}`,
            parents: [GOOGLE_DRIVE_FOLDER_ID],
            mimeType: file.type
        };
        
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        form.append('file', file);
        
        return gapi.client.request({
            path: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
            method: 'POST',
            params: {
                uploadType: 'multipart'
            },
            headers: {
                'Authorization': 'Bearer ' + gapi.auth.getToken().access_token
            },
            body: form
        }).then(function(response) {
            return response.result;
        });
    }
    
    // Generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Save submission metadata
    function saveSubmission(submission) {
        const submissions = JSON.parse(localStorage.getItem('photo_submissions') || '[]');
        submissions.push(submission);
        localStorage.setItem('photo_submissions', JSON.stringify(submissions));
    }
    
    // Send notification (EmailJS integration)
    function sendNotification(submission) {
        // EmailJS integration for notifications
        if (typeof emailjs !== 'undefined') {
            emailjs.send('your_service_id', 'your_template_id', {
                guest_name: submission.guest_name,
                guest_email: submission.guest_email,
                photo_count: submission.files.length,
                submission_date: submission.submission_date,
                drive_folder_link: `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}`
            });
        }
        
        console.log('New photo submission to Google Drive:', submission);
    }
    
    // Show success message
    function showSuccessMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.style.cssText = 'margin-top: 20px; border-radius: 8px;';
        alertDiv.innerHTML = `
            <i class="icon-checkmark" style="margin-right: 8px;"></i>
            ${message}
        `;
        
        form.parentNode.insertBefore(alertDiv, form.nextSibling);
        
        // Remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
    
    // Show error message
    function showErrorMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger';
        alertDiv.style.cssText = 'margin-top: 20px; border-radius: 8px;';
        alertDiv.innerHTML = `
            <i class="icon-warning" style="margin-right: 8px;"></i>
            ${message}
        `;
        
        form.parentNode.insertBefore(alertDiv, form.nextSibling);
        
        // Remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}); 