"use client";

// Column definitions for Contract Template Fulfilment Terms
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ContractTemplateFulfilmentTerms } from "../types/contract-template-fulfilment-terms.js";

export const contractTemplateFulfilmentTermsColumns: ColumnDef<ContractTemplateFulfilmentTerms>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "requirement",
    header: "Requirement",
  },
];