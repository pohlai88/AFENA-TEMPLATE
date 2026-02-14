"use client";

// Column definitions for Price List Country
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PriceListCountry } from "../types/price-list-country.js";

export const priceListCountryColumns: ColumnDef<PriceListCountry>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
];