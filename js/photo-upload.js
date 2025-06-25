// Guest Photo Upload Handler - Client-side only
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('guest-photo-upload-form');
    const fileInput = document.getElementById('photo-upload');
    const previewContainer = document.getElementById('preview-container');
    const uploadPreview = document.getElementById('upload-preview');
    
    // File validation constants
    const MAX_FILES = 10;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
    
    // Initialize storage
    initializeStorage();
    
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
        submitBtn.innerHTML = '<i class="icon-spinner" style="margin-right: 8px;"></i>Uploading...';
        submitBtn.disabled = true;
        
        // Process files and save to localStorage
        processAndSavePhotos(formData)
            .then(() => {
                showSuccessMessage('Photos uploaded successfully! They will be reviewed and approved within 24-48 hours.');
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
    
    // Process and save photos to localStorage
    async function processAndSavePhotos(formData) {
        const files = formData.getAll('photos[]');
        const guestName = formData.get('guest_name');
        const guestEmail = formData.get('guest_email');
        const photoDescription = formData.get('photo_description');
        
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
        
        // Process each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileData = await convertFileToBase64(file);
            
            submission.files.push({
                original_name: file.name,
                stored_name: generateId() + '_' + file.name,
                file_size: file.size,
                file_type: file.type,
                data: fileData
            });
        }
        
        // Save to localStorage
        saveSubmission(submission);
        
        // Send notification (optional - you can implement email service like EmailJS)
        sendNotification(submission);
    }
    
    // Convert file to base64
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    
    // Generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Initialize storage
    function initializeStorage() {
        if (!localStorage.getItem('photo_submissions')) {
            localStorage.setItem('photo_submissions', JSON.stringify([]));
        }
    }
    
    // Save submission to localStorage
    function saveSubmission(submission) {
        const submissions = JSON.parse(localStorage.getItem('photo_submissions') || '[]');
        submissions.push(submission);
        localStorage.setItem('photo_submissions', JSON.stringify(submissions));
    }
    
    // Send notification (placeholder for email service integration)
    function sendNotification(submission) {
        // You can integrate with EmailJS or other email services here
        console.log('New photo submission:', submission);
        
        // Example EmailJS integration (uncomment and configure if needed):
        /*
        emailjs.send('your_service_id', 'your_template_id', {
            guest_name: submission.guest_name,
            guest_email: submission.guest_email,
            photo_count: submission.files.length,
            submission_date: submission.submission_date
        });
        */
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