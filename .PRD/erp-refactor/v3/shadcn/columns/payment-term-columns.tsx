"use client";

// Column definitions for Payment Term
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentTerm } from "../types/payment-term.js";

export const paymentTermColumns: ColumnDef<PaymentTerm>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "payment_term_name",
    header: "Payment Term Name",
  },
  {
    accessorKey: "invoice_portion",
    header: "Invoice Portion (%)",
  },
  {
    accessorKey: "mode_of_payment",
    header: "Mode of Payment",
  },
  {
    accessorKey: "due_date_based_on",
    header: "Due Date Based On",
  },
  {
    accessorKey: "credit_days",
    header: "Credit Days",
  },
];