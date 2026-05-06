import axios from "axios";

// Base API configuration
const API_BASE_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api` || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types for request/response
export interface CheckRecipientRequest {
  phoneNumber: string;
}

export interface VerifyIdentityRequest {
  phoneNumber: string;
  idNo: string;
}

export interface GeofenceTransactionRequest {
  phoneNumber: string;
  latitude: string;
  longitude: string;
}

export interface BatchContact {
  phoneNumber: string;
  idNo?: string;
  gender?: string;
  name?: string;
  maxAge?: number;
}

export interface BatchVerifyRequest {
  contacts: BatchContact[];
}

export interface DeviceTrustRequest {
  phoneNumber: string;
  latitude: string;
  longitude: string;
  radius: string;
}

export interface SentinelResponse {
  risk: "HIGH" | "MEDIUM" | "LOW";
  recommendation: "BLOCK" | "CAUTION" | "SAFE";
  reason: string;
  timestamp?: string;
  transactionId?: string;
}

// 1. Check Recipient Safety
export const checkRecipient = async (
  data: CheckRecipientRequest,
): Promise<SentinelResponse> => {
  try {
    const response = await apiClient.post<SentinelResponse>(
      "/check-recipient",
      data,
    );

    console.log(response.data);
    return response.data;
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
    const response = await apiClient.post<SentinelResponse>(
      "/verify-identity",
      data,
    );
    return response.data;
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
    const response = await apiClient.post<SentinelResponse>(
      "/geofence-transaction",
      data,
    );
    return response.data;
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
    const response = await apiClient.post<SentinelResponse[]>(
      "/batch-verify",
      data,
    );
    return response.data;
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
    const response = await apiClient.post<SentinelResponse>(
      "/device-trust",
      data,
    );
    return response.data;
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
