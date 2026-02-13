"use client";

// Column definitions for Issue Priority
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { IssuePriority } from "../types/issue-priority.js";

export const issuePriorityColumns: ColumnDef<IssuePriority>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];