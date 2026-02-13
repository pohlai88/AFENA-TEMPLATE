"use client";

// Column definitions for Authorization Rule
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AuthorizationRule } from "../types/authorization-rule.js";

export const authorizationRuleColumns: ColumnDef<AuthorizationRule>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "transaction",
    header: "Transaction",
  },
  {
    accessorKey: "based_on",
    header: "Based On",
  },
  {
    accessorKey: "master_name",
    header: "Customer / Item / Item Group",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "system_role",
    header: "Applicable To (Role)",
  },
];