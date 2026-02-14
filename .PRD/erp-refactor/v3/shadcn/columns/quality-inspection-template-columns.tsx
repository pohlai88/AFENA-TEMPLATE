"use client";

// Column definitions for Quality Inspection Template
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityInspectionTemplate } from "../types/quality-inspection-template.js";

export const qualityInspectionTemplateColumns: ColumnDef<QualityInspectionTemplate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "quality_inspection_template_name",
    header: "Quality Inspection Template Name",
  },
];