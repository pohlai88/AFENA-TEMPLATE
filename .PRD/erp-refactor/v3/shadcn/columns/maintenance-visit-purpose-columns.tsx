"use client";

// Column definitions for Maintenance Visit Purpose
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { MaintenanceVisitPurpose } from "../types/maintenance-visit-purpose.js";

export const maintenanceVisitPurposeColumns: ColumnDef<MaintenanceVisitPurpose>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "item_name",
    header: "Item Name",
  },
  {
    accessorKey: "service_person",
    header: "Sales Person",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "work_done",
    header: "Work Done",
  },
];