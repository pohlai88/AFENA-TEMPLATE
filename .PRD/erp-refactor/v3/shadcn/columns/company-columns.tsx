"use client";

// Column definitions for Company
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Company } from "../types/company.js";

export const companyColumns: ColumnDef<Company>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "parent_company",
    header: "Parent Company",
  },
  {
    accessorKey: "accounts_frozen_till_date",
    header: "Accounts Frozen Till Date",
    cell: ({ row }) => {
      const val = row.getValue("accounts_frozen_till_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "role_allowed_for_frozen_entries",
    header: "Roles Allowed to Set and Edit Frozen Account Entries",
  },
];