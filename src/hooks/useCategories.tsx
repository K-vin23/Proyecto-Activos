import { useEffect, useState } from "react";
import { catalogService } from "@/services/asset/catalog.service"; 
import { ComponentCategory } from "@/types/catalog.type";

export function useCategories() {
    const [categories, setCategories] = useState<ComponentCategory[]>([]);

    const fetchCategories = async () => {
        try {
            const categories = await catalogService.getCategories();
            setCategories(categories);
        } catch(e){
            console.error('error al cargar categorias', e);
        }
    };
    
    useEffect(() => {
        fetchCategories();
    }, []);

    return {categories};
}