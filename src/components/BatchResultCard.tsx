import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { contactLists } from "@/constants/contacts";
import { Contact } from "@/types";

// Helper function to get contact name from phone number
const getContactName = (phoneNumber: string): string => {
  const contact = contactLists.find(
    (c: Contact) => c.phoneNumber === phoneNumber,
  );
  return contact?.name || phoneNumber;
};

// Component for displaying individual batch result card
export const BatchResultCard = ({
  result,
  index,
}: {
  result: any;
  index: number;
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "HIGH":
        return "border-red-500/30 bg-red-500/5";
      case "MEDIUM":
        return "border-yellow-500/30 bg-yellow-500/5";
      default:
        return "border-green-500/30 bg-green-500/5";
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "BLOCK":
        return <XCircle className="h-5 w-5 text-red" />;
      case "CAUTION":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusBadge = (recommendation: string) => {
    switch (recommendation) {
      case "BLOCK":
        return "bg-red-500/20 text-red-500 border-red/30";
      case "CAUTION":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      default:
        return "bg-green-500/20 text-green-500 border-green-500/30";
    }
  };

  const contactName = getContactName(result.phoneNumber);
  const isNameDifferent = contactName !== result.phoneNumber;

  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${getRiskColor(
        result.decision?.risk,
      )}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-gray-300">{contactName}</div>
          <div
            className={`text-xs px-2 py-0.5 rounded-full border ${getStatusBadge(
              result.decision?.recommendation,
            )}`}
          >
            {result.decision?.recommendation}
          </div>
        </div>
        {getRecommendationIcon(result.decision?.recommendation)}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Phone:</span>
          <span className="text-white font-mono text-xs">
            {result.phoneNumber}
            {isNameDifferent && (
              <span className="text-gray-500 ml-1">({contactName})</span>
            )}
          </span>
        </div>

        <div className="text-xs text-gray-400 leading-relaxed">
          {result.decision?.reason}
        </div>

        {/*  Show additional raw data in a compact way */}
        <div className="flex items-center gap-4 pt-2 text-xs">
          {result.raw?.simSwap && (
            <div className="flex items-center gap-1">
              <span className="text-gray-400">SIM Swap:</span>
              <span
                className={
                  result.raw.simSwap.swapped ? "text-red-500" : "text-green-500"
                }
              >
                {result.raw.simSwap.swapped ? "Yes" : "No"}
              </span>
            </div>
          )}
          {result.raw?.deviceStatus?.connectivityStatus && (
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Device:</span>
              <span className="text-gray-300">
                {result.raw.deviceStatus.connectivityStatus === "CONNECTED_DATA"
                  ? "Data"
                  : result.raw.deviceStatus.connectivityStatus ===
                    "CONNECTED_SMS"
                  ? "SMS"
                  : "Offline"}
              </span>
            </div>
          )}
          {result.raw?.kycMatch && (
            <div className="flex items-center gap-1">
              <span className="text-gray-400">KYC:</span>
              <span
                className={
                  result.raw.kycMatch.match === "true"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {result.raw.kycMatch.match ? "Match" : "No Match"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchResultCard;
