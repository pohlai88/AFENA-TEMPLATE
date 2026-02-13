"use client";

// Column definitions for Service Level Agreement
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ServiceLevelAgreement } from "../types/service-level-agreement.js";

export const serviceLevelAgreementColumns: ColumnDef<ServiceLevelAgreement>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "service_level",
    header: "Service Level Name",
  },
  {
    accessorKey: "entity",
    header: "Entity",
  },
];