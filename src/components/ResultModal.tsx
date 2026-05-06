// components/ResultModal.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ActivityIcon, BotIcon, TriangleAlert } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedAction: string;
  phoneNumber: string;
  result: any;
}

export const ResultModal = ({
  isOpen,
  onClose,
  selectedAction,
  phoneNumber,
  result,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center">Verification Result</DialogTitle>
          <DialogDescription className="flex items-center justify-center gap-x-2 my-2">
            <span className="flex items-center gap-x-2">
              <ActivityIcon className="h-4 w-4" /> {selectedAction || "N/A"}
            </span>{" "}
            • {phoneNumber || "N/A"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex justify-center items-center">
            <TriangleAlert
              className={`h-12 w-12 ${
                result?.risk === "HIGH"
                  ? "text-red"
                  : result?.risk === "MEDIUM"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            />
          </div>
          <div className="text-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {result?.reason}
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
                  result?.recommendation === "BLOCK"
                    ? "text-red"
                    : result?.recommendation === "CAUTION"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {result?.recommendation || "N/A"}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="default" onClick={onClose}>
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
