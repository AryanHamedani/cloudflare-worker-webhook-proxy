// Replace with your target webhook URL (include trailing slash)
const TARGET_BASE_URL = 'https://your-target-domain.com/';

async function handleRequest(request) {
  try {
    // Construct the new URL by replacing the worker URL with target base URL
    const url = new URL(request.url);
    const newUrl = TARGET_BASE_URL + url.pathname.slice(1) + url.search;

    // Clone the original headers
    const headers = new Headers(request.headers);
    
    // Update Host header to match the target domain
    headers.set('Host', new URL(TARGET_BASE_URL).hostname);

    // Forward the request preserving method, headers, and body
    const response = await fetch(newUrl, {
      method: request.method,
      headers: headers,
      body: request.body
    });

    // Return the target service response to original caller
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  } catch (error) {
    return new Response('Error forwarding request: ' + error.message, { status: 500 });
  }
}

// Listen for incoming requests and handle them
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});