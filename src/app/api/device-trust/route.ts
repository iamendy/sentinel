import { NextRequest, NextResponse } from "next/server";
import {
  getDeviceStatus,
  getDeviceSwapStatus,
  verifyLocation,
} from "@/lib/nnac";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { phoneNumber, latitude, longitude, radius, maxAge } =
      await request.json();

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

    // Validate location parameters if provided
    const hasLocationParams = latitude && longitude;

    if (hasLocationParams) {
      // Fetch device status, device swap, and location verification in parallel
      const [deviceStatusData, deviceSwapData, locationVerificationData] =
        await Promise.all([
          getDeviceStatus(phoneNumber),
          getDeviceSwapStatus(phoneNumber, maxAge),
          verifyLocation(phoneNumber, latitude, longitude, radius),
        ]);

      console.log("Device Status:", deviceStatusData);
      console.log("Device Swap Status:", deviceSwapData);
      console.log("Location Verification:", locationVerificationData);

      // Send successful response with all data
      return NextResponse.json(
        {
          success: true,
          data: {
            phoneNumber,
            deviceStatus: deviceStatusData,
            deviceSwap: deviceSwapData,
            locationVerification: locationVerificationData,
          },
        },
        { status: 200 },
      );
    } else {
      // Fetch only device status and device swap (no location verification)
      const [deviceStatusData, deviceSwapData] = await Promise.all([
        getDeviceStatus(phoneNumber),
        getDeviceSwapStatus(phoneNumber, maxAge),
      ]);

      console.log("Device Status:", deviceStatusData);
      console.log("Device Swap Status:", deviceSwapData);

      // Send successful response with device data only
      return NextResponse.json(
        {
          success: true,
          data: {
            phoneNumber,
            deviceStatus: deviceStatusData,
            deviceSwap: deviceSwapData,
          },
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Error occurred: ", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
