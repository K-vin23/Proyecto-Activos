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

export interface Component{
    id: number,
    name: string
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