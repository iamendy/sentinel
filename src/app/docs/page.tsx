"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Copy,
  Check,
  Terminal,
  UserCheck,
  Users,
  Smartphone,
  MapPin,
  Fingerprint,
} from "lucide-react";

// API endpoint definitions based on your actual routes
type ApiEndpoint = {
  id: string;
  name: string;
  method: "POST";
  path: string;
  description: string;
  useCase: string;
  requestSchema: {
    required: string[];
    optional: string[];
    example: Record<string, unknown>;
  };
  curlExample: string;
  exampleRequest: {
    headers: Record<string, string>;
    body: Record<string, unknown>;
  };
  exampleResponse: {
    status: number;
    body: Record<string, unknown>;
  };
};

const apiEndpoints: Record<string, ApiEndpoint> = {
  "check-recipient": {
    id: "check-recipient",
    name: "Check Recipient",
    method: "POST",
    path: "/api/check-recipient",
    useCase: "send_money",
    description:
      "Evaluate recipient risk before sending money. Checks SIM swap status and device connectivity to detect fraud patterns.",
    requestSchema: {
      required: ["phoneNumber"],
      optional: ["maxAge"],
      example: {
        phoneNumber: "+99999991000",
        maxAge: 3600,
      },
    },
    curlExample: `curl -X POST https://sentinelafrica.vercel.app/api/check-recipient -H "Content-Type: application/json" -d '{"phoneNumber": "+99999991002"}'`,
    exampleRequest: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        phoneNumber: "+99999991000",
      },
    },
    exampleResponse: {
      status: 200,
      body: {
        phoneNumber: "+99999991000",
        decision: {
          risk: "HIGH",
          recommendation: "BLOCK",
          reason:
            "This phone number's SIM was recently swapped. This is a common fraud pattern. Verify via a phone call",
        },
        raw: {
          simSwap: {
            swapped: true,
            swappedAt: "2024-01-14T15:30:00Z",
          },
          deviceStatus: {
            connectivityStatus: "CONNECTED",
            reachabilityStatus: "REACHABLE",
            lastStatusTime: "2024-01-15T10:30:00Z",
          },
        },
      },
    },
  },
  "batch-verify": {
    id: "batch-verify",
    name: "Batch Verify",
    method: "POST",
    path: "/api/batch-verify",
    useCase: "batch_verify",
    description:
      "Verify multiple contacts in bulk. Perfect for onboarding multiple users or batch processing KYC checks.",
    requestSchema: {
      required: ["contacts"],
      optional: [],
      example: {
        contacts: [
          {
            phoneNumber: "+99999991000",
            idNo: "66666666q",
            gender: "M",
            name: "John Doe",
            maxAge: 3600,
          },
        ],
      },
    },
    curlExample: `curl -X POST https://sentinelafrica.vercel.app/api/batch-verify \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": [
      {
        "phoneNumber": "+99999991000",
        "idNo": "66666666q",
        "gender": "M",
        "name": "John Doe",
        "maxAge": 3600
      },
      {
        "phoneNumber": "+99999991000",
        "idNo": "87654321",
        "gender": "F",
        "name": "Jane Smith"
      }
    ]
  }'`,
    exampleRequest: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        contacts: [
          {
            phoneNumber: "+99999991000",
            idNo: "12345678",
            gender: "M",
            name: "John Doe",
            maxAge: 3600,
          },
          {
            phoneNumber: "+99999991000",
            idNo: "87654321",
            gender: "F",
            name: "Jane Smith",
          },
        ],
      },
    },
    exampleResponse: {
      status: 200,
      body: {
        total: 2,
        successful: 1,
        failed: 1,
        results: [
          {
            success: true,
            phoneNumber: "+99999991000",
            decision: {
              risk: "LOW",
              recommendation: "SAFE",
              reason: "No fraud indicators detected. Safe to proceed.",
            },
            raw: {
              simSwap: { swapped: false },
              deviceStatus: {
                connectivityStatus: "CONNECTED",
                reachabilityStatus: "REACHABLE",
                lastStatusTime: "2024-01-15T10:30:00Z",
              },
              kycMatch: { match: true },
            },
          },
          {
            success: false,
            phoneNumber: "+99999991000",
            error: "Failed to verify: Invalid phone number",
          },
        ],
      },
    },
  },
  "device-trust": {
    id: "device-trust",
    name: "Device Trust",
    method: "POST",
    path: "/api/device-trust",
    useCase: "device_trust",
    description:
      "Assess device trustworthiness by checking device status, swap history, and optional location verification.",
    requestSchema: {
      required: ["phoneNumber"],
      optional: ["latitude", "longitude", "radius", "maxAge"],
      example: {
        phoneNumber: "+99999991000",
        latitude: -1.2921,
        longitude: 36.8219,
        radius: 1000,
        maxAge: 3600,
      },
    },
    curlExample: `curl -X POST https://sentinelafrica.vercel.app/api/device-trust \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+99999991000",
    "latitude": -1.2921,
    "longitude": 36.8219,
    "radius": 1000
  }'
`,
    exampleRequest: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        phoneNumber: "+99999991000",
        latitude: -1.2921,
        longitude: 36.8219,
        radius: 1000,
        maxAge: 3600,
      },
    },
    exampleResponse: {
      status: 200,
      body: {
        phoneNumber: "+99999991000",
        decision: {
          risk: "MEDIUM",
          recommendation: "CAUTION",
          reason:
            "Device is not connected to the network. The user may not receive transaction notifications.",
        },
        raw: {
          deviceSwap: {
            swapped: false,
          },
          deviceStatus: {
            connectivityStatus: "DISCONNECTED",
            reachabilityStatus: "UNREACHABLE",
            lastStatusTime: "2024-01-15T09:30:00Z",
          },
          locationVerification: {
            verificationResult: "TRUE",
            lastLocationTime: "2024-01-15T10:30:00Z",
          },
        },
      },
    },
  },
  "geofence-transaction": {
    id: "geofence-transaction",
    name: "Geofence Transaction",
    method: "POST",
    path: "/api/geofence-transaction",
    useCase: "location_check",
    description:
      "Verify if a device is within a specified geofence before authorizing location-sensitive transactions.",
    requestSchema: {
      required: ["phoneNumber", "latitude", "longitude"],
      optional: ["radius", "maxAge"],
      example: {
        phoneNumber: "+99999991000",
        latitude: -1.2921,
        longitude: 36.8219,
        radius: 1000,
        maxAge: 3600,
      },
    },
    curlExample: `curl -X POST https://sentinelafrica.vercel.app/api/geofence-transaction \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+99999991000",
    "latitude": -1.2921,
    "longitude": 36.8219,
    "radius": 1000,
    "maxAge": 3600
  }'`,
    exampleRequest: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        phoneNumber: "+99999991000",
        latitude: -1.2921,
        longitude: 36.8219,
        radius: 1000,
        maxAge: 3600,
      },
    },
    exampleResponse: {
      status: 200,
      body: {
        phoneNumber: "+99999991000",
        decision: {
          risk: "MEDIUM",
          recommendation: "CAUTION",
          reason:
            "Device is not at the expected location. Verify with the user before proceeding.",
        },
        raw: {
          location: {
            latitude: -1.3,
            longitude: 36.83,
            timestamp: "2024-01-15T10:30:00Z",
          },
          deviceStatus: {
            connectivityStatus: "CONNECTED",
            reachabilityStatus: "REACHABLE",
            lastStatusTime: "2024-01-15T10:30:00Z",
          },
          geofence: {
            expectedLatitude: -1.2921,
            expectedLongitude: 36.8219,
            radius: 1000,
            withinGeofence: false,
          },
        },
      },
    },
  },
  "verify-identity": {
    id: "verify-identity",
    name: "Verify Identity",
    method: "POST",
    path: "/api/verify-identity",
    useCase: "onboarding",
    description:
      "Verify a user's identity by matching KYC documents against mobile network operator data.",
    requestSchema: {
      required: ["phoneNumber", "idNo"],
      optional: [],
      example: {
        phoneNumber: "+99999991000",
        idNo: "12345678",
      },
    },
    curlExample: `curl -X POST https://sentinelafrica.vercel.app/api/verify-identity \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+99999991000",
    "idNo": "6666666q"
  }'`,
    exampleRequest: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        phoneNumber: "+99999991000",
        idNo: "6666666q",
      },
    },
    exampleResponse: {
      status: 200,
      body: {
        phoneNumber: "+99999991000",
        decision: {
          risk: "HIGH",
          recommendation: "BLOCK",
          reason:
            "ID document does not match the phone number owner. Cannot verify identity.",
        },
        raw: {
          kycMatch: {
            match: false,
          },
          simSwap: {
            swapped: false,
          },
          deviceStatus: {
            connectivityStatus: "CONNECTED",
            reachabilityStatus: "REACHABLE",
            lastStatusTime: "2024-01-15T10:30:00Z",
          },
        },
      },
    },
  },
};

