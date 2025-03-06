export const getNextDeliveryStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "WAITING_FOR_DRIVER":
        return "ON_THE_WAY_TO_OUTLET";
      case "ON_THE_WAY_TO_OUTLET":
        return "ON_THE_WAY_TO_CUSTOMER";
      case "ON_THE_WAY_TO_CUSTOMER":
        return "RECEIVED_BY_CUSTOMER";
      default:
        return currentStatus;
    }
  };
  
  export const getNextPickupStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "WAITING_FOR_DRIVER":
        return "ON_THE_WAY_TO_CUSTOMER";
      case "ON_THE_WAY_TO_CUSTOMER":
        return "ON_THE_WAY_TO_OUTLET";
      case "ON_THE_WAY_TO_OUTLET":
        return "RECEIVED_BY_OUTLET";
      default:
        return currentStatus;
    }
  };
  