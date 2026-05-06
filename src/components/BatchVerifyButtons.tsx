// components/BatchVerifyButtons.tsx
import { Check } from "lucide-react";
import { Contact } from "@/types";
import { contactLists } from "@/constants/contacts";

interface Props {
  selectedContactIds: Set<string>;
  selectedContacts: any[];
  onToggle: (contact: Contact) => void;
}

export const BatchVerifyButtons = ({
  selectedContactIds,
  selectedContacts,
  onToggle,
}: Props) => {
  return (
    <div className="flex flex-col gap-y-3">
      <label className="text-sm text-gray-400">Select Contacts</label>
      <div className="grid grid-cols-2 gap-3">
        {contactLists.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onToggle(contact)}
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

      {selectedContacts.length > 0 && (
        <div className="mt-3 p-3 bg-gray-800 rounded-md">
          <div className="text-xs text-gray-400 mb-2">
            Selected Contacts ({selectedContacts.length}):
          </div>
          <div className="space-y-1">
            {selectedContacts.map((contact: any, index: number) => (
              <div
                key={index}
                className="text-xs text-gray-300 flex justify-between"
              >
                <span>{contact.name || contact.phoneNumber}</span>
                <span className="text-gray-500">{contact.phoneNumber}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
