// Email contact form validation and submission

document.addEventListener('DOMContentLoaded', function() {
    // Get the contact form if it exists
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', validateAndSubmitForm);
    }
});

/**
 * Validates the form and submits if valid
 * @param {Event} event - The form submission event
 */
function validateAndSubmitForm(event) {
    event.preventDefault(); // Prevent the default form submission
    
    // Get form fields
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formMessage = document.getElementById('form-message');
    
    // Clear previous error messages
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';
    if (formMessage) {
        formMessage.textContent = '';
        formMessage.style.display = 'none';
        formMessage.className = 'alert';
    }
    
    // Flag to track validity
    let isValid = true;
    
    // Validate email using regex
    if (!validateEmail(emailField.value)) {
        isValid = false;
        if (emailError) {
            emailError.textContent = 'Per favore, inserisci un indirizzo email valido.';
        }
        emailField.classList.add('is-invalid');
    } else {
        emailField.classList.remove('is-invalid');
        emailField.classList.add('is-valid');
    }
    
    // Validate message (not empty)
    if (!messageField.value.trim()) {
        isValid = false;
        if (messageError) {
            messageError.textContent = 'Per favore, inserisci un messaggio.';
        }
        messageField.classList.add('is-invalid');
    } else {
        messageField.classList.remove('is-invalid');
        messageField.classList.add('is-valid');
    }
    
    // If form is valid, simulate sending the email
    if (isValid) {
        // Get form data
        const email = emailField.value;
        const message = messageField.value;
        
        // Disable the submit button and show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Invio in corso...';
        }
        
        // Simulate sending an email to educazionestradale.info@gmail.com
        // In a real application, you would use a backend service or email API
        setTimeout(() => {
            console.log("Email inviata a: educazionestradale.info@gmail.com");
            console.log("Da: " + email);
            console.log("Messaggio: " + message);
            
            // Show success message
            if (formMessage) {
                formMessage.textContent = 'Il tuo messaggio è stato inviato con successo!';
                formMessage.className = 'alert alert-success';
                formMessage.style.display = 'block';
            }
            
            // Reset form
            contactForm.reset();
            
            // Reset button state
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Invia';
            }
            
            // Remove validation classes
            emailField.classList.remove('is-valid');
            messageField.classList.remove('is-valid');
        }, 1500);
    }
}

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}