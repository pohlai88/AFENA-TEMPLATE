"use client";

// Column definitions for Workstation Operating Component
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { WorkstationOperatingComponent } from "../types/workstation-operating-component.js";

export const workstationOperatingComponentColumns: ColumnDef<WorkstationOperatingComponent>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "component_name",
    header: "Component Name",
  },
];