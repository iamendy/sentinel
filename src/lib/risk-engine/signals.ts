export interface RawNokiaNacResponses {
  simSwap?: { swapped: boolean };
  deviceStatus?: {
    connectivityStatus: string | null;
    reachabilityStatus: string | null;
  };
  kycMatch?: {
    idDocumentMatch: string;
    genderMatch?: string;
    nameMatch?: string;
  };
  locationRetrieval?: { lastLocationTime: string; area: any };
  locationVerification?: {
    verificationResult: string;
    lastLocationTime: string;
  };
  deviceSwap?: { swapped: boolean };
}

export interface NormalizedSignals {
  // Core signals (always present if API was called)
  simSwapped: boolean;
  deviceConnected: boolean;

  // Optional signals (may be null if API not called)
  kycMatch: boolean | null;
  locationVerified: boolean | null;
  deviceSwappedRecently: boolean | null;

  // Raw connectivity string for nuance (e.g., "CONNECTED_SMS" vs "CONNECTED_DATA")
  deviceConnectivityRaw: string | null;
}

export function normalizeToSignals(
  raw: RawNokiaNacResponses,
): NormalizedSignals {
  return {
    // SIM Swap
    simSwapped: raw.simSwap?.swapped ?? false,

    // Device Status - any "CONNECTED" is good, but keep raw for nuance
    deviceConnected:
      raw.deviceStatus?.connectivityStatus?.startsWith("CONNECTED") ?? false,
    deviceConnectivityRaw: raw.deviceStatus?.connectivityStatus ?? null,

    // KYC Match (null if not provided)
    kycMatch:
      raw.kycMatch?.idDocumentMatch === "true"
        ? true
        : raw.kycMatch?.idDocumentMatch === "false"
        ? false
        : null,

    // Location Verification (null if not provided)
    locationVerified:
      raw.locationVerification?.verificationResult === "TRUE"
        ? true
        : raw.locationVerification?.verificationResult === "FALSE"
        ? false
        : null,

    // Device Swap (null if not provided)
    deviceSwappedRecently: raw.deviceSwap?.swapped ?? null,
  };
}
