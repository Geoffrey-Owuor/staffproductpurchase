// "use server";
// let cachedToken = null;
// let tokenExpiry = null;

// export async function getAuthToken() {
//   //If the token exists and it has not expired, return it
//   if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
//     return cachedToken;
//   }

//   try {
//     //Otherwise request a new one
//     const res = await fetch(
//       "https://hotpointapi.ngrok.dev/oneerpauth/api/login",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-tenanttype": "live",
//         },
//         body: JSON.stringify({
//           apiKey: process.env.ORION_API_KEY,
//         }),
//       },
//     );

//     if (!res.ok) throw new Error("Failed to fetch auth token");

//     const data = await res.json();
//     //Save token and compute expiry
//     cachedToken = data.token;
//     tokenExpiry = Date.now() + 14 * 60 * 1000; //14 minutes delay (1 minute buffer)

//     return cachedToken;
//   } catch (error) {
//     console.error("A network error occured:", error);
//     return null;
//   }
// }

"use server";
let cachedToken = null;
let tokenExpiry = null;
let tokenRefreshPromise = null;
const API_TIMEOUT = 10000; // 10 seconds timeout for the auth API

export async function getAuthToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  // If a refresh is already in progress, wait for it.
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  // Initiate a new refresh and store the promise (Concurrency Guard)
  tokenRefreshPromise = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const res = await fetch(
        "https://hotpointapi.ngrok.dev/oneerpauth/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-tenanttype": "live",
          },
          body: JSON.stringify({
            apiKey: process.env.ORION_API_KEY,
          }),
          signal: controller.signal, // Apply the timeout signal
        },
      );

      // Clear timeout if the request finished successfully
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error("Failed to fetch auth token");

      const data = await res.json();

      // Cache new token
      cachedToken = data.token;
      tokenExpiry = Date.now() + 14 * 60 * 1000;

      return cachedToken;
    } catch (error) {
      // Clear timeout if an error occurred before completion
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        console.error(
          `Auth token API request timed out after ${API_TIMEOUT / 1000}s.`,
        );
      } else {
        console.error("A network error occurred during token refresh:", error);
      }

      // On failure, ensure the cache is cleared and return null
      cachedToken = null;
      tokenExpiry = null;
      return null;
    } finally {
      // IMPORTANT: Clear the promise when done, allowing future attempts
      tokenRefreshPromise = null;
    }
  })();

  return tokenRefreshPromise;
}
