import { NextRequest, NextResponse } from "next/server";
import { getLocationRetrieval, getDeviceStatus } from "@/lib/nnac";

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

    // Fetch both device status and device location in parallel
    const [deviceStatusData, locationData] = await Promise.all([
      getDeviceStatus(phoneNumber),
      getLocationRetrieval(phoneNumber, maxAge),
    ]);

    console.log("Device Location:", locationData);
    console.log("Device Status:", deviceStatusData);

    // Send successful response with both data
    return NextResponse.json(
      {
        data: {
          phoneNumber,
          location: locationData,
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
