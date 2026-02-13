"use client";

// Column definitions for Payment Terms Template Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentTermsTemplateDetail } from "../types/payment-terms-template-detail.js";

export const paymentTermsTemplateDetailColumns: ColumnDef<PaymentTermsTemplateDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "payment_term",
    header: "Payment Term",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "invoice_portion",
    header: "Invoice Portion (%)",
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