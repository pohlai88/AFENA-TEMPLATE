"use client";

// Column definitions for Quotation Lost Reason
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QuotationLostReason } from "../types/quotation-lost-reason.js";

export const quotationLostReasonColumns: ColumnDef<QuotationLostReason>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "order_lost_reason",
    header: "Quotation Lost Reason",
  },
];