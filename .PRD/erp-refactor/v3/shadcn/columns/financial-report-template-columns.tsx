"use client";

// Column definitions for Financial Report Template
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { FinancialReportTemplate } from "../types/financial-report-template.js";

export const financialReportTemplateColumns: ColumnDef<FinancialReportTemplate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "template_name",
    header: "Template Name",
  },
  {
    accessorKey: "report_type",
    header: "Report Type",
  },
];