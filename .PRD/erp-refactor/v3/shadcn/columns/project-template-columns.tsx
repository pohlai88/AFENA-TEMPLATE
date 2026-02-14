"use client";

// Column definitions for Project Template
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProjectTemplate } from "../types/project-template.js";

export const projectTemplateColumns: ColumnDef<ProjectTemplate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "project_type",
    header: "Project Type",
  },
];