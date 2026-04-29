import { NextRequest, NextResponse } from "next/server";
import { getSimSwapStatus, getDeviceStatus, verifyKycMatch } from "@/lib/nnac";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { phoneNumber, idNo } = await request.json();

    // Validate phoneNumber
    if (!phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone number is required",
        },
        { status: 400 },
      );
    }

    // Fetch kyc status, sim swap status, and device status in parallel
    const [kycData, simSwapData, deviceStatusData] = await Promise.all([
      verifyKycMatch(phoneNumber, idNo),
      getSimSwapStatus(phoneNumber),
      getDeviceStatus(phoneNumber),
    ]);

    console.log("Kyc Status:", kycData);
    console.log("Sim Swap Status:", simSwapData);
    console.log("Device Status:", deviceStatusData);

    // Send successful response with all data
    return NextResponse.json(
      {
        data: {
          phoneNumber,
          kycData: kycData,
          simSwap: simSwapData,
          deviceStatus: deviceStatusData,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error occurred: ", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
