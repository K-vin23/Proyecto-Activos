import { useEffect, useState } from "react";
import { companiesService } from "@/services/company/companies.service";
import { CompanyList } from "@/types/company.types";

export function useCompanies() {
    const [companies, setCompanies] = useState<CompanyList[]>([]);
    const [companiesLoading, setIsCompaniesLoading] = useState(true);

    const fetchCompanies = async () => {
            try {
                const compRes = await companiesService.list({status: "Active"});
                setCompanies(compRes.data);
            }catch (e){
                console.error("Error loading companies: ", e);
            }finally{
                setIsCompaniesLoading(false);
            }
    };
    
    useEffect(() => {
        fetchCompanies();
    }, []);

    return {companies, companiesLoading};
}