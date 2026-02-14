"use client";

// Column definitions for Shipping Rule Country
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ShippingRuleCountry } from "../types/shipping-rule-country.js";

export const shippingRuleCountryColumns: ColumnDef<ShippingRuleCountry>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
];