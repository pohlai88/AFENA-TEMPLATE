"use client";

// Column definitions for Process Statement Of Accounts Customer
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProcessStatementOfAccountsCustomer } from "../types/process-statement-of-accounts-customer.js";

export const processStatementOfAccountsCustomerColumns: ColumnDef<ProcessStatementOfAccountsCustomer>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "billing_email",
    header: "Billing Email",
  },
  {
    accessorKey: "primary_email",
    header: "Primary Contact Email",
  },
];