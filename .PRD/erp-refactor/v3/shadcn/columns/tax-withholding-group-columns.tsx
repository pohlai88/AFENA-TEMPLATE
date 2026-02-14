"use client";

// Column definitions for Tax Withholding Group
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TaxWithholdingGroup } from "../types/tax-withholding-group.js";

export const taxWithholdingGroupColumns: ColumnDef<TaxWithholdingGroup>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "group_name",
    header: "Group Name",
  },
];