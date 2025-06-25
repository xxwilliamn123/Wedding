// Guest Attendance Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Find all guest attendance forms
    const forms = document.querySelectorAll('form.form-inline');
    
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = form.querySelector('#name').value.trim();
            const email = form.querySelector('#email').value.trim();
            
            // Validate form
            if (!name || !email) {
                alert('Please fill in both name and email fields.');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
            
            // Send email using a reliable method
            sendGuestAttendanceEmail(name, email, submitBtn, originalText);
        });
    });
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sendGuestAttendanceEmail(name, email, submitBtn, originalText) {
    console.log('Attempting to send email for:', name, email);
    
    // Try Formspree first (more reliable)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', 'Wedding Guest Attendance - ' + name);
    formData.append('message', `Guest Attendance Confirmation

Name: ${name}
Email: ${email}

This guest has confirmed their attendance for the wedding on October 18, 2025.

Please add this guest to your attendance list.`);

    // Use Formspree with your specific form ID
    fetch('https://formspree.io/f/xblypdkv', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        console.log('Formspree response:', response);
        if (response.ok) {
            console.log('Email sent successfully via Formspree');
            showSuccessMessage(submitBtn, originalText);
        } else {
            console.log('Formspree failed, trying mailto fallback');
            sendViaMailto(name, email, submitBtn, originalText);
        }
    })
    .catch(error => {
        console.log('Formspree error:', error);
        console.log('Using mailto fallback');
        sendViaMailto(name, email, submitBtn, originalText);
    });
}

function sendViaMailto(name, email, submitBtn, originalText) {
    console.log('Using mailto fallback for:', name, email);
    
    const mailtoLink = `mailto:montengro.cyndie1416@gmail.com?subject=Wedding Guest Attendance - ${encodeURIComponent(name)}&body=${encodeURIComponent(`Guest Attendance Confirmation

Name: ${name}
Email: ${email}

This guest has confirmed their attendance for the wedding on October 18, 2025.

Please add this guest to your attendance list.`)}`;
    
    // Open email client
    window.open(mailtoLink);
    
    // Show success message after a short delay
    setTimeout(function() {
        showSuccessMessage(submitBtn, originalText);
    }, 1000);
}

function showSuccessMessage(submitBtn, originalText) {
    alert('Thank you for confirming your attendance! An email has been sent to the couple.');
    
    // Reset form
    const form = submitBtn.closest('form');
    form.querySelector('#name').value = '';
    form.querySelector('#email').value = '';
    
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
}

// Alternative method using EmailJS (if configured)
function sendViaEmailJS(name, email, submitBtn, originalText) {
    if (typeof emailjs !== 'undefined') {
        // EmailJS configuration
        emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your EmailJS user ID
        
        const templateParams = {
            to_email: 'montengro.cyndie1416@gmail.com',
            from_name: name,
            from_email: email,
            message: `Guest Attendance Confirmation

Name: ${name}
Email: ${email}

This guest has confirmed their attendance for the wedding on October 18, 2025.

Please add this guest to your attendance list.`
        };
        
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showSuccessMessage(submitBtn, originalText);
            }, function(error) {
                console.log('FAILED...', error);
                // Fallback to mailto
                sendViaMailto(name, email, submitBtn, originalText);
            });
    } else {
        // Fallback to mailto if EmailJS is not available
        sendViaMailto(name, email, submitBtn, originalText);
    }
} 