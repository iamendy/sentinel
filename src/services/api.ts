import axios from "axios";
import {
  BatchVerifyRequest,
  CheckRecipientRequest,
  DeviceTrustRequest,
  GeofenceTransactionRequest,
  SentinelResponse,
  VerifyIdentityRequest,
} from "@/types";

// Base API configuration
const API_BASE_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api` || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Check Recipient Safety
export const checkRecipient = async (
  data: CheckRecipientRequest,
): Promise<SentinelResponse> => {
  try {
    const { data: response } = await apiClient.post<SentinelResponse>(
      "/check-recipient",
      data,
    );

    return response;
  } catch (error) {
    console.error("Check recipient error:", error);
    throw error;
  }
};

// 2. Verify Identity (KYC)
export const verifyIdentity = async (
  data: VerifyIdentityRequest,
): Promise<SentinelResponse> => {
  try {
    const { data: response } = await apiClient.post<SentinelResponse>(
      "/verify-identity",
      data,
    );
    return response;
  } catch (error) {
    console.error("Verify identity error:", error);
    throw error;
  }
};

// 3. Geofence Transaction
export const geofenceTransaction = async (
  data: GeofenceTransactionRequest,
): Promise<SentinelResponse> => {
  try {
    const { data: response } = await apiClient.post<SentinelResponse>(
      "/geofence-transaction",
      data,
    );

    return response;
  } catch (error) {
    console.error("Geofence transaction error:", error);
    throw error;
  }
};

// 4. Batch Verify
export const batchVerify = async (
  data: BatchVerifyRequest,
): Promise<SentinelResponse[]> => {
  try {
    const { data: response } = await apiClient.post<SentinelResponse[]>(
      "/batch-verify",
      data,
    );

    return response;
  } catch (error) {
    console.error("Batch verify error:", error);
    throw error;
  }
};

// 5. Device Trust Assessment
export const deviceTrust = async (
  data: DeviceTrustRequest,
): Promise<SentinelResponse> => {
  try {
    const { data: response } = await apiClient.post<SentinelResponse>(
      "/device-trust",
      data,
    );

    return response;
  } catch (error) {
    console.error("Device trust error:", error);
    throw error;
  }
};

// Export all services as a single object for convenience
export const sentinelApi = {
  checkRecipient,
  verifyIdentity,
  geofenceTransaction,
  batchVerify,
  deviceTrust,
};

export default apiClient;
