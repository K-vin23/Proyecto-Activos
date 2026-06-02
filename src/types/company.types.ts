export interface CompanyList {
    companyId: number;
    company: string;
    status: string;
}

export interface CreateCompany {
    company: string,
    cityId: string
}