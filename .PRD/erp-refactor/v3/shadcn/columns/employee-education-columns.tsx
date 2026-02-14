"use client";

// Column definitions for Employee Education
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { EmployeeEducation } from "../types/employee-education.js";

export const employeeEducationColumns: ColumnDef<EmployeeEducation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "school_univ",
    header: "School/University",
  },
  {
    accessorKey: "qualification",
    header: "Qualification",
  },
  {
    accessorKey: "level",
    header: "Level",
  },
  {
    accessorKey: "year_of_passing",
    header: "Year of Passing",
  },
  {
    accessorKey: "class_per",
    header: "Class / Percentage",
  },
  {
    accessorKey: "maj_opt_subj",
    header: "Major/Optional Subjects",
  },
];