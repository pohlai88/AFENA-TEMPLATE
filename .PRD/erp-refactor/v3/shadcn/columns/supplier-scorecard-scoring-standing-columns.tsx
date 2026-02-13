"use client";

// Column definitions for Supplier Scorecard Scoring Standing
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupplierScorecardScoringStanding } from "../types/supplier-scorecard-scoring-standing.js";

export const supplierScorecardScoringStandingColumns: ColumnDef<SupplierScorecardScoringStanding>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "standing_name",
    header: "Standing Name",
  },
  {
    accessorKey: "min_grade",
    header: "Min Grade",
  },
  {
    accessorKey: "max_grade",
    header: "Max Grade",
  },
];