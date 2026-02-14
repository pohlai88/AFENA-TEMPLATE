"use client";

// Column definitions for Non Conformance
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { NonConformance } from "../types/non-conformance.js";

export const nonConformanceColumns: ColumnDef<NonConformance>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "procedure",
    header: "Procedure",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];