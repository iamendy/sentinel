import { NextRequest, NextResponse } from "next/server";
import { getSimSwapStatus, getDeviceStatus } from "@/lib/nnac";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { phoneNumber, maxAge } = await request.json();

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

    // Fetch both sim swap status and device status in parallel
    const [simSwapData, deviceStatusData] = await Promise.all([
      getSimSwapStatus(phoneNumber, maxAge),
      getDeviceStatus(phoneNumber),
    ]);

    console.log("SIM Swap Status:", simSwapData);
    console.log("Device Status:", deviceStatusData);

    // Send successful response with both data
    return NextResponse.json(
      {
        data: {
          phoneNumber,
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
