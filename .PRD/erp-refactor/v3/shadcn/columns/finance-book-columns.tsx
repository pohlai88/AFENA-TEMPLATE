"use client";

// Column definitions for Finance Book
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { FinanceBook } from "../types/finance-book.js";

export const financeBookColumns: ColumnDef<FinanceBook>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "finance_book_name",
    header: "Name",
  },
];