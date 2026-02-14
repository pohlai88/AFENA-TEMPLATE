"use client";

// Column definitions for Mode of Payment
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ModeOfPayment } from "../types/mode-of-payment.js";

export const modeOfPaymentColumns: ColumnDef<ModeOfPayment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "mode_of_payment",
    header: "Mode of Payment",
  },
];