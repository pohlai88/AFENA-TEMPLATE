"use client";

// Column definitions for Support Search Source
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupportSearchSource } from "../types/support-search-source.js";

export const supportSearchSourceColumns: ColumnDef<SupportSearchSource>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "source_name",
    header: "Source Name",
  },
  {
    accessorKey: "source_type",
    header: "Source Type",
  },
];