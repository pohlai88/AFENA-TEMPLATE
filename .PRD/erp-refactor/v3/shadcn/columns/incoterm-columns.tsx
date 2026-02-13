"use client";

// Column definitions for Incoterm
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Incoterm } from "../types/incoterm.js";

export const incotermColumns: ColumnDef<Incoterm>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
];