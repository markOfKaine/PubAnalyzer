
// Use environment variable on production
// For local development, leave this empty as it will use the next.config.mjs rewrites
// run django on port 8000 for local development and this should work as is
const API_URL = '';

// Helper to get CSRF token from cookies
const getCSRFToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

// Cache the CSRF token promise to avoid multiple simultaneous requests
let csrfTokenPromise = null;

export const ensureCSRFToken = async () => {
  // Check if we already have a token
  const existingToken = getCSRFToken();
  if (existingToken) {
    return existingToken;
  }
  
  console.log("CSRF token not found, fetching new token...");
  // If a request is already in flight, wait for it
  if (csrfTokenPromise) {
    await csrfTokenPromise;
    return getCSRFToken();
  }
  
  // Fetch a new token
  csrfTokenPromise = fetch(`${API_URL}/api/csrf/`, {
    credentials: 'include',
  }).finally(() => {
    csrfTokenPromise = null;
  });
  
  await csrfTokenPromise;
  console.log("CSRF token fetched successfully");
  return getCSRFToken();
};

// Function to make API calls with CSRF token handling
export const apiCall = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        ...options.headers,
      },
      credentials: "include",
    };

    if (options.body && typeof options.body === "string") {
        config.headers["Content-Type"] = "application/json";
    }
  
  // Get CSRF token for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method?.toUpperCase())) {
    const csrfToken = await ensureCSRFToken();
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }
  
  const response = await fetch(url, config);
  return response;
};

// Function to make API calls with FormData
export const apiCallWithFormData = async (endpoint, formData) => {
  const url = `${API_URL}${endpoint}`;
  
  // Get CSRF token
  const csrfToken = await ensureCSRFToken();

  // For FormData, don't set Content-Type
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-CSRFToken': csrfToken,
    },
    credentials: 'include',
    body: formData,
  });
  
  return response;
};