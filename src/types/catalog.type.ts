export interface License{
    licenseId: number,
    licenseKey: string,
    softwareType: string,
}

export interface LicenseList {
  licenseId: number;
  providerId: number;
  softwareType: "OFFI" | "SO";
  software: string;
  sofVersion: string;
}

export interface ComponentCategory {
    categoryId: string,
    category: string
}

export interface ComponentType {
    ctypeId: number,
    categoryId: string,
    compType: string
}

export interface Component {
    id: number,
    name: string
}

export interface ComponentList {
    componentId: number,
    ctypeId: number,
    component: string
}

export interface Brand{
    brandId: string,
    brand: string
}


export interface Type{
    typeId: string,
    assetType: string
}

// export interface ListComponent{
//     componentId: number,
//     component: string,
//     componentType: string,
//     tecType: string
// }

export interface Model {
    modelId: number,
    brand: string,
    model: string,
    processor: Component[]
}

export interface ModelList {
    modelId: number,
    typeId: string,
    brandId: string,
    brand: string,
    model: string,
    processor: Component[]
}