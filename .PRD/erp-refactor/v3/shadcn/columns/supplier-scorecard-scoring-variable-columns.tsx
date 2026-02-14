"use client";

// Column definitions for Supplier Scorecard Scoring Variable
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupplierScorecardScoringVariable } from "../types/supplier-scorecard-scoring-variable.js";

export const supplierScorecardScoringVariableColumns: ColumnDef<SupplierScorecardScoringVariable>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "variable_label",
    header: "Variable Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
];