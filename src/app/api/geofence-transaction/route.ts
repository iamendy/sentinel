import { NextRequest, NextResponse } from "next/server";
import { getLocationRetrieval, getDeviceStatus } from "@/lib/nnac";
import { assessRisk } from "@/lib/risk-engine/assessment";
import { normalizeToSignals } from "@/lib/risk-engine/signals";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { phoneNumber, latitude, longitude, radius, maxAge } =
      await request.json();

    // Validate phoneNumber and location parameters
    if (!phoneNumber || !latitude || !longitude) {
      return NextResponse.json(
        {
          success: false,
          error: "phoneNumber, latitude and longitude are required",
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

    // Simple location comparison - just check if coordinates match exactly (simulation mode)
    const expectedLatitude = parseFloat(latitude);
    const expectedLongitude = parseFloat(longitude);
    const actualLatitude = locationData?.area?.center?.latitude;
    const actualLongitude = locationData?.area?.center?.longitude;
    const providedRadius = radius ? parseFloat(radius) : 1000;

    // Simple check for simulation - coordinates match exactly or not
    const locationVerified =
      actualLatitude == expectedLatitude &&
      actualLongitude == expectedLongitude;

    console.log(`Location comparison:`, {
      expected: { lat: expectedLatitude, lng: expectedLongitude },
      actual: { lat: actualLatitude, lng: actualLongitude },
      verified: locationVerified,
    });

    // Create normalized signals for geofence check
    const signals = normalizeToSignals({
      deviceStatus: deviceStatusData,
      locationVerification: {
        verificationResult: locationVerified ? "TRUE" : "FALSE",
        lastLocationTime: locationData?.timestamp || new Date().toISOString(),
      },
    });

    // Assess risk using AI for location_check use case
    const riskAssessment = await assessRisk(signals, "location_check");

    // Prepare enriched response
    const responseData = {
      phoneNumber,
      decision: {
        risk: riskAssessment.risk,
        recommendation: riskAssessment.recommendation,
        reason: riskAssessment.reason,
      },
      raw: {
        location: {
          latitude: actualLatitude ?? null,
          longitude: actualLongitude ?? null,
          timestamp: locationData?.timestamp ?? null,
        },
        deviceStatus: {
          connectivityStatus: deviceStatusData?.connectivityStatus ?? null,
          reachabilityStatus: deviceStatusData?.reachabilityStatus ?? null,
          lastStatusTime: deviceStatusData?.lastStatusTime ?? null,
        },
        geofence: {
          expectedLatitude,
          expectedLongitude,
          radius: providedRadius,
          withinGeofence: locationVerified,
        },
      },
    };

    // Log the assessment result
    console.log(`Geofence Transaction for ${phoneNumber}:`, {
      withinGeofence: locationVerified,
      risk: riskAssessment.risk,
      recommendation: riskAssessment.recommendation,
      reason: riskAssessment.reason,
    });

    return NextResponse.json(responseData, { status: 200 });
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
