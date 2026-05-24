"use client";



import { useState, useEffect } from "react";
import Spinner from "@/components/ui/Spinner";

export interface Users {
  id: number;
  cpf: number;
  pagamento: number;
}

export default function PageStudies() {

    const [studies, setStudies]= useState<Users[]> ([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadStudies() {

        try {
            const response = await fetch("http://localhost:5199/Pessoa");
            
            if (!response.ok) {
                throw new Error(`Erro http: ${response.status}`)
            }

            const data = await response.json();

            setStudies(data);
        }
        catch (err) {
            if(err instanceof Error) {
                setError(err.message);
            }
            else {
                setError("Erro desconhecido!");
            }
        }
        finally {
            setLoading(false);
        }
    }

    useEffect( () => {
        loadStudies();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items justify-center pb-30">
                <Spinner size="xl" />
            </div>
        );
    }
    
    if (error) {
        return <div> {error} </div>
    }

    return (
        <div>
            
            <h1> Hello Students </h1>
            {studies.map((study) => (
                <div 
                key={study.id}
                style={{display:"flex",
                        gap: "10px",
                        marginBottom: "0.2rem"
                }}>
                </div>

            ))}

                <h2>CPF's: {studies.map(study => study.cpf).join(" | ")}</h2>
                <h2>Métodos de pagamento: {studies.map(study => study.pagamento).join(" | ")}</h2>

        </div>

    )
}