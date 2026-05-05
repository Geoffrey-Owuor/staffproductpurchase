export const defaultCounts = {
  pending: 0,
  declined: 0,
  approved: 0,
  total: 0,
  totalDeclined: 0,
  totalApproved: 0,
};

export async function fetchApprovalCounts() {
  try {
    const response = await fetch("/api/approval-counts");
    if (!response.ok) throw new Error("Failed to fetch approval counts");

    const data = await response.json();

    return {
      pending: data.pending || 0,
      declined: data.declined || 0,
      approved: data.approved || 0,
      total: data.total || 0,
      totalDeclined: data.totalDeclined || 0,
      totalApproved: data.totalApproved || 0,
    };
  } catch (error) {
    console.error("Error fetching approval counts:", error);
    return defaultCounts;
  }
}
