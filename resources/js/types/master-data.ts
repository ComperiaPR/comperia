export interface Municipality {
    id: number
    name: string
}
export interface PropertyStatus {
    id: number
    name: string
}


export interface MasterData {
    municipalities: Municipality[]
    property_statuses: PropertyStatus[]
}
