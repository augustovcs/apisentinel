import type { DashboardMain } from "@/lib/types";

const API_URL = "http://localhost:5199";

// Fetch dashboard aggregated payload from the backend
export async function getDashboardMain(): Promise<DashboardMain> {
  const res = await fetch(`${API_URL}/pages/dashboard-main`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return res.json();
}
