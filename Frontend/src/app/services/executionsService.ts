import type { Execution } from "@/lib/types";

const API_URL = "http://localhost:5199";

export async function getExecutions(): Promise<Execution[]> {
    const response = await fetch(`${API_URL}/executions/get-executions-full`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    if (!response.ok) {
        throw new Error("Failed to fetch!! GET EXECUTIONS");
    }

    return response.json();
}

export async function runExecution(testId: number): Promise<Execution> {
    const response = await fetch(`${API_URL}/executions/run-execution`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ testId }),
    });

    if (!response.ok) {
        throw new Error("Failed to run execution");
    }

    return response.json();
}


