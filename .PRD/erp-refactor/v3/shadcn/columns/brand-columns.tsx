"use client";

// Column definitions for Brand
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Brand } from "../types/brand.js";

export const brandColumns: ColumnDef<Brand>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];