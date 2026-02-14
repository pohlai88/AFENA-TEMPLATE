"use client";

// Column definitions for Installation Note Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { InstallationNoteItem } from "../types/installation-note-item.js";

export const installationNoteItemColumns: ColumnDef<InstallationNoteItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "qty",
    header: "Installed Qty",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];