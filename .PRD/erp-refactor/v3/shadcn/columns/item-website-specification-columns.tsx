"use client";

// Column definitions for Item Website Specification
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemWebsiteSpecification } from "../types/item-website-specification.js";

export const itemWebsiteSpecificationColumns: ColumnDef<ItemWebsiteSpecification>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];