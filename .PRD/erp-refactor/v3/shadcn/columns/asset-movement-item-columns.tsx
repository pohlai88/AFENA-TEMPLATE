"use client";

// Column definitions for Asset Movement Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetMovementItem } from "../types/asset-movement-item.js";

export const assetMovementItemColumns: ColumnDef<AssetMovementItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "asset",
    header: "Asset",
  },
  {
    accessorKey: "source_location",
    header: "Source Location",
  },
  {
    accessorKey: "from_employee",
    header: "From Employee",
  },
  {
    accessorKey: "target_location",
    header: "Target Location",
  },
  {
    accessorKey: "to_employee",
    header: "To Employee",
  },
];