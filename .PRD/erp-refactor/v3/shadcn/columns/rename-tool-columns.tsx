"use client";

// Column definitions for Rename Tool
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { RenameTool } from "../types/rename-tool.js";

export const renameToolColumns: ColumnDef<RenameTool>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "select_doctype",
    header: "Select DocType",
  },
  {
    accessorKey: "file_to_rename",
    header: "File to Rename",
  },
  {
    accessorKey: "rename_log",
    header: "Rename Log",
  },
];