"use client";

// Column definitions for BOM Operation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BomOperation } from "../types/bom-operation.js";

export const bomOperationColumns: ColumnDef<BomOperation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "operation",
    header: "Operation",
  },
  {
    accessorKey: "sequence_id",
    header: "Sequence ID",
  },
  {
    accessorKey: "finished_good",
    header: "FG / Semi FG Item",
  },
  {
    accessorKey: "finished_good_qty",
    header: "Qty to Produce",
  },
  {
    accessorKey: "bom_no",
    header: "BOM No",
  },
  {
    accessorKey: "workstation_type",
    header: "Workstation Type",
  },
  {
    accessorKey: "workstation",
    header: "Workstation",
  },
  {
    accessorKey: "time_in_mins",
    header: "Operation Time",
  },
];