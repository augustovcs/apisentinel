import type { ApiTest } from "@/lib/types";

const API_URL = "http://localhost:5199";


export async function getTests(): Promise<ApiTest[]> {

    const response = await fetch(`${API_URL}/tests/get-tests-full`, {
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

export async function getTestsById(id: number): Promise<ApiTest> {
    //console.log("ID:", id);
    const response = await fetch(`${API_URL}/tests/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
     
     if (!response.ok) {
        console.log(response.status)
        throw new Error("Failed to fetch!! GET TESTS BY");
    }

    return response.json();
}