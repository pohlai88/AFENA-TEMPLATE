"use client";

// Form for Employee Group Table
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EmployeeGroupTable } from "../types/employee-group-table.js";
import { EmployeeGroupTableInsertSchema } from "../types/employee-group-table.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EmployeeGroupTableFormProps {
  initialData?: Partial<EmployeeGroupTable>;
  onSubmit: (data: Partial<EmployeeGroupTable>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function EmployeeGroupTableForm({ initialData = {}, onSubmit, mode, isLoading }: EmployeeGroupTableFormProps) {
  const form = useForm<Partial<EmployeeGroupTable>>({
    resolver: zodResolver(EmployeeGroupTableInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Employee Group Table" : "New Employee Group Table"}
        </h2>
            <FormField control={form.control} name="employee" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Employee (→ Employee)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Employee..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="employee_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Employee Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="user_id" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">ERPNext User ID</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}