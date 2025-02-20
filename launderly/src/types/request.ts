export interface IRequestOrderForm {
  userId: number;
  userAddressId: number;
  outletId: number;
  distance: number;
}

export const PickupStatus = (status: string): string => {
  const mapping: Record<string, string> = {
    WAITING_FOR_DRIVER: "Waiting For Driver",
    ON_THE_WAY_TO_CUSTOMER: "Driver On The Way to Customer",
    ON_THE_WAY_TO_OUTLET: "Drive On The Way to Outlet",
    RECEIVED_BY_OUTLET: "Received By Outlet",
  };

  return mapping[status] || status;
};
