"use client";

// Form for Transaction Deletion Record Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TransactionDeletionRecordItem } from "../types/transaction-deletion-record-item.js";
import { TransactionDeletionRecordItemInsertSchema } from "../types/transaction-deletion-record-item.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TransactionDeletionRecordItemFormProps {
  initialData?: Partial<TransactionDeletionRecordItem>;
  onSubmit: (data: Partial<TransactionDeletionRecordItem>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function TransactionDeletionRecordItemForm({ initialData = {}, onSubmit, mode, isLoading }: TransactionDeletionRecordItemFormProps) {
  const form = useForm<Partial<TransactionDeletionRecordItem>>({
    resolver: zodResolver(TransactionDeletionRecordItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Transaction Deletion Record Item" : "New Transaction Deletion Record Item"}
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

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}