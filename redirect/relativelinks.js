// Step 1: Get all URL parameters and decode the "url" parameter
const params = new URLSearchParams(window.location.search);
let decodedUrl = decodeURIComponent(params.get('url') || '');
if (decodedUrl && !decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
    decodedUrl = 'http://' + decodedUrl;
}
console.log('Decoded URL:', decodedUrl);

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

if (decodedUrl && isValidUrl(decodedUrl)) {
    // Step 2: Find all relative src, href, onclick, and other attributes in the <head> and <body>
    const elements = Array.from(document.querySelectorAll('head [src], head [href], head [onclick], head [action], head [data-*], head [background], head [poster], head [cite], head [longdesc], head [profile], body [src], body [href], body [onclick], body [action], body [data-*], body [background], body [poster], body [cite], body [longdesc], body [profile]'));
    console.log('Elements with attributes that could use relative links in <head> and <body>:', elements);
    const relativeLinks = elements.filter(element => {
        const attrs = ['src', 'href', 'onclick', 'action', 'background', 'poster', 'cite', 'longdesc', 'profile'];
        return attrs.some(attr => {
            if (element.hasAttribute(attr)) {
                const value = element.getAttribute(attr);
                // Skip absolute URLs, data links, and JavaScript links
                return value && !value.startsWith('http://') && !value.startsWith('https://') && !value.startsWith('//') && !value.startsWith('data:') && !value.startsWith('javascript:');
            }
            return false;
        });
    });
    console.log('Found relative links:', relativeLinks);

    relativeLinks.forEach(element => {
        const attrs = ['src', 'href', 'onclick', 'action', 'background', 'poster', 'cite', 'longdesc', 'profile'];
        attrs.forEach(attr => {
            if (element.hasAttribute(attr)) {
                const value = element.getAttribute(attr);

                console.log(`Processing element:`, element);
                console.log(`Current ${attr} value:`, value);

                // Update the attribute only if it's relative
                if (value && !value.startsWith('http://') && !value.startsWith('https://') && !value.startsWith('//') && !value.startsWith('data:') && !value.startsWith('javascript:')) {
                    const absoluteValue = new URL(value, decodedUrl).href;
                    element.setAttribute(attr, absoluteValue);
                    console.log(`Updated ${attr}: ${value} -> ${absoluteValue}`);
                } else if (value && (value.startsWith('http://') || value.startsWith('https://'))) {
                    console.log(`No update needed for ${attr}:`, value);
                }
            }
        });
    });
} else {
    if (!decodedUrl) {
        console.error('The "url" parameter is missing in the query string.');
    } else {
        console.error(`The "url" parameter value "${decodedUrl}" is not a valid URL. Please provide a fully qualified URL (e.g., "http://example.com").`);
    }
}
