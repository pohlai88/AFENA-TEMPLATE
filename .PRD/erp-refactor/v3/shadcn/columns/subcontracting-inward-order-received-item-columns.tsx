"use client";

// Column definitions for Subcontracting Inward Order Received Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubcontractingInwardOrderReceivedItem } from "../types/subcontracting-inward-order-received-item.js";

export const subcontractingInwardOrderReceivedItemColumns: ColumnDef<SubcontractingInwardOrderReceivedItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "main_item_code",
    header: "Item Code",
  },
  {
    accessorKey: "rm_item_code",
    header: "Raw Material Item Code",
  },
  {
    accessorKey: "required_qty",
    header: "Required Qty",
  },
  {
    accessorKey: "received_qty",
    header: "Received Qty",
  },
];