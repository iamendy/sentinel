"use client";

import { useState } from "react";
import SelectAction from "@/components/SelectAction";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ActivityIcon, BotIcon, TriangleAlert, Check } from "lucide-react";

// Define the structure for form fields
interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
}

// Define contact interface
interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  idNo?: string;
  gender?: string;
  maxAge?: number;
}

// Predefined contact lists for batch verify
const contactLists: Contact[] = [
  {
    id: "vendor",
    name: "Vendor",
    phoneNumber: "+2348023456789",
    idNo: "12345678",
    gender: "MALE",
    maxAge: 240,
  },
  {
    id: "customer",
    name: "Customer",
    phoneNumber: "+2348034567890",
    idNo: "87654321",
    gender: "FEMALE",
    maxAge: 240,
  },
  {
    id: "partner",
    name: "Partner",
    phoneNumber: "+2348045678901",
    idNo: "11223344",
    gender: "MALE",
    maxAge: 240,
  },
  {
    id: "supplier",
    name: "Supplier",
    phoneNumber: "+2348056789012",
    idNo: "44332211",
    gender: "FEMALE",
    maxAge: 240,
  },
  {
    id: "distributor",
    name: "Distributor",
    phoneNumber: "+2348067890123",
    idNo: "55667788",
    gender: "MALE",
    maxAge: 240,
  },
];

// Service descriptions
const serviceDescriptions: Record<
  string,
  { title: string; description: string; icon: string }
