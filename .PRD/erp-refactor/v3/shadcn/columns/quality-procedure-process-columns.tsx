"use client";

// Column definitions for Quality Procedure Process
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityProcedureProcess } from "../types/quality-procedure-process.js";

export const qualityProcedureProcessColumns: ColumnDef<QualityProcedureProcess>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "process_description",
    header: "Process Description",
  },
  {
    accessorKey: "procedure",
    header: "Sub Procedure",
  },
];