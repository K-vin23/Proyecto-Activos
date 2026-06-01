import { License, Model, Component } from "./catalog.type";
import { Area } from "./area.type";
import { CompanyList } from "./company.types";
import { SimpleUser } from "./user.types";

export interface AssetList {
    assetId: number,
    internalId: string,
    model: string,
    category: string,
    company: string,
    status: string,
}

export interface RemovedList {
    assetId: number,
    internalId: string,
    model: string,
    category: string,
    removalDate: Date,
    reason: string
}

export type AssetCategory = | 'LAP'| 'SFF' | 'TORR' | 'MON' | 'UPS';

export interface DetailedAsset {
    assetId: number,
    internalId: string,
    model: Model,
    area: Area,
    categoryId: AssetCategory,
    category: string, 
    company: CompanyList,
    status: string,
    serialNumber: string,
    responsable: SimpleUser | null, 
    purchaseDate: Date,
    invoice: string,
    networkName?: string | null,
    processor?: Component | null,
    details?: string,
    ram?: Component[] | [],
    storage?: Component[] | [],
    osLicense?: License,
    officeLicense?: License
}

export interface ComputerRequest {
    serialNumber: string, 
    networkName: string, 
    companyId: number, 
    categoryId: string, 
    invoice: string, 
    purchaseDate: Date, 
    internalId: string, 
    areaId: number, 
    modelId: number, 
    responsable: number, 
    memories: { id: number}[],
    disks: { id: number}[],
    licenses: { licenseId: number, licenseKey: string}[]
}