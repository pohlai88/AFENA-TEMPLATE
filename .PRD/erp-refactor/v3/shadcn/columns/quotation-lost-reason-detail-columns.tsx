"use client";

// Column definitions for Quotation Lost Reason Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QuotationLostReasonDetail } from "../types/quotation-lost-reason-detail.js";

export const quotationLostReasonDetailColumns: ColumnDef<QuotationLostReasonDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "lost_reason",
    header: "Quotation Lost Reason",
  },
];