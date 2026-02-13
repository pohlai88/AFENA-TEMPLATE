"use client";

// Column definitions for Pricing Rule Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PricingRuleDetail } from "../types/pricing-rule-detail.js";

export const pricingRuleDetailColumns: ColumnDef<PricingRuleDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "pricing_rule",
    header: "Pricing Rule",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
];