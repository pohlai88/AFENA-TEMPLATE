"use client";

// Column definitions for Linked Location
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LinkedLocation } from "../types/linked-location.js";

export const linkedLocationColumns: ColumnDef<LinkedLocation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
];