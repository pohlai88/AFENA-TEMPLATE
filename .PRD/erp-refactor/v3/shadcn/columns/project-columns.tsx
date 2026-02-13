"use client";

// Column definitions for Project
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Project } from "../types/project.js";

export const projectColumns: ColumnDef<Project>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "project_type",
    header: "Project Type",
  },
  {
    accessorKey: "expected_end_date",
    header: "Expected End Date",
    cell: ({ row }) => {
      const val = row.getValue("expected_end_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "estimated_costing",
    header: "Estimated Cost",
    cell: ({ row }) => {
      const val = row.getValue("estimated_costing") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];