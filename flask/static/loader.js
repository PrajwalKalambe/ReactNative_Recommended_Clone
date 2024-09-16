
document.addEventListener('DOMContentLoaded', async function() {

    await hideSpinner();

    // Add event listeners to form and input elements
    var forms = document.querySelectorAll('.form');
    forms.forEach(form => form.addEventListener('submit', handleFormSubmit));

    var buttons = document.querySelectorAll('.button');
    buttons.forEach(button => button.addEventListener('click', async function() {
        await showSpinner();
    }));
});

async function showSpinner() {
    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.loader').style.display = 'block';
    return Promise.resolve();
}

async function hideSpinner() {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.loader').style.display = 'none';
    return Promise.resolve();
}

async function handleFormSubmit(event) {
    await showSpinner();
    return true; // Allow form submission
}
