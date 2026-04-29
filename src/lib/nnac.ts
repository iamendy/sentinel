import connect from "@/lib/axios";

export async function getSimSwapStatus(
  phoneNumber: string,
  maxAge: number = 240,
) {
  const { data } = await connect.post(
    `${process.env.NNAC_BASE_URL}/passthrough/camara/v1/sim-swap/sim-swap/v0/check`,
    { phoneNumber, maxAge },
  );
  return data;
}

export async function getDeviceStatus(phoneNumber: string) {
  const { data } = await connect.post(
    `${process.env.NNAC_BASE_URL}/device-status/v0/connectivity`,
    {
      device: { phoneNumber },
    },
  );
  return data;
}

export async function getLocationRetrieval(
  phoneNumber: string,
  maxAge: number = 60,
) {
  const { data } = await connect.post(
    `${process.env.NNAC_BASE_URL}/location-retrieval/v0/retrieve`,
    {
      device: { phoneNumber },
      maxAge,
    },
  );
  return data;
}

export async function verifyLocation(
  phoneNumber: string,
  latitude: number,
  longitude: number,
  radius: number = 50000,
) {
  const { data } = await connect.post(
    `${process.env.NNAC_BASE_URL}/location-verification/v1/verify`,
    {
      device: { phoneNumber },
      area: {
        areaType: "CIRCLE",
        center: { latitude, longitude },
        radius,
      },
    },
  );
  return data;
}

export async function getDeviceSwapStatus(
  phoneNumber: string,
  maxAge: number = 120,
) {
  const { data } = await connect.post(
    `${process.env.NNAC_BASE_URL}/passthrough/camara/v1/device-swap/device-swap/v1/check`,
    { phoneNumber, maxAge },
  );
  return data;
}

export async function verifyNumber(phoneNumber: string) {
  const { data } = await connect.post(
    `${process.env.NNAC_BASE_URL}/passthrough/camara/v1/number-verification/number-verification/v0/verify`,
    { phoneNumber },
  );
  return data;
}

export async function verifyKycMatch(
  phoneNumber: string,
  idNo: string,
  gender?: string,
  name?: string,
) {
  const { data } = await connect.post(
    `${process.env.NNAC_BASE_URL}/passthrough/camara/v1/kyc-match/kyc-match/v0.3/match`,
    {
      phoneNumber,
      idDocument: idNo,
      gender: gender || "OTHER",
      ...(name && { name }), // Only include name if provided
    },
  );
  return data;
}
