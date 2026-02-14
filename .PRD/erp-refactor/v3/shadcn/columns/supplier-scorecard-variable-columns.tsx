"use client";

// Column definitions for Supplier Scorecard Variable
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupplierScorecardVariable } from "../types/supplier-scorecard-variable.js";

export const supplierScorecardVariableColumns: ColumnDef<SupplierScorecardVariable>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "param_name",
    header: "Parameter Name",
  },
];