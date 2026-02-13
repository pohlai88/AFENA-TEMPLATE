"use client";

// Column definitions for Quality Feedback Parameter
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityFeedbackParameter } from "../types/quality-feedback-parameter.js";

export const qualityFeedbackParameterColumns: ColumnDef<QualityFeedbackParameter>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "parameter",
    header: "Parameter",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "feedback",
    header: "Feedback",
  },
];