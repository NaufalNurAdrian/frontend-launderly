export enum OutletTypeF1 {
  MAIN = 'MAIN',
  BRANCH = 'BRANCH',
}

export interface IOutletF1 {
  id: number;
  outletName: string;
  outletType: OutletTypeF1;
  createdAt: Date;
  deletedAt?: Date | null;
  updatedAt: Date;
  isDelete: boolean;
  employee: Employee[];
  address: Address[];
  pickupOrder: PickupOrder[];
}

export interface IFormOutletF1 {
  outletName: string;
  outletType: OutletTypeF1;
  address: {
    addressLine: string;
    city: string;
  };
}