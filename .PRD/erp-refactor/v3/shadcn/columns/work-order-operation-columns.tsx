"use client";

// Column definitions for Work Order Operation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { WorkOrderOperation } from "../types/work-order-operation.js";

export const workOrderOperationColumns: ColumnDef<WorkOrderOperation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "operation",
    header: "Operation",
  },
  {
    accessorKey: "workstation",
    header: "Workstation",
  },
  {
    accessorKey: "finished_good",
    header: "Semi Finished Goods / Finished Goods",
  },
  {
    accessorKey: "source_warehouse",
    header: "Source Warehouse",
  },
  {
    accessorKey: "fg_warehouse",
    header: "Finished Goods Warehouse",
  },
  {
    accessorKey: "time_in_mins",
    header: "Time",
  },
];