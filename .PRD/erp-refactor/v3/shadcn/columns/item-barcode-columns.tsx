"use client";

// Column definitions for Item Barcode
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemBarcode } from "../types/item-barcode.js";

export const itemBarcodeColumns: ColumnDef<ItemBarcode>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "barcode",
    header: "Barcode",
  },
  {
    accessorKey: "barcode_type",
    header: "Barcode Type",
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },
];