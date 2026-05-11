import { useState } from "react";

export interface Users {
    id: number,
    cpf: number,
    pagamento: number,


}


export const [studies, setStudies]= useState<Users[]> ([]);
export const [loading, setLoading] = useState(true);
export const [error, setError] = useState("");