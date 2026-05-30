import { DetailedAsset } from "@/types/asset.type";
import { ComputerRequest } from "@/types/asset.type";

export function mapAssetToFormValues(asset: DetailedAsset) {
  const common = {
    internalId: asset.internalId,
    responsable: asset.responsable?.userId ?? undefined,
    serialNumber: asset.serialNumber,
    invoice: asset.invoice,
    purchaseDate: new Date(asset.purchaseDate),
    companyId: asset.company.companyId,
    areaId: asset.area.areaId,
    modelId: asset.model.modelId
  };

  if(asset.categoryId === 'LAP' ||
    asset.categoryId === 'SFF' ||
    asset.categoryId === 'TORR'){
    return {
      ...common,
      categoryId: asset.categoryId,
      networkName: asset.networkName ?? '',
      ram: asset.ram?.map(r=>r.id) ?? [undefined],
      storage: asset.storage?.map(d=>d.id) ?? [undefined],
      osLicenseId: asset.osLicense?.licenseId,
      osKey: asset.osLicense?.licenseKey ?? '',
      officeLicenseId: asset.officeLicense?.licenseId,
      officeKey: asset.officeLicense?.licenseKey ?? ''
    };
  }
  return {
    ...common,
    categoryId: asset.categoryId,
    details: asset.details ?? ''

  };
}

export function mapRequestToComputer(data:any): ComputerRequest {
    return {
        serialNumber: data.serialNumber,
        networkName: data.networkName,
        companyId: data.companyId,
        categoryId: data.categoryId,
        invoice: data.invoice,
        purchaseDate: data.purchaseDate,
        internalId: data.internalId,
        areaId: data.areaId,
        modelId: data.modelId,
        responsable: data.responsable ?? null,

        memories: (data.ram ?? []).map(
            (id:number)=>({id})
        ),

        disks: (data.storage ?? []).map(
            (id:number)=>({id})
        ),

        licenses: [
            ...(data.osLicenseId
                ? [{
                    licenseId:data.osLicenseId,
                    licenseKey:data.osKey ?? ''
                }]
                : []),

            ...(data.officeLicenseId
                ? [{
                    licenseId:data.officeLicenseId,
                    licenseKey:data.officeKey ?? ''
                }]
                : [])
        ]
    };
}