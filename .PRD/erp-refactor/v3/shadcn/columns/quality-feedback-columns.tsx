"use client";

// Column definitions for Quality Feedback
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityFeedback } from "../types/quality-feedback.js";

export const qualityFeedbackColumns: ColumnDef<QualityFeedback>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "template",
    header: "Template",
  },
  {
    accessorKey: "document_type",
    header: "Type",
  },
  {
    accessorKey: "document_name",
    header: "Feedback By",
  },
];