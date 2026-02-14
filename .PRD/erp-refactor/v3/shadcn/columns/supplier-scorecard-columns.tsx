"use client";

// Column definitions for Supplier Scorecard
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupplierScorecard } from "../types/supplier-scorecard.js";

export const supplierScorecardColumns: ColumnDef<SupplierScorecard>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "period",
    header: "Evaluation Period",
  },
];