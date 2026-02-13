"use client";

// Column definitions for Email Digest Recipient
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { EmailDigestRecipient } from "../types/email-digest-recipient.js";

export const emailDigestRecipientColumns: ColumnDef<EmailDigestRecipient>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "recipient",
    header: "Recipient",
  },
];