"use client";

// Column definitions for Project Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProjectType } from "../types/project-type.js";

export const projectTypeColumns: ColumnDef<ProjectType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "project_type",
    header: "Project Type",
  },
];