import { getAuthToken } from "@/utils/tokenManager";

// Set a timeout constant for resilience (e.g., 15 seconds)
const API_TIMEOUT = 15000;

export async function POST(request) {
  // Getting the current date
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const token = await getAuthToken();
    const { productCode } = await request.json();

    const fetchOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        APICODE: "PRICEAPIHP",
        M_USER_ID: "SYSADMIN",
        M_LANG_CODE: "ENG",
        M_COMP_CODE: "001",
        filter: {
          P_DT: formattedDate,
          P_PL_CODE: "%TRADE%", // Should be PL code
          P_INCLUSIVE: "I",
          P_ITEM_CODE: productCode,
          P_COMP_CODE: "HAL",
        },
      }),
      signal: controller.signal, // Attaches the timeout controller
    };

    const res = await fetch(
      "https://hotpointapi.ngrok.dev/oneerpreport/api/getapi",
      fetchOptions,
    );

    // Clear timeout as fetch succeeded
    clearTimeout(timeoutId);

    if (!res.ok) {
      // Log the specific API failure status
      console.error(`External API returned status: ${res.status}`);
      return Response.json(
        { error: "Failed to fetch price details from external API" },
        { status: res.status },
      );
    }

    const data = await res.json();

    if (Array.isArray(data) && data.length > 0 && data[0].PRICE) {
      return Response.json({
        itemName: data[0].PRICE.ITM_NAME,
        tdPrice: data[0].PRICE.RATE,
      });
    } else {
      return Response.json(
        {
          message: `No product found for the code: ${productCode}`,
        },
        { status: 404 },
      );
    }
  } catch (error) {
    // Clear timeout if an error occurred before completion
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      console.error("Price API request timed out after 15s.");
      return Response.json(
        { error: "External API response timeout" },
        { status: 504 },
      ); // Gateway Timeout
    }

    console.error("Price api error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
