"use client";

// Column definitions for Code List
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CodeList } from "../types/code-list.js";

export const codeListColumns: ColumnDef<CodeList>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "canonical_uri",
    header: "Canonical URI",
  },
  {
    accessorKey: "version",
    header: "Version",
  },
];