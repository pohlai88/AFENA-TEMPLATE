"use client";

// Column definitions for Supplier Scorecard Criteria
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupplierScorecardCriteria } from "../types/supplier-scorecard-criteria.js";

export const supplierScorecardCriteriaColumns: ColumnDef<SupplierScorecardCriteria>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "max_score",
    header: "Max Score",
  },
  {
    accessorKey: "formula",
    header: "Criteria Formula",
  },
];