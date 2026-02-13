"use client";

// Column definitions for Customs Tariff Number
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CustomsTariffNumber } from "../types/customs-tariff-number.js";

export const customsTariffNumberColumns: ColumnDef<CustomsTariffNumber>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "tariff_number",
    header: "Tariff Number",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];