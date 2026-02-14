"use client";

// Column definitions for Quality Feedback Template Parameter
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityFeedbackTemplateParameter } from "../types/quality-feedback-template-parameter.js";

export const qualityFeedbackTemplateParameterColumns: ColumnDef<QualityFeedbackTemplateParameter>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "parameter",
    header: "Parameter",
  },
];