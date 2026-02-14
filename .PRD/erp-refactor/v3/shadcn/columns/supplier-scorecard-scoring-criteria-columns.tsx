"use client";

// Column definitions for Supplier Scorecard Scoring Criteria
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupplierScorecardScoringCriteria } from "../types/supplier-scorecard-scoring-criteria.js";

export const supplierScorecardScoringCriteriaColumns: ColumnDef<SupplierScorecardScoringCriteria>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "criteria_name",
    header: "Criteria Name",
  },
  {
    accessorKey: "score",
    header: "Score",
  },
  {
    accessorKey: "weight",
    header: "Criteria Weight",
  },
];