> = {
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

// Define form fields for each endpoint
const getFormFields = (action: string): FormField[] => {
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

// Helper function to convert Contact to batch verify request format
const contactToBatchFormat = (contact: Contact) => {
  const batchContact: any = {
    phoneNumber: contact.phoneNumber,
  };

  if (contact.idNo) batchContact.idNo = contact.idNo;
  if (contact.gender) batchContact.gender = contact.gender;
  if (contact.name) batchContact.name = contact.name;
  if (contact.maxAge) batchContact.maxAge = contact.maxAge;

  return batchContact;
};

const Page = () => {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(
    new Set(),
  );

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactToggle = (contact: Contact) => {
    const newSelectedIds = new Set(selectedContactIds);

    if (newSelectedIds.has(contact.id)) {
      // Remove contact
      newSelectedIds.delete(contact.id);
      // Remove this contact from formData
      const currentContacts = formData.contacts || [];
      const filteredContacts = currentContacts.filter(
        (c: any) => c.phoneNumber !== contact.phoneNumber,
      );
      setFormData((prev) => ({ ...prev, contacts: filteredContacts }));
    } else {
      // Add contact
      newSelectedIds.add(contact.id);
      // Add this contact to formData in batch verify format
      const currentContacts = formData.contacts || [];
      setFormData((prev) => ({
        ...prev,
        contacts: [...currentContacts, contactToBatchFormat(contact)],
      }));
    }

    setSelectedContactIds(newSelectedIds);
  };

  const handleVerify = async () => {
    if (!selectedAction) {
      alert("Please select an action");
      return;
    }

    const formFields = getFormFields(selectedAction);

    // Check required fields
    for (const field of formFields) {
      if (field.required && !formData[field.name]) {
        alert(`Please select ${field.label.toLowerCase()}`);
        return;
      }
    }

    // Prepare request body based on selected action
    let requestBody = {};

    switch (selectedAction) {
      case "check-recipient":
        requestBody = {
          phoneNumber: formData.phoneNumber,
        };
        break;
      case "verify-identity":
        requestBody = {
          phoneNumber: formData.phoneNumber,
          idNo: formData.idNo,
        };
        break;
      case "geofence-transaction":
        requestBody = {
          phoneNumber: formData.phoneNumber,
          latitude: formData.latitude,
          longitude: formData.longitude,
        };
        break;
      case "batch-verify":
        if (!formData.contacts || formData.contacts.length === 0) {
          alert("Please select at least one contact");
          return;
        }
        requestBody = {
          contacts: formData.contacts,
        };
        break;
      case "device-trust":
        requestBody = {
          phoneNumber: formData.phoneNumber,
          latitude: formData.latitude,
          longitude: formData.longitude,
          radius: formData.radius,
        };
        break;
    }

    console.log("Request Body:", requestBody);

    // Make API call to Sentinel backend
    try {
      // Mock response for now
      const mockResponse = {
        risk: "HIGH",
        recommendation: "BLOCK",
        reason:
          "This phone number's SIM was swapped 2 hours ago. Do not send money – this is a common fraud pattern.",
      };

      setVerificationResult(mockResponse);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const formFields = getFormFields(selectedAction);
  const currentService = selectedAction
    ? serviceDescriptions[selectedAction]
    : null;

  return (
    <div className="px-4 mt-4">
      <h3 className="text-white text-sm mb-3">
        Select a service and enter necessary details
      </h3>

      <div className="border px-4 py-4 flex flex-col gap-y-8">
        <SelectAction value={selectedAction} onChange={setSelectedAction} />

        {/* Service Description */}
        {currentService && (
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{currentService.icon}</div>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm mb-1 flex items-center gap-2">
                  {currentService.title}
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {currentService.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic form fields */}
        {formFields.map((field) => (
          <div key={field.name}>
            {field.type === "textarea" ? (
              <div className="flex flex-col gap-y-2">
                <label className="text-sm text-gray-400">{field.label}</label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:border-red focus:ring-1 focus:ring-red"
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                  rows={4}
                />
              </div>
            ) : field.type === "buttons" &&
              selectedAction === "batch-verify" ? (
              <div className="flex flex-col gap-y-3">
                <label className="text-sm text-gray-400">{field.label}</label>
                <div className="grid grid-cols-2 gap-3">
                  {contactLists.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => handleContactToggle(contact)}
                      className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center justify-between ${
                        selectedContactIds.has(contact.id)
                          ? "bg-red text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                      }`}
                    >
                      <span>{contact.name}</span>
                      {selectedContactIds.has(contact.id) && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Display selected contacts summary */}
                {formData.contacts && formData.contacts.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-800 rounded-md">
                    <div className="text-xs text-gray-400 mb-2">
                      Selected Contacts ({formData.contacts.length}):
                    </div>
                    <div className="space-y-1">
                      {formData.contacts.map((contact: any, index: number) => (
                        <div
                          key={index}
                          className="text-xs text-gray-300 flex justify-between"
                        >
                          <span>{contact.name || contact.phoneNumber}</span>
                          <span className="text-gray-500">
                            {contact.phoneNumber}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <InputField
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
              />
            )}
          </div>
        ))}

        <Button onClick={handleVerify}>Verify</Button>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-center">
              Verification Result
            </DialogTitle>
            <DialogDescription className="flex items-center justify-center gap-x-2 my-2">
              <span className="flex items-center gap-x-2">
                <ActivityIcon className="h-4 w-4" /> {selectedAction || "N/A"}
              </span>{" "}
              • {formData.phoneNumber || "N/A"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex justify-center items-center">
              <TriangleAlert
                className={`h-12 w-12 ${
                  verificationResult?.risk === "HIGH"
                    ? "text-red"
                    : verificationResult?.risk === "MEDIUM"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              />
            </div>
            <div className="text-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {verificationResult?.reason}
              </p>
            </div>

            <div className="flex flex-col gap-y-2 items-center border border-white/20 rounded-md py-4">
              <BotIcon className="h-8 w-8 text-gray-400" />
              <div className="flex flex-col items-center justify-center text-sm">
                <div className="font-medium text-center w-full">
                  Risk Assessment
                </div>
                <div
                  className={`font-bold text-center ${
                    verificationResult?.recommendation === "BLOCK"
                      ? "text-red"
                      : verificationResult?.recommendation === "CAUTION"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {verificationResult?.recommendation || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="default" onClick={() => setIsModalOpen(false)}>
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
