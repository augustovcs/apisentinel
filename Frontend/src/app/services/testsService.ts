import type { ApiTest } from "@/lib/types";
import type { CreateTestType } from "@/lib/types";

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

export async function postCreateTest(data: CreateTestType): Promise<ApiTest> {

    const cleanHeaders = Object.fromEntries(
    Object.entries(data.headers ?? {}).map(([key, value]) => [
      key.replace(/^"+|"+$/g, ""),
      typeof value === "string"
        ? value.replace(/^"+|"+$/g, "")
        : String(value),
    ])
  );
    const response = await fetch(`${API_URL}/tests/create-tests`, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            ...cleanHeaders
            
        },
        body: JSON.stringify({
            ...data,
            headers: cleanHeaders,
        }),
    });

     if (!response.ok) {
        console.log(await response.text())
        throw new Error("Failed to create test");
    }

    return response.json();
}

export async function patchUpdateTest(id: number, data: CreateTestType) : Promise<ApiTest> {

    const cleanHeaders = Object.fromEntries(
    Object.entries(data.headers ?? {}).map(([key, value]) => [
      key.replace(/^"+|"+$/g, ""),
      typeof value === "string"
        ? value.replace(/^"+|"+$/g, "")
        : String(value),
    ]))

    const response = await fetch(`${API_URL}/tests/update/${id}`, {
        method: "PATCH",
        headers:{
            "Content-Type": "application/json",
            
        },
        body: JSON.stringify({
            ...data,
            headers: cleanHeaders,
        }), 
    });
    console.log("PATCH RESPONSE", data);
    if (!response.ok) {
        console.log(await response.text())
        throw new Error("Failed to update test");
    }

    return response.json();
}

export async function deleteTests(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/tests/delete/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`Failed to delete the test ${id}`)
    }

}