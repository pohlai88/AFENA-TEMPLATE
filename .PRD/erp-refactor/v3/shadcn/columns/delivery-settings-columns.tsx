"use client";

// Column definitions for Delivery Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { DeliverySettings } from "../types/delivery-settings.js";

export const deliverySettingsColumns: ColumnDef<DeliverySettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "dispatch_template",
    header: "Dispatch Notification Template",
  },
  {
    accessorKey: "dispatch_attachment",
    header: "Dispatch Notification Attachment",
  },
  {
    accessorKey: "send_with_attachment",
    header: "Send with Attachment",
    cell: ({ row }) => row.getValue("send_with_attachment") ? "Yes" : "No",
  },
  {
    accessorKey: "stop_delay",
    header: "Delay between Delivery Stops",
  },
];