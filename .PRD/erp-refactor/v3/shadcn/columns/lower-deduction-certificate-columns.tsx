"use client";

// Column definitions for Lower Deduction Certificate
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LowerDeductionCertificate } from "../types/lower-deduction-certificate.js";

export const lowerDeductionCertificateColumns: ColumnDef<LowerDeductionCertificate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "certificate_no",
    header: "Certificate No",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "pan_no",
    header: "PAN No",
  },
  {
    accessorKey: "valid_from",
    header: "Valid From",
    cell: ({ row }) => {
      const val = row.getValue("valid_from") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];