import { ExecutionLog, AnalyticsData } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getAllLogs(): Promise<ExecutionLog[]> {
  try {
    const response = await fetch(`${API_URL}/logs/list/all`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch {
    throw new Error("Failed to fetch logs");
  }
}

export async function getLogById(id: number): Promise<ExecutionLog> {
  try {
    const response = await fetch(`${API_URL}/logs/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch {
    throw new Error("Failed to fetch log");
  }
}

export async function getLogsByTestId(testId: number): Promise<ExecutionLog[]> {
  try {
    const response = await fetch(`${API_URL}/logs/test/${testId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch {
    throw new Error("Failed to fetch logs for test");
  }
}

export async function getLogsByScheduleId(scheduleId: number): Promise<ExecutionLog[]> {
  try {
    const response = await fetch(`${API_URL}/logs/schedule/${scheduleId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch {
    throw new Error("Failed to fetch logs for schedule");
  }
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    const response = await fetch(`${API_URL}/logs/analytics/data`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch {
    throw new Error("Failed to fetch analytics data");
  }
}

export async function getLogsByDateRange(
  startDate: string,
  endDate: string
): Promise<ExecutionLog[]> {
  try {
    const response = await fetch(
      `${API_URL}/logs/date-range?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch {
    throw new Error("Failed to fetch logs for date range");
  }
}

export async function deleteLog(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/logs/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch {
    throw new Error("Failed to delete log");
  }
}
