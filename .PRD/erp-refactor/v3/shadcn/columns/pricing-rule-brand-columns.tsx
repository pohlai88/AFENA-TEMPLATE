"use client";

// Column definitions for Pricing Rule Brand
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PricingRuleBrand } from "../types/pricing-rule-brand.js";

export const pricingRuleBrandColumns: ColumnDef<PricingRuleBrand>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },
];