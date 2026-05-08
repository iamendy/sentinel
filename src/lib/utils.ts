import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define mock data for auto-population
export const getMockDataForAction = (action: string): Record<string, any> => {
  switch (action) {
    case "check-recipient":
      return {
        phoneNumber: "+99999991002",
      };
    case "verify-identity":
      return {
        phoneNumber: "+99999991001",
        idNo: "66666666q",
      };
    case "geofence-transaction":
      return {
        phoneNumber: "+99999991000",
        latitude: "47.48627616952785",
        longitude: "19.07915612501993",
      };
    case "batch-verify":
      return {
        // This will be handled differently since it uses contacts array
        contacts: [],
      };
    case "device-trust":
      return {
        phoneNumber: "+99999991001",
        latitude: "47.486276",
        longitude: "19.0",
        radius: "100",
      };
    default:
      return {};
  }
};
