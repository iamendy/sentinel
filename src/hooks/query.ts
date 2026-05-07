import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  CheckRecipientRequest,
  VerifyIdentityRequest,
  GeofenceTransactionRequest,
  BatchVerifyRequest,
  DeviceTrustRequest,
  SentinelResponse,
} from "@/types";
import {
  checkRecipient,
  verifyIdentity,
  geofenceTransaction,
  batchVerify,
  deviceTrust,
} from "@/services/api";
import { queryKeys } from "@/constants/query-keys";

// 1. Hook for Check Recipient
export const useCheckRecipient = (
  options?: UseMutationOptions<SentinelResponse, Error, CheckRecipientRequest>,
) => {
  return useMutation({
    mutationKey: queryKeys.checkRecipient,
    mutationFn: checkRecipient,
    ...options,
  });
};

// 2. Hook for Verify Identity
export const useVerifyIdentity = (
  options?: UseMutationOptions<SentinelResponse, Error, VerifyIdentityRequest>,
) => {
  return useMutation({
    mutationKey: queryKeys.verifyIdentity,
    mutationFn: verifyIdentity,
    ...options,
  });
};

// 3. Hook for Geofence Transaction
export const useGeofenceTransaction = (
  options?: UseMutationOptions<
    SentinelResponse,
    Error,
    GeofenceTransactionRequest
  >,
) => {
  return useMutation({
    mutationKey: queryKeys.geofenceTransaction,
    mutationFn: geofenceTransaction,
    ...options,
  });
};

// 4. Hook for Batch Verify
export const useBatchVerify = (
  options?: UseMutationOptions<SentinelResponse[], Error, BatchVerifyRequest>,
) => {
  return useMutation({
    mutationKey: queryKeys.batchVerify,
    mutationFn: batchVerify,
    ...options,
  });
};

// 5. Hook for Device Trust
export const useDeviceTrust = (
  options?: UseMutationOptions<SentinelResponse, Error, DeviceTrustRequest>,
) => {
  return useMutation({
    mutationKey: queryKeys.deviceTrust,
    mutationFn: deviceTrust,
    ...options,
  });
};

// Generic hook to get the appropriate mutation based on action
export const useSentinelMutation = (action: string) => {
  switch (action) {
    case "check-recipient":
      return useCheckRecipient();
    case "verify-identity":
      return useVerifyIdentity();
    case "geofence-transaction":
      return useGeofenceTransaction();
    case "batch-verify":
      return useBatchVerify();
    case "device-trust":
      return useDeviceTrust();
    default:
      return useCheckRecipient();
  }
};
