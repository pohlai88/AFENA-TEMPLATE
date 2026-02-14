"use client";

// Column definitions for Share Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ShareType } from "../types/share-type.js";

export const shareTypeColumns: ColumnDef<ShareType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
];