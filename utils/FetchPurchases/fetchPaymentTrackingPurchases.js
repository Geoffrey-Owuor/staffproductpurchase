export async function fetchPaymentTrackingPurchases() {
  try {
    // This endpoint should return only fully-approved purchases
    // (i.e. those visible in the Payment Tracking / Invoicing view).
    // Adjust the URL/params to match your existing API contract.
    const response = await fetch(
      `/api/tablesdata/purchaseshistorydata?filterType=staff&fetchAll=true&biApproval=true`,
    );

    if (!response.ok)
      throw new Error("Failed to fetch payment tracking purchases");

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching payment tracking purchases:", error);
    return [];
  }
}
