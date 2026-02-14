"use client";

// Column definitions for Shipping Rule Condition
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ShippingRuleCondition } from "../types/shipping-rule-condition.js";

export const shippingRuleConditionColumns: ColumnDef<ShippingRuleCondition>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "from_value",
    header: "From Value",
  },
  {
    accessorKey: "to_value",
    header: "To Value",
  },
  {
    accessorKey: "shipping_amount",
    header: "Shipping Amount",
    cell: ({ row }) => {
      const val = row.getValue("shipping_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];