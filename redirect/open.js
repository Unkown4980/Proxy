
function getUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    return url;
}

const url = getUrlParameters();
if (url) {
    do_the_thing(url);
}

async function do_the_thing(url) {

    try {
        const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${url}`);

        const data = await response.text();

        if (data.toLowerCase().includes('<!doctype html')) {
            
            const bodydata = data.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '';
            const headdata = data.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';

            document.body.innerHTML += bodydata;
            document.head.innerHTML += headdata;

            injectscript('linkhandling.js');
            injectscript('relativelinks.js');
        } 

    } catch (error) {
        console.error('Error:', error);
    }
}

function injectscript(src){
    var absolutesrc = new URL(src, window.location.href).href; 
    const script = document.createElement('script');
    script.src = absolutesrc;
    document.head.appendChild(script);
}