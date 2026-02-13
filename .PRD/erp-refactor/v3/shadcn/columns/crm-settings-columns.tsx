"use client";

// Column definitions for CRM Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CrmSettings } from "../types/crm-settings.js";

export const crmSettingsColumns: ColumnDef<CrmSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "campaign_naming_by",
    header: "Campaign Naming By",
  },
];