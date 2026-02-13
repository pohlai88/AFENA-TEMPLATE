"use client";

// Column definitions for Designation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Designation } from "../types/designation.js";

export const designationColumns: ColumnDef<Designation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "designation_name",
    header: "Designation",
  },
];