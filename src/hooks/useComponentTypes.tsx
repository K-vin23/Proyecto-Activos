import { useEffect, useState } from "react";
import { catalogService } from "@/services/asset/catalog.service"; 
import { ComponentType } from "@/types/catalog.type";

export function useComponentTypes() {
    const [componentTypes, setComponentTypes] = useState<ComponentType[]>([]);

    const fetchCategories = async () => {
        try {
            const types = await catalogService.getComponentTypes();
            setComponentTypes(types);
        } catch(e){
            console.error('error al cargar tipos de componente', e);
        }
    };
    
    useEffect(() => {
        fetchCategories();
    }, []);

    return {componentTypes};
}