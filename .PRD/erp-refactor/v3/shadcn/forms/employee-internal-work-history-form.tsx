"use client";

// Form for Employee Internal Work History
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EmployeeInternalWorkHistory } from "../types/employee-internal-work-history.js";
import { EmployeeInternalWorkHistoryInsertSchema } from "../types/employee-internal-work-history.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EmployeeInternalWorkHistoryFormProps {
  initialData?: Partial<EmployeeInternalWorkHistory>;
  onSubmit: (data: Partial<EmployeeInternalWorkHistory>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function EmployeeInternalWorkHistoryForm({ initialData = {}, onSubmit, mode, isLoading }: EmployeeInternalWorkHistoryFormProps) {
  const form = useForm<Partial<EmployeeInternalWorkHistory>>({
    resolver: zodResolver(EmployeeInternalWorkHistoryInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Employee Internal Work History" : "New Employee Internal Work History"}
        </h2>
            <FormField control={form.control} name="branch" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Branch (→ Branch)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Branch..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="department" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Department (→ Department)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Department..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="designation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Designation (→ Designation)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Designation..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="from_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
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