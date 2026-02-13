"use client";

// Column definitions for Pricing Rule Item Group
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PricingRuleItemGroup } from "../types/pricing-rule-item-group.js";

export const pricingRuleItemGroupColumns: ColumnDef<PricingRuleItemGroup>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_group",
    header: "Item Group",
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },
];