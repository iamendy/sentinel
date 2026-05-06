"use client";

import * as React from "react";

import { Field, FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectActionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SelectAction({ value, onChange }: SelectActionProps) {
  // Map Sentinel endpoints to user-friendly names
  const actions = [
    { value: "check-recipient", label: "Check Recipient Safety" },
    { value: "verify-identity", label: "Verify Identity (KYC)" },
    { value: "geofence-transaction", label: "Geofence Transaction" },
    { value: "batch-verify", label: "Batch Verify (Bulk)" },
    { value: "device-trust", label: "Device Trust Assessment" },
  ];

  return (
    <FieldGroup className="w-full max-w-xs">
      <Field>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an action..." />
          </SelectTrigger>
          <SelectContent position={"item-aligned"}>
            <SelectGroup>
              {actions.map((action) => (
                <SelectItem key={action.value} value={action.value}>
                  {action.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  );
}
