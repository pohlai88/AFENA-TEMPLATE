"use client";

// Column definitions for Dunning Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { DunningType } from "../types/dunning-type.js";

export const dunningTypeColumns: ColumnDef<DunningType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "dunning_type",
    header: "Dunning Type",
  },
  {
    accessorKey: "dunning_fee",
    header: "Dunning Fee",
    cell: ({ row }) => {
      const val = row.getValue("dunning_fee") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "rate_of_interest",
    header: "Rate of Interest (%) Yearly",
  },
];