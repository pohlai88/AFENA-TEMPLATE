"use client";

// Column definitions for Shipment Parcel Template
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ShipmentParcelTemplate } from "../types/shipment-parcel-template.js";

export const shipmentParcelTemplateColumns: ColumnDef<ShipmentParcelTemplate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "parcel_template_name",
    header: "Parcel Template Name",
  },
  {
    accessorKey: "length",
    header: "Length (cm)",
  },
  {
    accessorKey: "width",
    header: "Width (cm)",
  },
  {
    accessorKey: "height",
    header: "Height (cm)",
  },
  {
    accessorKey: "weight",
    header: "Weight (kg)",
  },
];