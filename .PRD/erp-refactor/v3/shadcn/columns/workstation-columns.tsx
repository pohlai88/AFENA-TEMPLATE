"use client";

// Column definitions for Workstation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Workstation } from "../types/workstation.js";

export const workstationColumns: ColumnDef<Workstation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "workstation_name",
    header: "Workstation Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];