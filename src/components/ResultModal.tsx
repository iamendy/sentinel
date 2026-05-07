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
import { SentinelResponse, BatchVerificationResponse } from "@/types";
import BatchResultCard from "@/components/BatchResultCard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedAction: string;
  result: SentinelResponse | BatchVerificationResponse | null;
}

export const ResultModal = ({
  isOpen,
  onClose,
  selectedAction,
  result,
}: Props) => {
  // Check if this is a batch verification result
  const isBatchResult = result && "total" in result && "results" in result;
  const batchResults = isBatchResult
    ? (result as BatchVerificationResponse).results
    : [];
  const singleResult = !isBatchResult ? (result as SentinelResponse) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-md ${
          isBatchResult && batchResults.length > 2
            ? "sm:max-w-lg"
            : "sm:max-w-md"
        }`}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            {isBatchResult
              ? "Batch Verification Results"
              : "Verification Result"}
          </DialogTitle>
          <DialogDescription className="flex items-center justify-center gap-x-2 my-2">
            <span className="flex items-center gap-x-2">
              <ActivityIcon className="h-4 w-4" /> {selectedAction || "N/A"}
            </span>
            {!isBatchResult && singleResult && (
              <> • {singleResult?.phoneNumber || "N/A"}</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {isBatchResult ? (
            <>
              {/* Summary Stats */}
              <BatchSummary results={batchResults} />

              {/* Results Cards Stack */}
              <div className="space-y-3">
                {batchResults.map((result, index) => (
                  <BatchResultCard
                    key={result.phoneNumber || index}
                    result={result}
                    index={index}
                  />
                ))}
              </div>
            </>
          ) : (
            singleResult && (
              <>
                <div className="flex justify-center items-center">
                  <TriangleAlert
                    className={`h-12 w-12 ${
                      singleResult.decision?.risk === "HIGH"
                        ? "text-red"
                        : singleResult.decision?.risk === "MEDIUM"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  />
                </div>
                <div className="text-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {singleResult.decision?.reason}
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
                        singleResult.decision?.recommendation === "BLOCK"
                          ? "text-red"
                          : singleResult.decision?.recommendation === "CAUTION"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {singleResult.decision?.recommendation || "N/A"}
                    </div>
                  </div>
                </div>
              </>
            )
          )}
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

// For displaying batch verification summary
const BatchSummary = ({ results }: { results: any[] }) => {
  const blocked = results.filter(
    (r) => r.decision?.recommendation === "BLOCK",
  ).length;
  const caution = results.filter(
    (r) => r.decision?.recommendation === "CAUTION",
  ).length;
  const safe = results.filter(
    (r) => r.decision?.recommendation === "SAFE",
  ).length;

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-red-500">{blocked}</div>
        <div className="text-xs text-gray-400">Blocked</div>
      </div>
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-yellow-500">{caution}</div>
        <div className="text-xs text-gray-400">Caution</div>
      </div>
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-green-500">{safe}</div>
        <div className="text-xs text-gray-400">Safe</div>
      </div>
    </div>
  );
};
