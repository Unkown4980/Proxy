document.addEventListener('click', function(event) {
    if (event.target.tagName === 'A' && event.target.href) {
        event.preventDefault(); // Prevent the default link behavior
    }
    
});