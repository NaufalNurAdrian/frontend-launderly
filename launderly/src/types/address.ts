export interface IAddress {
  id: number;
  addressLine?: string;
  city?: string;
  isPrimary: boolean;
  latitude?: number;
  longitude?: number;
  isDelete: boolean;
  outletId?: number;
  userId?: number;
}

export interface IOutletAddress {
  id: number;
  outletName: string;
  outletType: string;
  address: {
    latitude: number;
    longitude: number;
  }[]; 
}