// Code block component
const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 bg-white/10 hover:bg-white/20 text-white"
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span className="ml-1 text-xs">{copied ? "Copied!" : "Copy"}</span>
        </Button>
      </div>
      <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
          <div className="text-xs text-gray-500 mb-2">{language}</div>
          {code}
        </code>
      </pre>
    </div>
  );
};

// JSON viewer
const JsonViewer = ({ data }: { data: Record<string, unknown> }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 bg-white/10 hover:bg-white/20 text-white"
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span className="ml-1 text-xs">{copied ? "Copied!" : "Copy"}</span>
        </Button>
      </div>
      <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-green-400 font-mono">
          {JSON.stringify(data, null, 2)}
        </code>
      </pre>
    </div>
  );
};

export default function ApiDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] =
    useState<string>("check-recipient");
  const currentEndpoint = apiEndpoints[selectedEndpoint];
  const response = currentEndpoint.exampleResponse.body;

  // Get icon for endpoint
  const getIcon = (id: string) => {
    switch (id) {
      case "check-recipient":
        return <UserCheck className="h-5 w-5" />;
      case "batch-verify":
        return <Users className="h-5 w-5" />;
      case "device-trust":
        return <Smartphone className="h-5 w-5" />;
      case "geofence-transaction":
        return <MapPin className="h-5 w-5" />;
      case "verify-identity":
        return <Fingerprint className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto">
      {/* Selector Section */}
      <Card className="card border-white/10 ">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            Select an API Endpoint
          </CardTitle>
          <CardDescription className="text-gray">
            Choose an endpoint to view summary and request/response examples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
            <SelectTrigger className="w-full md:w-[400px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select an API endpoint" />
            </SelectTrigger>
            <SelectContent className="bg-base border-white/10">
              <SelectGroup>
                <SelectLabel className="text-gray">
                  Fraud Detection APIs
                </SelectLabel>
                {Object.entries(apiEndpoints).map(([id, endpoint]) => (
                  <SelectItem
                    key={id}
                    value={id}
                    className="text-white focus:bg-white/10"
                  >
                    <div className="flex items-center gap-2">
                      {getIcon(id)}
                      <span>{endpoint.name}</span>
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs border-primary/50 text-primary"
                      >
                        {endpoint.method}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Endpoint Info */}
      <Card className="card border-white/10 ">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {currentEndpoint.useCase}
            </Badge>
          </div>
          <CardTitle className="text-2xl text-white">
            {currentEndpoint.name}
          </CardTitle>
          <CardDescription className="text-white  mt-2">
            {currentEndpoint.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <span className="text-gray text-sm min-w-[80px]">Endpoint:</span>
              <code className="text-primary font-mono text-sm break-all">
                {currentEndpoint.path}
              </code>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray text-sm min-w-[80px]">Method:</span>
              <Badge
                variant="outline"
                className="border-primary/50 text-primary"
              >
                {currentEndpoint.method}
              </Badge>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray text-sm min-w-[80px]">Base URL:</span>
              <code className="text-gray font-mono text-sm">
                https://sentinelafrica.vercel.app
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Curl example */}
      <Card className="card border-white/10 bg-base/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            cURL Example
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock code={currentEndpoint.curlExample} language="bash" />
        </CardContent>
      </Card>

      <div>
        <div>
          <h3>Example Request</h3>
          <JsonViewer data={currentEndpoint.exampleRequest.body} />
        </div>

        <div>
          <h3>Example Request</h3>
          <JsonViewer data={response} />
        </div>
      </div>
    </div>
  );
}
