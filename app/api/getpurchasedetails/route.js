import { getAuthToken } from "@/utils/tokenManager";

//Getting the current date
const now = new Date();

//Formatting the date as DD-MM-YYYY

const day = String(now.getDate()).padStart(2, "0");
const month = String(now.getMonth() + 1).padStart(2, "0");
const year = now.getFullYear();

const formattedDate = `${day}-${month}-${year}`;

export async function POST(request) {
  try {
    const token = await getAuthToken();
    const { productcode } = await request.json();

    const res = await fetch(
      "https://hotpointapi.ngrok.dev/oneerpreport/api/getapi",
      {
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
            P_PL_CODE: "%TRADE%", //Should be PL code
            P_INCLUSIVE: "I",
            P_ITEM_CODE: productcode,
            P_COMP_CODE: "HAL",
          },
        }),
      },
    );

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch purchase details" },
        { status: res.status },
      );
    }

    const data = await res.json();

    //Check if the response is an array containing price
    if (Array.isArray(data) && data.length > 0 && data[0].PRICE) {
      return Response.json({
        itemname: data[0].PRICE.ITM_NAME,
        tdprice: data[0].PRICE.RATE,
      });
    } else {
      // fallback when array is empty or unexpected structure
      return Response.json(
        {
          message: `No product found for the code: ${productcode}`,
        },
        { status: 404 }, //To make sure that response is not ok and get the message
      );
    }
  } catch (error) {
    console.error("Price api error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
