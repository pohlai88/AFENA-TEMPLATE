"use client";

// Column definitions for Operation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Operation } from "../types/operation.js";

export const operationColumns: ColumnDef<Operation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "workstation",
    header: "Default Workstation",
  },
];