"use client";

// Form for Employee External Work History
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EmployeeExternalWorkHistory } from "../types/employee-external-work-history.js";
import { EmployeeExternalWorkHistoryInsertSchema } from "../types/employee-external-work-history.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EmployeeExternalWorkHistoryFormProps {
  initialData?: Partial<EmployeeExternalWorkHistory>;
  onSubmit: (data: Partial<EmployeeExternalWorkHistory>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function EmployeeExternalWorkHistoryForm({ initialData = {}, onSubmit, mode, isLoading }: EmployeeExternalWorkHistoryFormProps) {
  const form = useForm<Partial<EmployeeExternalWorkHistory>>({
    resolver: zodResolver(EmployeeExternalWorkHistoryInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Employee External Work History" : "New Employee External Work History"}
        </h2>
            <FormField control={form.control} name="company_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="designation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Designation</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="salary" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Salary</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Address</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Contact</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_experience" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Experience</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
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