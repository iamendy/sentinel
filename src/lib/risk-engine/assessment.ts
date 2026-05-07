import { NormalizedSignals } from "./signals";

export type UseCase =
  | "send_money"
  | "onboarding"
  | "location_check"
  | "batch_verify"
  | "device_trust";

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";
export type Recommendation = "BLOCK" | "CAUTION" | "SAFE";

export interface RiskAssessment {
  risk: RiskLevel;
  recommendation: Recommendation;
  reason: string;
}

// Rule-based fallback (when AI fails or API key missing)
function ruleBasedAssessment(
  signals: NormalizedSignals,
  useCase: UseCase,
): RiskAssessment {
  // HIGH risk triggers (BLOCK)
  if (signals.simSwapped) {
    return {
      risk: "HIGH",
      recommendation: "BLOCK",
      reason:
        "This phone number's SIM was recently swapped. This is a common fraud pattern. Verify via a phone call",
    };
  }

  if (signals.deviceSwappedRecently === true) {
    return {
      risk: "HIGH",
      recommendation: "BLOCK",
      reason:
        "This device was recently swapped. The user may have lost control of their phone number.",
    };
  }

  if (signals.kycMatch === false && useCase === "onboarding") {
    return {
      risk: "HIGH",
      recommendation: "BLOCK",
      reason:
        "ID document does not match the phone number owner. Cannot verify identity.",
    };
  }

  // MEDIUM risk triggers (CAUTION)
  if (!signals.deviceConnected) {
    return {
      risk: "MEDIUM",
      recommendation: "CAUTION",
      reason:
        "Device is not connected to the network. The recipient may not receive transaction notifications.",
    };
  }

  if (signals.locationVerified === false && useCase === "location_check") {
    return {
      risk: "MEDIUM",
      recommendation: "CAUTION",
      reason:
        "Device is not at the expected location. Verify with the user before proceeding.",
    };
  }

  if (signals.kycMatch === null && useCase === "onboarding") {
    return {
      risk: "MEDIUM",
      recommendation: "CAUTION",
      reason:
        "KYC verification not available. Request additional identity documents.",
    };
  }

  // LOW risk (SAFE)
  return {
    risk: "LOW",
    recommendation: "SAFE",
    reason: signals.deviceConnected
      ? "No fraud indicators detected. Safe to proceed."
      : "No critical issues found, but device connectivity is limited.",
  };
}

// AI-powered assessment using DeepSeek
export async function assessRisk(
  signals: NormalizedSignals,
  useCase: UseCase,
): Promise<RiskAssessment> {
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY!;

  // If no API key, use rules only
  if (!deepseekApiKey || deepseekApiKey === "") {
    console.log("No DeepSeek API key, using rule-based assessment");
    return ruleBasedAssessment(signals, useCase);
  }

  // try AI first for Agentic AI
  try {
    // fraud-specific prompt
    const systemPrompt = `You are Sentinel, an AI fraud detection engine for African mobile money and fintech.

Your task: Analyze the signals below and return a risk assessment as JSON.

Risk levels: HIGH (block transaction), MEDIUM (flag for review), LOW (safe to proceed)

Fraud rules to apply:
- SIM swapped recently = HIGH risk (fraudsters hijack numbers this way)
- Device not connected = MEDIUM risk (user may not receive alerts)
- KYC mismatch = HIGH risk for onboarding (identity theft)
- Location mismatch = MEDIUM risk (possible account takeover)
- Device swapped recently = HIGH risk (SIM swap fraud indicator)

Return ONLY valid JSON. No markdown, no explanations outside JSON. Start with { and end with }.

Format: {"risk":"HIGH/MEDIUM/LOW","recommendation":"BLOCK/CAUTION/SAFE","reason":"short, user-friendly explanation (one sentence)"}`;

    const userPrompt = `Use case: ${useCase}
Signals:
- simSwapped: ${signals.simSwapped}
- deviceConnected: ${signals.deviceConnected}
- deviceConnectivityRaw: ${signals.deviceConnectivityRaw || "not available"}
- kycMatch: ${signals.kycMatch === null ? "not checked" : signals.kycMatch}
- locationVerified: ${
      signals.locationVerified === null
        ? "not checked"
        : signals.locationVerified
    }
- deviceSwappedRecently: ${
      signals.deviceSwappedRecently === null
        ? "not checked"
        : signals.deviceSwappedRecently
    }

Return risk assessment as JSON.`;

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${deepseekApiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.2, // Lower = more consistent fraud decisions
          max_tokens: 200, // Keep responses short
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DeepSeek API error (${response.status}): ${errorText}`);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const aiContent = data.choices[0].message.content;

    // Clean the response (in case markdown sneaks in)
    let cleanJson = aiContent.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/```\n?/g, "");
    }

    const result = JSON.parse(cleanJson);

    // Validate result has required fields
    if (result.risk && result.recommendation && result.reason) {
      // Ensure risk is one of the valid values
      const validRisks = ["HIGH", "MEDIUM", "LOW"];
      const validRecommendations = ["BLOCK", "CAUTION", "SAFE"];

      return {
        risk: validRisks.includes(result.risk) ? result.risk : "LOW",
        recommendation: validRecommendations.includes(result.recommendation)
          ? result.recommendation
          : "SAFE",
        reason: result.reason.substring(0, 200), // Cap length
      };
    }
    throw new Error("Invalid AI response format");
  } catch (error) {
    console.log("AI assessment error, falling back to rules:", error);
    return ruleBasedAssessment(signals, useCase);
  }
}
