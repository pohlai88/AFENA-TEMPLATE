"use client";

// Column definitions for Payment Terms Template
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentTermsTemplate } from "../types/payment-terms-template.js";

export const paymentTermsTemplateColumns: ColumnDef<PaymentTermsTemplate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "template_name",
    header: "Template Name",
  },
  {
    accessorKey: "allocate_payment_based_on_payment_terms",
    header: "Allocate Payment Based On Payment Terms",
    cell: ({ row }) => row.getValue("allocate_payment_based_on_payment_terms") ? "Yes" : "No",
  },
];