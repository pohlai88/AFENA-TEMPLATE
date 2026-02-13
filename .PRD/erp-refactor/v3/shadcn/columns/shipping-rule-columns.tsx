"use client";

// Column definitions for Shipping Rule
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ShippingRule } from "../types/shipping-rule.js";

export const shippingRuleColumns: ColumnDef<ShippingRule>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "calculate_based_on",
    header: "Calculate Based On",
  },
];