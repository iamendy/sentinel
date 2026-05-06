"use client";

import { useState } from "react";
import SelectAction from "@/components/SelectAction";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/ui/button";
import { ServiceDescription } from "@/components/ServiceDescription";
import { BatchVerifyButtons } from "@/components/BatchVerifyButtons";
import { ResultModal } from "@/components/ResultModal";
import { Contact } from "@/types";
import { serviceDescriptions, getFormFields } from "@/constants/services";
import { contactToBatchFormat } from "@/utils";
import {
  useCheckRecipient,
  useVerifyIdentity,
  useGeofenceTransaction,
  useBatchVerify,
  useDeviceTrust,
} from "@/hooks/query";
import { Loader2 } from "lucide-react";

// Map actions to button text
const getButtonText = (action: string): string => {
  switch (action) {
    case "check-recipient":
      return "Check Recipient";
    case "verify-identity":
      return "Verify Identity";
    case "geofence-transaction":
      return "Verify Transaction Location";
    case "batch-verify":
      return "Batch Verify Contacts";
    case "device-trust":
      return "Assess Device Trust";
    default:
      return "Verify";
  }
};

// Map actions to their respective hooks
const useActionHook = (action: string) => {
  const checkRecipient = useCheckRecipient();
  const verifyIdentity = useVerifyIdentity();
  const geofenceTransaction = useGeofenceTransaction();
  const batchVerify = useBatchVerify();
  const deviceTrust = useDeviceTrust();

  switch (action) {
    case "check-recipient":
      return checkRecipient;
    case "verify-identity":
      return verifyIdentity;
    case "geofence-transaction":
      return geofenceTransaction;
    case "batch-verify":
      return batchVerify;
    case "device-trust":
      return deviceTrust;
    default:
      return checkRecipient;
  }
};

const Page = () => {
  const [selectedAction, setSelectedAction] =
    useState<string>("check-recipient");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(
    new Set(),
  );

  // Get the appropriate hook based on selected action
  const { mutateAsync, isPending } = useActionHook(selectedAction);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactToggle = (contact: Contact) => {
    const newSelectedIds = new Set(selectedContactIds);

    if (newSelectedIds.has(contact.id)) {
      newSelectedIds.delete(contact.id);
      const currentContacts = formData.contacts || [];
      const filteredContacts = currentContacts.filter(
        (c: any) => c.phoneNumber !== contact.phoneNumber,
      );
      setFormData((prev) => ({ ...prev, contacts: filteredContacts }));
    } else {
      newSelectedIds.add(contact.id);
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
    for (const field of formFields) {
      if (field.required && !formData[field.name]) {
        alert(`Please enter ${field.label.toLowerCase()}`);
        return;
      }
    }

    try {
      let requestData;

      switch (selectedAction) {
        case "check-recipient":
          requestData = { phoneNumber: formData.phoneNumber };
          break;
        case "verify-identity":
          requestData = {
            phoneNumber: formData.phoneNumber,
            idNo: formData.idNo,
          };
          break;
        case "geofence-transaction":
          requestData = {
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
          requestData = { contacts: formData.contacts };
          break;
        case "device-trust":
          requestData = {
            phoneNumber: formData.phoneNumber,
            latitude: formData.latitude,
            longitude: formData.longitude,
            radius: formData.radius,
          };
          break;
        default:
          return;
      }

      //@ts-ignore
      const result = await mutateAsync(requestData);

      // Handle batch verify response (array) vs single response
      if (selectedAction === "batch-verify" && Array.isArray(result)) {
        // For batch verify, you might want to show a summary
        setVerificationResult(result[0]); // Or handle multiple results differently
      } else {
        setVerificationResult(result);
      }

      setIsModalOpen(true);
    } catch (error: any) {
      console.error("Error:", error);
      alert(
        error?.response?.data?.message ||
          "An error occurred. Please try again.",
      );
    }
  };

  const formFields = getFormFields(selectedAction);
  const currentService = selectedAction
    ? serviceDescriptions[selectedAction]
    : null;
  const buttonText = getButtonText(selectedAction);

  return (
    <div className="px-4 mt-4">
      <div className="border px-4 py-4 flex flex-col gap-y-8">
        <SelectAction value={selectedAction} onChange={setSelectedAction} />

        {currentService && <ServiceDescription service={currentService} />}

        {formFields.map((field) => (
          <div key={field.name}>
            {field.type === "buttons" && selectedAction === "batch-verify" ? (
              <BatchVerifyButtons
                selectedContactIds={selectedContactIds}
                selectedContacts={formData.contacts || []}
                onToggle={handleContactToggle}
              />
            ) : field.type === "textarea" ? (
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

        <Button onClick={handleVerify} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </div>

      <ResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedAction={selectedAction}
        phoneNumber={formData.phoneNumber || "N/A"}
        result={verificationResult}
      />
    </div>
  );
};

export default Page;
