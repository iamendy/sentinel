import { NextRequest, NextResponse } from "next/server";
import { getSimSwapStatus, getDeviceStatus, verifyKycMatch } from "@/lib/nnac";
import { assessRisk } from "@/lib/risk-engine/assessment";
import { normalizeToSignals } from "@/lib/risk-engine/signals";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { phoneNumber, idNo } = await request.json();

    // Validate phoneNumber and idNo
    if (!phoneNumber || !idNo) {
      return NextResponse.json(
        {
          success: false,
          error: "phoneNumber and idNo are required",
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

    console.log("KYC Status:", kycData);
    console.log("SIM Swap Status:", simSwapData);
    console.log("Device Status:", deviceStatusData);

    // Normalize raw Nokia responses into standard signals
    const signals = normalizeToSignals({
      kycMatch: kycData,
      simSwap: simSwapData,
      deviceStatus: deviceStatusData,
    });

    // Assess risk using AI for onboarding/verify identity use case
    const riskAssessment = await assessRisk(signals, "onboarding");

    // Prepare enriched response with the specific pattern
    const responseData = {
      phoneNumber,
      decision: {
        risk: riskAssessment.risk,
        recommendation: riskAssessment.recommendation,
        reason: riskAssessment.reason,
      },
      raw: {
        kycMatch: {
          match: kycData?.match ?? false,
        },
        simSwap: {
          swapped: simSwapData?.swapped ?? false,
          ...(simSwapData?.swappedAt && { swappedAt: simSwapData.swappedAt }),
        },
        deviceStatus: {
          connectivityStatus: deviceStatusData?.connectivityStatus ?? null,
          reachabilityStatus: deviceStatusData?.reachabilityStatus ?? null,
          lastStatusTime: deviceStatusData?.lastStatusTime ?? null,
        },
      },
    };

    // Log the assessment result
    console.log(`Identity Verification for ${phoneNumber}:`, {
      kycMatch: kycData?.match,
      simSwapped: simSwapData?.swapped,
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
