"use client";

// Column definitions for Issue
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Issue } from "../types/issue.js";

export const issueColumns: ColumnDef<Issue>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "raised_by",
    header: "Raised By (Email)",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
];