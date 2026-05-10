## Sentinel - Fraud Prevention API Suite

🌐 [Live Demo](https://sentinelafrica.vercel.app) | 📹 [Demo Video](https://youtu.be/M9G-cU60dHU) | 📊 [Pitch Slides](https://docs.google.com/presentation/d/1Ae9XjTEAyVIjEvjhG3_OTVToQSA3XSqv/edit?usp=sharing&ouid=117978133827433195315&rtpof=true&sd=true)

Sentinel is the Guardian Angel for African digital economy. It gives every SME and fintech the power of a fraud detective in simple API calls.

## Objective

To build **Sentinel**, a fraud prevention API suite that enable African fintechs, banks, mobile money operators, and SMEs to detect and prevent common fraud patterns before transactions occur – powered by Nokia Network as Code APIs and AI-driven risk decisions.

## Problem

Mobile money users, fintechs, and SMEs have **no unified way** to verify transaction safety. Current solutions are reactive, fragmented, and require deep expertise.

## Proposed Solution

Sentinel is an AI powered plug-and-play fraud prevention API system that uses ** network intelligence** (Nokia Network as Code APIs) and **AI** to tell any business, in plain English, whether to **BLOCK, CAUTION, or SAFE** a transaction before it happens.

## Implementation

**Sentinel** is built as a **Next.js API server** deployed on **Vercel**, using **Nokia Network as Code** across multiple CAMARA APIs, and **DeepSeek** for AI-powered risk decisions.

The AI engine converts a combination of Nokia NAC signals (SIM swap status, number verification, device status, location) into actionable decisions: **BLOCK, CAUTION, or SAFE** – with plain English explanations that any user can understand.

### Sentinel Endpoints to Nokia NaC API Mapping

| Sentinel Endpoint       | Use Case                               | Nokia NaC APIs Used                                 |
| ----------------------- | -------------------------------------- | --------------------------------------------------- |
| `/check-recipient`      | Pre-transaction recipient safety check | SIM Swap + Device Status                            |
| `/verify-identity`      | Passwordless KYC for SME onboarding    | KYC Match + SIM Swap + Device Status                |
| `/geofence-transaction` | Location-based transaction approval    | Location Retrieval + Device Status                  |
| `/batch-verify`         | Bulk phone number Agent risk screening | SIM Swap + KYC Match                                |
| `/device-trust`         | Device compromise assessment           | Device Status + Device Swap + Location Verification |

### Example API Request (`/check-recipient`)

```
curl -X POST https://sentinelafrica.vercel.app/api/check-recipient \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+99999991000"}'

```

### Example API Response (`/check-recipient`)

```json
{
  "phoneNumber": "+99999991000",
  "decision": {
    "risk": "HIGH",
    "recommendation": "BLOCK",
    "reason": "A recent SIM swap was detected, which is a common fraud tactic. Verify via a phone call"
  },
  "raw": {
    "simSwap": { "swapped": true },
    "deviceStatus": {
      "connectivityStatus": "CONNECTED_SMS",
      "reachabilityStatus": null,
      "lastStatusTime": null
    }
  }
}
```

---

## Applications & Expected Benefits

| User Segment               | How They Use Sentinel                       | Example                                                                           |
| -------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------- |
| **Mobile money operators** | Check recipient safety before sending money | M-Pesa user sees "Transaction flagged – Verify receiver via phone before sending" |
| **Fintechs / Banks**       | Integrate API into transaction flow         | Lending app checks borrower identity                                              |
| **SMEs**                   | Passwordless customer onboarding            | Market vendor verifies customer phone number                                      |
| **Mobile money operators** | Bulk screening of agent numbers             | MTN MoMo screens all agents weekly                                                |
| **Ride-hailing platforms** | Verify driver identity and location         | Bolt checks driver location before assigning rides                                |

## Easy Integration with Popular Payment Providers

### Paystack, Flutterwave, Moniepoint ...

```javascript
// Before: Just Paystack
await paystack.transaction.initialize({ amount, email });

// After: Sentinel + Paystack (3 extra lines)
const { recommendation } = await sentinel.check(recipientPhone);
if (recommendation === "BLOCK") return { error: "Fraud detected!" };
await paystack.transaction.initialize({ amount, email });

// voila! Paystack is protected from fraudulent transactions!
```

**Business justification:**

- **For mobile money operators:** Each prevented fraud saves costs in customer reimbursement and operational costs
- **For fintechs like Paystack:** Adding Sentinel takes less than 5 minutes of engineering time – no complex telecommunication expertise needed.
- **For SMEs:** Adding Sentinel offers with seamless customer onboarding with phone numbers, and ensures safe transactions.

---

## 🧑‍💻 Instructions for testing locally

1. Clone repo

2. run `cp .env.example .env`

3. Update the fields on the .env file with your keys

4. Run `npm run dev` to start the server on your development environment.

5. Run the curl commands from docs page or use the interactive demo app
