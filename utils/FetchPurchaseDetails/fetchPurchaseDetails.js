export async function fetchPurchaseDetails(id) {
  try {
    const res = await fetch(`/api/generalviewpurchases/${id}`);
    if (!res.ok) throw new Error("Failed to fetch purchase");
    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching approval counts:", error);
    return null;
  }
}
