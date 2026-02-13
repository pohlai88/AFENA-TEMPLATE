"use client";

// Column definitions for Common Code
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CommonCode } from "../types/common-code.js";

export const commonCodeColumns: ColumnDef<CommonCode>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "code_list",
    header: "Code List",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "common_code",
    header: "Common Code",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];