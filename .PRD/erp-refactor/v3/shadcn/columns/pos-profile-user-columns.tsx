"use client";

// Column definitions for POS Profile User
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PosProfileUser } from "../types/pos-profile-user.js";

export const posProfileUserColumns: ColumnDef<PosProfileUser>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "default",
    header: "Default",
    cell: ({ row }) => row.getValue("default") ? "Yes" : "No",
  },
  {
    accessorKey: "user",
    header: "User",
  },
];