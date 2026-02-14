"use client";

// Form for Transaction Deletion Record To Delete
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TransactionDeletionRecordToDelete } from "../types/transaction-deletion-record-to-delete.js";
import { TransactionDeletionRecordToDeleteInsertSchema } from "../types/transaction-deletion-record-to-delete.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface TransactionDeletionRecordToDeleteFormProps {
  initialData?: Partial<TransactionDeletionRecordToDelete>;
  onSubmit: (data: Partial<TransactionDeletionRecordToDelete>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function TransactionDeletionRecordToDeleteForm({ initialData = {}, onSubmit, mode, isLoading }: TransactionDeletionRecordToDeleteFormProps) {
  const form = useForm<Partial<TransactionDeletionRecordToDelete>>({
    resolver: zodResolver(TransactionDeletionRecordToDeleteInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Transaction Deletion Record To Delete" : "New Transaction Deletion Record To Delete"}
        </h2>
            <FormField control={form.control} name="doctype_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">DocType (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="company_field" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company Field</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Company link field name used for filtering (optional - leave empty to delete all records)</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="document_count" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Document Count</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="child_doctypes" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Child DocTypes</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormDescription>Child tables that will also be deleted</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="deleted" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Deleted</FormLabel>
                </div>
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