"use client";

// Column definitions for Issue Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { IssueType } from "../types/issue-type.js";

export const issueTypeColumns: ColumnDef<IssueType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];