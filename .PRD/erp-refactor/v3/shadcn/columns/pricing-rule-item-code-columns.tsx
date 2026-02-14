"use client";

// Column definitions for Pricing Rule Item Code
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PricingRuleItemCode } from "../types/pricing-rule-item-code.js";

export const pricingRuleItemCodeColumns: ColumnDef<PricingRuleItemCode>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },
];