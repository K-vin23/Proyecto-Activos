import { useEffect, useState } from "react";
import { catalogService } from "@/services/asset/catalog.service"; 
import { Brand } from "@/types/catalog.type";

export function useBrands() {
    const [brands, setBrands] = useState<Brand[]>([]);

    const fetchBrands = async () => {
        try {
            const brds = await catalogService.getBrands();
            
            // console.log("HOOK_API_RESPONSE:", brds);
            setBrands(brds);
        } catch(e){
            console.error('error al cargar marcas', e);
            setBrands([]);
        }
    };
    
    useEffect(() => {
        fetchBrands();
    }, []);

    return {brands, fetchBrands};
}