"use client";

// Column definitions for Pricing Rule
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PricingRule } from "../types/pricing-rule.js";

export const pricingRuleColumns: ColumnDef<PricingRule>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "apply_on",
    header: "Apply On",
  },
];