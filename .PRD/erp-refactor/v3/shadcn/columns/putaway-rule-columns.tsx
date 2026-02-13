"use client";

// Column definitions for Putaway Rule
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PutawayRule } from "../types/putaway-rule.js";

export const putawayRuleColumns: ColumnDef<PutawayRule>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
  },
];