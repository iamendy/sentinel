// types/index.ts
export interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  idNo?: string;
  gender?: string;
  maxAge?: number;
}

export interface ServiceDescription {
  title: string;
  description: string;
  icon: string;
}

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
  phoneNumber: string;
  decision: {
    risk: "HIGH" | "MEDIUM" | "LOW";
    recommendation: "BLOCK" | "CAUTION" | "SAFE";
    reason: string;
  };
  raw: {
    simSwap?: {
      swapped: boolean;
      swappedAt?: string;
    };
    deviceStatus?: {
      connectivityStatus: string | null;
      reachabilityStatus: string | null;
      lastStatusTime: string | null;
    };
    kycMatch?: {
      match: boolean;
      matchScore?: number;
    };
    location?: {
      latitude: number | null;
      longitude: number | null;
      timestamp: string | null;
    };
    locationVerification?: {
      verificationResult: string;
      lastLocationTime: string;
    };
    deviceSwap?: {
      swapped: boolean;
    };
    geofence?: {
      expectedLatitude: number;
      expectedLongitude: number;
      radius: number;
      withinGeofence: boolean;
    };
  };
}
