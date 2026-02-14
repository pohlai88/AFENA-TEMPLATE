"use client";

// Column definitions for Party Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PartyAccount } from "../types/party-account.js";

export const partyAccountColumns: ColumnDef<PartyAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "account",
    header: "Default Account",
  },
];