"use client";

// Column definitions for Supplier Scorecard Standing
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupplierScorecardStanding } from "../types/supplier-scorecard-standing.js";

export const supplierScorecardStandingColumns: ColumnDef<SupplierScorecardStanding>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "standing_name",
    header: "Standing Name",
  },
  {
    accessorKey: "standing_color",
    header: "Color",
  },
  {
    accessorKey: "min_grade",
    header: "Min Grade",
  },
  {
    accessorKey: "max_grade",
    header: "Max Grade",
  },
  {
    accessorKey: "warn_rfqs",
    header: "Warn RFQs",
    cell: ({ row }) => row.getValue("warn_rfqs") ? "Yes" : "No",
  },
];