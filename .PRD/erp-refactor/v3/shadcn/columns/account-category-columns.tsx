"use client";

// Column definitions for Account Category
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AccountCategory } from "../types/account-category.js";

export const accountCategoryColumns: ColumnDef<AccountCategory>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account_category_name",
    header: "Account Category Name",
  },
];