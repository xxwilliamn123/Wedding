// Guest Photo Upload Handler - Google Apps Script Integration
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('guest-photo-upload-form');
    const fileInput = document.getElementById('photo-upload');
    const previewContainer = document.getElementById('preview-container');
    const uploadPreview = document.getElementById('upload-preview');
    
    // File validation constants
    const MAX_FILES = 10;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
    
    // Google Apps Script Web App URL
    // IMPORTANT: Use the /exec endpoint (not /dev) for production
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzqhjk9xjME1X18aiBkVTDdW0NtDzLaR8s5BTrSZa5uWHtdpK5gK5e05w4HqhBFEgYv/exec';
    
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
        submitBtn.innerHTML = '<i class="icon-spinner" style="margin-right: 8px;"></i>Uploading Photos...';
        submitBtn.disabled = true;
        
        // Upload to Google Apps Script
        uploadToGoogleAppsScript(formData)
            .then(() => {
                showSuccessMessage('Photos uploaded successfully! You will receive an email confirmation shortly.');
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
    
    // Upload to Google Apps Script
    async function uploadToGoogleAppsScript(formData) {
        const files = formData.getAll('photos[]');
        const guestName = formData.get('guest_name');
        const guestEmail = formData.get('guest_email');
        const photoDescription = formData.get('photo_description');
        
        console.log(`Preparing bulk upload of ${files.length} files`);
        
        // Prepare all files for bulk upload
        const fileDataArray = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log('Processing file for bulk upload:', file.name, 'Size:', file.size, 'Type:', file.type);
            
            try {
                // Convert file to base64
                const base64Data = await fileToBase64(file);
                
                fileDataArray.push({
                    fileName: file.name,
                    fileType: file.type,
                    fileData: base64Data
                });
                
            } catch (error) {
                console.error('Error processing file for bulk upload:', file.name, error);
                throw new Error(`Failed to process ${file.name}: ${error.message}`);
            }
        }
        
        console.log(`Sending bulk upload request with ${fileDataArray.length} files`);
        
        try {
            // Create URL-encoded form data for bulk upload
            const uploadData = new URLSearchParams();
            uploadData.append('guestName', guestName);
            uploadData.append('guestEmail', guestEmail);
            uploadData.append('description', photoDescription || '');
            uploadData.append('fileDataArray', JSON.stringify(fileDataArray));
            
            // Upload all files in a single request
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: uploadData.toString()
            });
            
            console.log('Bulk upload response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Bulk upload response error:', errorText);
                throw new Error(`Bulk upload failed: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('Bulk upload result:', result);
            
            if (!result.success) {
                throw new Error(result.message || 'Bulk upload failed');
            }
            
            console.log(`Bulk upload completed successfully. ${result.successfulUploads} files uploaded, ${result.failedUploads} failed.`);
            
            // Save submission metadata to localStorage
            const submission = {
                id: generateId(),
                guest_name: guestName,
                guest_email: guestEmail,
                photo_description: photoDescription,
                files: result.uploadedFiles || [],
                failed_files: result.failedFiles || [],
                submission_date: new Date().toISOString(),
                status: 'pending',
                total_files: result.totalFiles,
                successful_uploads: result.successfulUploads,
                failed_uploads: result.failedUploads
            };
            
            console.log('Bulk photo upload completed successfully. Admin panel will fetch from Google Drive.');
            
        } catch (error) {
            console.error('Bulk upload error:', error);
            throw new Error(`Bulk upload failed: ${error.message}`);
        }
    }
    
    // Convert file to base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }
    
    // Generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
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