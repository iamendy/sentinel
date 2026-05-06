import { NextRequest, NextResponse } from "next/server";
import { getSimSwapStatus, verifyKycMatch } from "@/lib/nnac";

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

    // Process each contact with parallel sim swap and KYC verification
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
          // Fetch both sim swap status and KYC verification in parallel
          const [simSwapData, kycData] = await Promise.all([
            getSimSwapStatus(phoneNumber, maxAge),
            verifyKycMatch(phoneNumber, idNo, gender, name),
          ]);

          console.log(`SIM Swap Status for ${phoneNumber}:`, simSwapData);
          console.log(`KYC Status for ${phoneNumber}:`, kycData);

          return {
            phoneNumber,
            success: true,
            data: {
              simSwap: simSwapData,
              kyc: kycData,
            },
          };
        } catch (error) {
          console.error(`Error processing ${phoneNumber}:`, error);
          return {
            phoneNumber,
            success: false,
            error: error instanceof Error ? error.message : "Failed to verify",
          };
        }
      }),
    );

    // Check if any successful results
    const hasSuccessfulResults = results.some((result) => result.success);

    if (!hasSuccessfulResults) {
      return NextResponse.json(
        {
          success: false,
          error: "All verifications failed",
          results,
        },
        { status: 500 },
      );
    }

    // Send successful response with all results
    return NextResponse.json(
      {
        success: true,
        data: {
          total: results.length,
          successful: results.filter((r) => r.success).length,
          failed: results.filter((r) => !r.success).length,
          results,
        },
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
