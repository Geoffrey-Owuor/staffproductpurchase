export const defaultClosureCounts = {
  open: 0,
  closed: 0,
  approved: 0,
};

export async function fetchTrackingCounts() {
  try {
    const response = await fetch("/api/closure-counts");
    if (!response.ok) throw new Error("Failed to fetch closure counts");

    const data = await response.json();

    return {
      open: data.open || 0,
      closed: data.closed || 0,
      approved: data.approved || 0,
    };
  } catch (error) {
    console.error("Error fetching approval counts:", error);
    return defaultClosureCounts;
  }
}
