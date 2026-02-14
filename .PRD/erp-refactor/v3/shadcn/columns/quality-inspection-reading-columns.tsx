"use client";

// Column definitions for Quality Inspection Reading
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityInspectionReading } from "../types/quality-inspection-reading.js";

export const qualityInspectionReadingColumns: ColumnDef<QualityInspectionReading>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "specification",
    header: "Parameter",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "numeric",
    header: "Numeric",
    cell: ({ row }) => row.getValue("numeric") ? "Yes" : "No",
  },
  {
    accessorKey: "reading_value",
    header: "Reading Value",
  },
  {
    accessorKey: "reading_1",
    header: "Reading 1",
  },
];