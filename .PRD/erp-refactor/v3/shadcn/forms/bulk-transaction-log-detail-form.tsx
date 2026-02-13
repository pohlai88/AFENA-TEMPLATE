"use client";

// Form for Bulk Transaction Log Detail
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BulkTransactionLogDetail } from "../types/bulk-transaction-log-detail.js";
import { BulkTransactionLogDetailInsertSchema } from "../types/bulk-transaction-log-detail.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BulkTransactionLogDetailFormProps {
  initialData?: Partial<BulkTransactionLogDetail>;
  onSubmit: (data: Partial<BulkTransactionLogDetail>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BulkTransactionLogDetailForm({ initialData = {}, onSubmit, mode, isLoading }: BulkTransactionLogDetailFormProps) {
  const form = useForm<Partial<BulkTransactionLogDetail>>({
    resolver: zodResolver(BulkTransactionLogDetailInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Bulk Transaction Log Detail" : "New Bulk Transaction Log Detail"}
        </h2>
            <FormField control={form.control} name="from_doctype" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Doctype (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="transaction_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Date </FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Time</FormLabel>
                <FormControl>
                  <Input type="time" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="transaction_status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Status</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="error_description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Error Description</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_doctype" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Doctype (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="retried" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Retried</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} disabled />
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