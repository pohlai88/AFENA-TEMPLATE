"use client";

// Form for Transaction Deletion Record Details
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TransactionDeletionRecordDetails } from "../types/transaction-deletion-record-details.js";
import { TransactionDeletionRecordDetailsInsertSchema } from "../types/transaction-deletion-record-details.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface TransactionDeletionRecordDetailsFormProps {
  initialData?: Partial<TransactionDeletionRecordDetails>;
  onSubmit: (data: Partial<TransactionDeletionRecordDetails>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function TransactionDeletionRecordDetailsForm({ initialData = {}, onSubmit, mode, isLoading }: TransactionDeletionRecordDetailsFormProps) {
  const form = useForm<Partial<TransactionDeletionRecordDetails>>({
    resolver: zodResolver(TransactionDeletionRecordDetailsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Transaction Deletion Record Details" : "New Transaction Deletion Record Details"}
        </h2>
            <FormField control={form.control} name="doctype_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">DocType (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="docfield_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">DocField</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="no_of_docs" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">No of Docs</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="done" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Done</FormLabel>
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