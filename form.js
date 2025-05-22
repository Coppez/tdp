
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', validateAndSubmitForm);
    }
});

function validateAndSubmitForm(event) {
    event.preventDefault();
    
    const messageField = document.getElementById('message');
    const messageError = document.getElementById('message-error');
    const formMessage = document.getElementById('form-message');
    const submitButton = document.getElementById('btn-submit');
    
    if (messageError) messageError.textContent = '';
    if (formMessage) {
        formMessage.textContent = '';
        formMessage.style.display = 'none';
        formMessage.className = 'alert';
    }
    
    // flag messa di default a true per controllo messaggio
    let isValid = true;
    
    // Validazione messaggio
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
    
    if (isValid) {

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Invio in corso...';
        }
        
        setTimeout(() => {
            if (formMessage) {
                formMessage.textContent = 'Il tuo messaggio è stato inviato con successo!';
                formMessage.style.color = "#41ac41";
                formMessage.style.borderColor = "#41ac41";
                formMessage.style.display = 'block';
            }
                        
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Invia';
            }
            
            emailField.classList.remove('is-valid');
            messageField.classList.remove('is-valid');
        }, 1500);
    }
}