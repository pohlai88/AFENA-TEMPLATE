"use client";

// Column definitions for Workstation Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { WorkstationType } from "../types/workstation-type.js";

export const workstationTypeColumns: ColumnDef<WorkstationType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "workstation_type",
    header: "Workstation Type",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];