"use client";

// Column definitions for Serial No
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SerialNo } from "../types/serial-no.js";

export const serialNoColumns: ColumnDef<SerialNo>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];