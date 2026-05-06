import { FormField, ServiceDescription } from "@/types";

export const serviceDescriptions: Record<string, ServiceDescription> = {
  "check-recipient": {
    title: "Check Recipient Safety",
    description:
      "Verify if a recipient's phone number is safe before sending money. Detects SIM swaps and device anomalies that indicate potential fraud.",
    icon: "🛡️",
  },
  "verify-identity": {
    title: "Verify Identity (KYC)",
    description:
      "Passwordless KYC verification for customer onboarding. Matches phone numbers with ID documents to confirm identity authenticity.",
    icon: "🔐",
  },
  "geofence-transaction": {
    title: "Geofence Transaction",
    description:
      "Location-based transaction approval. Verifies if a transaction is being initiated from an authorized geographic location.",
    icon: "📍",
  },
  "batch-verify": {
    title: "Batch Verify",
    description:
      "Bulk screening of multiple phone numbers and identities. Ideal for agent verification, customer lists, and periodic audits.",
    icon: "📊",
  },
  "device-trust": {
    title: "Device Trust Assessment",
    description:
      "Evaluate device compromise level and location trust. Detects device swaps, unusual locations, and potential security breaches.",
    icon: "🔒",
  },
};

export const getFormFields = (action: string): FormField[] => {
  switch (action) {
    case "check-recipient":
      return [
        {
          name: "phoneNumber",
          label: "Phone Number",
          type: "tel",
          placeholder: "+234803xxxxxx",
          required: true,
        },
      ];
    case "verify-identity":
      return [
        {
          name: "phoneNumber",
          label: "Phone Number",
          type: "tel",
          placeholder: "+234803xxxxxx",
          required: true,
        },
        {
          name: "idNo",
          label: "ID Number",
          type: "text",
          placeholder: "66666666q",
          required: true,
        },
      ];
    case "geofence-transaction":
      return [
        {
          name: "phoneNumber",
          label: "Phone Number",
          type: "tel",
          placeholder: "+234803xxxxxx",
          required: true,
        },
        {
          name: "latitude",
          label: "Latitude",
          type: "text",
          placeholder: "47.48627616952785",
          required: true,
        },
        {
          name: "longitude",
          label: "Longitude",
          type: "text",
          placeholder: "19.07915612501993",
          required: true,
        },
      ];
    case "batch-verify":
      return [
        {
          name: "contacts",
          label: "Select Contacts",
          type: "buttons",
          placeholder: "",
          required: true,
        },
      ];
    case "device-trust":
      return [
        {
          name: "phoneNumber",
          label: "Phone Number",
          type: "tel",
          placeholder: "+234803xxxxxx",
          required: true,
        },
        {
          name: "latitude",
          label: "Latitude",
          type: "text",
          placeholder: "50.735851",
          required: true,
        },
        {
          name: "longitude",
          label: "Longitude",
          type: "text",
          placeholder: "7.10066",
          required: true,
        },
        {
          name: "radius",
          label: "Radius (meters)",
          type: "text",
          placeholder: "50000",
          required: true,
        },
      ];
    default:
      return [];
  }
};
