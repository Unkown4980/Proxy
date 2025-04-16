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
    // Step 2: Find all relative src and href links in the <head> and <body>
    const elements = Array.from(document.querySelectorAll('head [src], head [href], body [src], body [href]'));
    console.log('Elements with [src] or [href] in <head> and <body>:', elements);
    const relativeLinks = elements.filter(element => {
        const attr = element.hasAttribute('src') ? 'src' : 'href';
        const value = element.getAttribute(attr);
        // Skip absolute URLs, data links, and JavaScript links
        return value && !value.startsWith('http://') && !value.startsWith('https://') && !value.startsWith('//') && !value.startsWith('data:') && !value.startsWith('javascript:');
    });
    console.log('Found relative links:', relativeLinks);

    relativeLinks.forEach(element => {
        const attr = element.hasAttribute('src') ? 'src' : 'href';
        const value = element.getAttribute(attr);

        console.log(`Processing element:`, element);
        console.log(`Current ${attr} value:`, value);

        // Handle lazy-loaded images with data-src
        if (attr === 'src' && element.hasAttribute('data-src')) {
            const dataSrcValue = element.getAttribute('data-src');
            console.log(`Found data-src attribute with value:`, dataSrcValue);

            if (dataSrcValue && !dataSrcValue.startsWith('http://') && !dataSrcValue.startsWith('https://') && !dataSrcValue.startsWith('//')) {
                const absoluteDataSrcValue = new URL(dataSrcValue, decodedUrl).href;
                element.setAttribute('data-src', absoluteDataSrcValue);
                console.log(`Updated data-src: ${dataSrcValue} -> ${absoluteDataSrcValue}`);
            }
        }

        // Update the main attribute (src or href) only if it's relative
        if (value && !value.startsWith('http://') && !value.startsWith('https://') && !value.startsWith('//') && !value.startsWith('data:') && !value.startsWith('javascript:')) {
            const absoluteValue = new URL(value, decodedUrl).href;
            element.setAttribute(attr, absoluteValue);
            console.log(`Updated ${attr}: ${value} -> ${absoluteValue}`);
        } else if (value && (value.startsWith('http://') || value.startsWith('https://'))) {
            console.log(`No update needed for ${attr}:`, value);
        }
    });
} else {
    if (!decodedUrl) {
        console.error('The "url" parameter is missing in the query string.');
    } else {
        console.error(`The "url" parameter value "${decodedUrl}" is not a valid URL. Please provide a fully qualified URL (e.g., "http://example.com").`);
    }
}
