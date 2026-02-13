"use client";

// Column definitions for Quality Feedback Template
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityFeedbackTemplate } from "../types/quality-feedback-template.js";

export const qualityFeedbackTemplateColumns: ColumnDef<QualityFeedbackTemplate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "template",
    header: "Template Name",
  },
];