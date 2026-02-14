"use client";

// Column definitions for Quality Procedure
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityProcedure } from "../types/quality-procedure.js";

export const qualityProcedureColumns: ColumnDef<QualityProcedure>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "quality_procedure_name",
    header: "Quality Procedure",
  },
];