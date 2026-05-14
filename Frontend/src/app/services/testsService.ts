import type { ApiTest } from "@/lib/types";

const API_URL = "http://localhost:5199";


export async function getTests(): Promise<ApiTest[]> {

    const response = await fetch(`${API_URL}/get-tests-full`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",

        },
    });

    if (!response.ok) {
        
        throw new Error("Failed to fetch!! GET TESTS");


    }

    return response.json();
    
}