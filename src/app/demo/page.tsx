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
import { ActivityIcon, BotIcon, TriangleAlert } from "lucide-react";

const Page = () => {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleVerify = async () => {
    if (!selectedAction) {
      alert("Please select an action");
      return;
    }

    if (!phoneNumber) {
      alert("Please enter a phone number");
      return;
    }

    // Make API call to Sentinel backend
    // For now, we'll simulate a response
    const mockResponse = {
      risk: "HIGH",
      recommendation: "BLOCK",
      reason:
        "This phone number's SIM was swapped 2 hours ago. Do not send money – this is a common fraud pattern.",
    };

    setVerificationResult(mockResponse);
    setIsModalOpen(true);
  };

  return (
    <div className="px-4 border">
      <div className="border px-4 py-4 flex flex-col gap-y-8">
        <SelectAction value={selectedAction} onChange={setSelectedAction} />
        <InputField value={phoneNumber} onChange={setPhoneNumber} />
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
                <ActivityIcon /> {selectedAction || "N/A"}
              </span>{" "}
              • {phoneNumber || "N/A"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex justify-center items-center">
              <TriangleAlert />
            </div>
            <div className="text-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {verificationResult?.reason}
              </p>
            </div>

            <div className="flex flex-col gap-y-2 items-center border border-white rounded-md py-4">
              <BotIcon />
              <div className="flex flex-col items-center justify-center text-sm">
                <div className="font-medium text-center w-full">
                  Risk Accessment
                </div>
                <div
                  className={`font-bold tex-center ${
                    verificationResult?.risk === "HIGH"
                      ? "text-red"
                      : verificationResult?.risk === "MEDIUM"
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
