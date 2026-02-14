"use client";

// Column definitions for Manufacturer
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Manufacturer } from "../types/manufacturer.js";

export const manufacturerColumns: ColumnDef<Manufacturer>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
];