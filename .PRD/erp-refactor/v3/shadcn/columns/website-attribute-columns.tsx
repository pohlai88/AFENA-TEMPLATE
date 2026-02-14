"use client";

// Column definitions for Website Attribute
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { WebsiteAttribute } from "../types/website-attribute.js";

export const websiteAttributeColumns: ColumnDef<WebsiteAttribute>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "attribute",
    header: "Attribute",
  },
];