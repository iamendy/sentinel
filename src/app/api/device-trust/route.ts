import { NextRequest, NextResponse } from "next/server";
import {
  getDeviceStatus,
  getDeviceSwapStatus,
  verifyLocation,
} from "@/lib/nnac";
import { assessRisk } from "@/lib/risk-engine/assessment";
import { NormalizedSignals } from "@/lib/risk-engine/signals";
import { normalizeToSignals } from "@/lib/risk-engine/signals";

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

    let deviceStatusData;
    let deviceSwapData;
    let locationVerificationData = null;
    let signals: NormalizedSignals;

    if (hasLocationParams) {
      // Fetch device status, device swap, and location verification in parallel
      [deviceStatusData, deviceSwapData, locationVerificationData] =
        await Promise.all([
          getDeviceStatus(phoneNumber),
          getDeviceSwapStatus(phoneNumber, maxAge),
          verifyLocation(phoneNumber, latitude, longitude, radius),
        ]);

      console.log("Device Status:", deviceStatusData);
      console.log("Device Swap Status:", deviceSwapData);
      console.log("Location Verification:", locationVerificationData);

      //  Normalize raw Nokia responses into standard signals
      signals = normalizeToSignals({
        deviceSwap: deviceSwapData,
        deviceStatus: deviceStatusData,
        locationVerification: locationVerificationData,
      });
    } else {
      // Fetch only device status and device swap (no location verification)
      [deviceStatusData, deviceSwapData] = await Promise.all([
        getDeviceStatus(phoneNumber),
        getDeviceSwapStatus(phoneNumber, maxAge),
      ]);

      console.log("Device Status:", deviceStatusData);
      console.log("Device Swap Status:", deviceSwapData);

      // Normalize signals for device trust use case (no location)
      signals = normalizeToSignals({
        deviceSwap: deviceSwapData,
        deviceStatus: deviceStatusData,
      });
    }

    // Assess risk using AI
    const riskAssessment = await assessRisk(signals, "device_trust");

    // Prepare enriched response
    // Prepare enriched response with the specific pattern
    const responseData = {
      success: true,
      data: {
        phoneNumber,
        decision: {
          risk: riskAssessment.risk,
          recommendation: riskAssessment.recommendation,
          reason: riskAssessment.reason,
        },
        raw: {
          deviceSwap: {
            swapped: deviceSwapData?.swapped ?? false,
          },
          deviceStatus: {
            connectivityStatus: deviceStatusData?.connectivityStatus ?? null,
            reachabilityStatus: deviceStatusData?.reachabilityStatus ?? null,
            lastStatusTime: deviceStatusData?.lastStatusTime ?? null,
          },
          ...(locationVerificationData && {
            locationVerification: {
              verificationResult:
                locationVerificationData?.verificationResult ?? null,
              lastLocationTime:
                locationVerificationData?.lastLocationTime ?? null,
            },
          }),
        },
      },
    };

    // Log the assessment result
    console.log(`Device Trust Assessment for ${phoneNumber}:`, {
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
