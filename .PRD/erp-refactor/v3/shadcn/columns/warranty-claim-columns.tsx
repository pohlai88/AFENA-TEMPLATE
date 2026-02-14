"use client";

// Column definitions for Warranty Claim
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { WarrantyClaim } from "../types/warranty-claim.js";

export const warrantyClaimColumns: ColumnDef<WarrantyClaim>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
];