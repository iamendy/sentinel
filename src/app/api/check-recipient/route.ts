import { NextRequest, NextResponse } from "next/server";
import { getSimSwapStatus, getDeviceStatus } from "@/lib/nnac";
import { normalizeToSignals } from "@/lib/risk-engine/signals";
import { assessRisk } from "@/lib/risk-engine/assessment";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, maxAge } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: "phoneNumber is required" },
        { status: 400 },
      );
    }

    // Fetch Nokia APIs in parallel for speed
    const [simSwapData, deviceStatusData] = await Promise.all([
      getSimSwapStatus(phoneNumber, maxAge),
      getDeviceStatus(phoneNumber),
    ]);

    console.log("SIM Swap Status:", simSwapData);
    console.log("Device Status:", deviceStatusData);

    //  Normalize raw Nokia responses into standard signals
    const signals = normalizeToSignals({
      simSwap: simSwapData,
      deviceStatus: deviceStatusData,
    });

    // Get AI-powered risk assessment
    const assessment = await assessRisk(
      signals,
      "send_money", // use case for check-recipient
    );

    // Return enriched response
    return NextResponse.json(
      {
        phoneNumber,
        // AI decision
        decision: {
          risk: assessment.risk,
          recommendation: assessment.recommendation,
          reason: assessment.reason,
        },
        // Raw Nokia data (for debugging/transparency)
        raw: {
          simSwap: simSwapData,
          deviceStatus: deviceStatusData,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error occurred: ", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
