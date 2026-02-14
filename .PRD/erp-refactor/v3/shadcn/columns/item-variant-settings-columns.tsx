"use client";

// Column definitions for Item Variant Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemVariantSettings } from "../types/item-variant-settings.js";

export const itemVariantSettingsColumns: ColumnDef<ItemVariantSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "do_not_update_variants",
    header: "Do not update variants on save",
    cell: ({ row }) => row.getValue("do_not_update_variants") ? "Yes" : "No",
  },
  {
    accessorKey: "allow_rename_attribute_value",
    header: "Allow Rename Attribute Value",
    cell: ({ row }) => row.getValue("allow_rename_attribute_value") ? "Yes" : "No",
  },
  {
    accessorKey: "allow_different_uom",
    header: "Allow Variant UOM to be different from Template UOM",
    cell: ({ row }) => row.getValue("allow_different_uom") ? "Yes" : "No",
  },
];