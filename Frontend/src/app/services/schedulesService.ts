import { Schedule } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getSchedules(): Promise<Schedule[]> {
  try {
    const response = await fetch(`${API_URL}/schedules/list/all`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch {
    throw new Error("Failed to fetch schedules");
  }
}

export async function getScheduleById(id: number): Promise<Schedule> {
  try {
    const response = await fetch(`${API_URL}/schedules/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch {
    throw new Error("Failed to fetch schedule");
  }
}

export async function createSchedule(
  testId: number,
  intervalSeconds: number,
  name?: string,
  description?: string
): Promise<Schedule> {
  try {
    const response = await fetch(`${API_URL}/schedules/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        testId,
        intervalSeconds,
        isActive: true,
        name,
        description,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch {
    throw new Error("Failed to create schedule");
  }
}

export async function updateSchedule(
  id: number,
  intervalSeconds: number,
  isActive: boolean,
  name?: string,
  description?: string
): Promise<Schedule> {
  try {
    const response = await fetch(`${API_URL}/schedules/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        intervalSeconds,
        isActive,
        name,
        description,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch {
    throw new Error("Failed to update schedule");
  }
}

export async function toggleSchedule(id: number, isActive: boolean): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/schedules/${id}/toggle?isActive=${isActive}`, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch {
    throw new Error("Failed to toggle schedule");
  }
}

export async function deleteSchedule(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/schedules/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch {
    throw new Error("Failed to delete schedule");
  }
}
