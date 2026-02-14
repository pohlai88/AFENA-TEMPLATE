"use client";

// Column definitions for Campaign Email Schedule
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CampaignEmailSchedule } from "../types/campaign-email-schedule.js";

export const campaignEmailScheduleColumns: ColumnDef<CampaignEmailSchedule>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email_template",
    header: "Email Template",
  },
  {
    accessorKey: "send_after_days",
    header: "Send After (days)",
  },
];