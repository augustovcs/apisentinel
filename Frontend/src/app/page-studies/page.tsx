"use client";



import { useState, useEffect } from "react";


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
        return <div>
            <h1> Carregando... </h1>
        </div>
    }
    
    if (error) {
        return <div> {error} </div>
    }

    return (
        <div>
            
            <h1> Hello Students </h1>
            {studies.map((study) => (
                <div key={study.id}>
                    <h2>{study.cpf}</h2>
                    <h2>{study.pagamento}</h2>
                </div>

            ))}
        </div>

    )
}