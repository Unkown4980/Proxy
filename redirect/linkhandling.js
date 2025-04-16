let hasUnsavedChanges = false;

document.addEventListener('click', function(event) {
    if (event.target.tagName === 'A' && event.target.href) {
        event.preventDefault(); // Prevent the default link behavior
        redirect(event.target.href); // Get the URL from the clicked link
    }
});


function redirect(url) {
    window.location.href = 'index.html?url=' + encodeURIComponent(url);
}