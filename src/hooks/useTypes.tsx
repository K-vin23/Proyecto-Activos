import { useEffect, useState } from "react";
import { catalogService } from "@/services/asset/catalog.service"; 
import { Type } from "@/types/catalog.type";

export function useTypes() {
    const [types, setTypes] = useState<Type[]>([]);

    const fetchTypes = async () => {
        try {
            const types = await catalogService.getTypes();
            setTypes(types);
        } catch(e){
            console.error('error al cargar los tipos de activos', e);
        }
    };
    
    useEffect(() => {
        fetchTypes();
    }, []);

    return {types, fetchTypes};
}