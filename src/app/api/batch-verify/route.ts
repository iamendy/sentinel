import { NextRequest, NextResponse } from "next/server";
import { getSimSwapStatus, getDeviceStatus, verifyKycMatch } from "@/lib/nnac";
import { assessRisk } from "@/lib/risk-engine/assessment";
import { normalizeToSignals } from "@/lib/risk-engine/signals";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { contacts } = await request.json();

    console.log(contacts);
    // Validate contacts
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Contacts array is required",
        },
        { status: 400 },
      );
    }

    // Process each contact with parallel sim swap, device status, and KYC verification for speed
    const results = await Promise.all(
      contacts.map(async (contact) => {
        const { phoneNumber, idNo, gender, name, maxAge } = contact;

        // Validate phoneNumber for each contact
        if (!phoneNumber) {
          return {
            phoneNumber: phoneNumber || "unknown",
            success: false,
            error: "Phone number is required",
          };
        }

        try {
          // Fetch sim swap status, device status, and KYC verification in parallel
          const [simSwapData, deviceStatusData, kycData] = await Promise.all([
            getSimSwapStatus(phoneNumber, maxAge),
            getDeviceStatus(phoneNumber),
            idNo
              ? verifyKycMatch(phoneNumber, idNo, gender, name)
              : Promise.resolve(null),
          ]);

          console.log(`SIM Swap Status for ${phoneNumber}:`, simSwapData);
          console.log(`Device Status for ${phoneNumber}:`, deviceStatusData);
          console.log(`KYC Status for ${phoneNumber}:`, kycData);

          // Normalize raw Nokia responses into standard signals
          const signals = normalizeToSignals({
            simSwap: simSwapData,
            deviceStatus: deviceStatusData,
            ...(kycData && { kycMatch: kycData }),
          });

          // Assess risk using AI for batch_verify use case
          const riskAssessment = await assessRisk(signals, "batch_verify");

          // Prepare enriched response for this contact
          return {
            success: true,
            phoneNumber,
            decision: {
              risk: riskAssessment.risk,
              recommendation: riskAssessment.recommendation,
              reason: riskAssessment.reason,
            },
            raw: {
              simSwap: {
                swapped: simSwapData?.swapped ?? false,
                ...(simSwapData?.swappedAt && {
                  swappedAt: simSwapData.swappedAt,
                }),
              },
              deviceStatus: {
                connectivityStatus:
                  deviceStatusData?.connectivityStatus ?? null,
                reachabilityStatus:
                  deviceStatusData?.reachabilityStatus ?? null,
                lastStatusTime: deviceStatusData?.lastStatusTime ?? null,
              },
              ...(kycData && {
                kycMatch: {
                  match: kycData?.idDocumentMatch ?? false,
                },
              }),
            },
          };
        } catch (error) {
          console.error(`Error processing ${phoneNumber}:`, error);
          return {
            success: false,
            phoneNumber,
            error: error instanceof Error ? error.message : "Failed to verify",
          };
        }
      }),
    );

    // Send successful response with all results
    return NextResponse.json(
      {
        total: results.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        results,
      },
      { status: 200 },
    );
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
