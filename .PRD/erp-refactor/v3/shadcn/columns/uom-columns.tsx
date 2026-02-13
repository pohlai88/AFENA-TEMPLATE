"use client";

// Column definitions for UOM
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Uom } from "../types/uom.js";

export const uomColumns: ColumnDef<Uom>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "uom_name",
    header: "UOM Name",
  },
];