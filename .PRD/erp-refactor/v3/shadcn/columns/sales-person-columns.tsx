"use client";

// Column definitions for Sales Person
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SalesPerson } from "../types/sales-person.js";

export const salesPersonColumns: ColumnDef<SalesPerson>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "sales_person_name",
    header: "Sales Person Name",
  },
  {
    accessorKey: "parent_sales_person",
    header: "Parent Sales Person",
  },
  {
    accessorKey: "is_group",
    header: "Is Group",
    cell: ({ row }) => row.getValue("is_group") ? "Yes" : "No",
  },
];