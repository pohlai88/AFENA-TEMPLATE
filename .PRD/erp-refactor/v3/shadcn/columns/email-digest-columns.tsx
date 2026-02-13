"use client";

// Column definitions for Email Digest
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { EmailDigest } from "../types/email-digest.js";

export const emailDigestColumns: ColumnDef<EmailDigest>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
    cell: ({ row }) => row.getValue("enabled") ? "Yes" : "No",
  },
  {
    accessorKey: "company",
    header: "For Company",
  },
  {
    accessorKey: "frequency",
    header: "How frequently?",
  },
];