"use client";

// Column definitions for Contract Template
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ContractTemplate } from "../types/contract-template.js";

export const contractTemplateColumns: ColumnDef<ContractTemplate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "contract_terms",
    header: "Contract Terms and Conditions",
  },
  {
    accessorKey: "requires_fulfilment",
    header: "Requires Fulfilment",
    cell: ({ row }) => row.getValue("requires_fulfilment") ? "Yes" : "No",
  },
  {
    accessorKey: "contract_template_help",
    header: "Contract Template Help",
  },
];