export async function fetchStaffPurchases(fetchAllData) {
  try {
    let url = `/api/staffpurchaseshistory?filterType=approval`;

    //Telling the api if we should fetch all the data or if biApproval is true
    if (fetchAllData) {
      url += `&fetchAll=true`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch purchases");

    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return [];
  }
}
