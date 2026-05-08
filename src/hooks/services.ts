import {
  useCheckRecipient,
  useVerifyIdentity,
  useGeofenceTransaction,
  useBatchVerify,
  useDeviceTrust,
} from "@/hooks/query";

// Map actions to their respective hooks
export const useActionHook = (action: string) => {
  const checkRecipient = useCheckRecipient();
  const verifyIdentity = useVerifyIdentity();
  const geofenceTransaction = useGeofenceTransaction();
  const batchVerify = useBatchVerify();
  const deviceTrust = useDeviceTrust();

  switch (action) {
    case "check-recipient":
      return checkRecipient;
    case "verify-identity":
      return verifyIdentity;
    case "geofence-transaction":
      return geofenceTransaction;
    case "batch-verify":
      return batchVerify;
    case "device-trust":
      return deviceTrust;
    default:
      return checkRecipient;
  }
};
