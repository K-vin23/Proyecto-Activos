export interface DashboardTotals {
    assets: number;
    users: number;
    maintenances: number;
    nextMaintenances: number;
}

export interface AssetByArea {
    area: string;
    total: number;
}

export interface UpcomingMaintenance {
    assetId: number,
    internalId: string,
    model: string,
    nextMaintenance: Date,
    daysUntilMaintenance: number,
}

export interface DashboardResponse {
    totals: DashboardTotals;
    assetsByArea: AssetByArea[]; 
}

