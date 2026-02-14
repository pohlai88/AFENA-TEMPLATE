"use client";

// Column definitions for PSOA Project
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PsoaProject } from "../types/psoa-project.js";

export const psoaProjectColumns: ColumnDef<PsoaProject>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "project_name",
    header: "Project",
  },
];