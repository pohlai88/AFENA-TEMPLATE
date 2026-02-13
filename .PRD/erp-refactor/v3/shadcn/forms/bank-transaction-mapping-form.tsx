"use client";

// Form for Bank Transaction Mapping
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BankTransactionMapping } from "../types/bank-transaction-mapping.js";
import { BankTransactionMappingInsertSchema } from "../types/bank-transaction-mapping.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface BankTransactionMappingFormProps {
  initialData?: Partial<BankTransactionMapping>;
  onSubmit: (data: Partial<BankTransactionMapping>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BankTransactionMappingForm({ initialData = {}, onSubmit, mode, isLoading }: BankTransactionMappingFormProps) {
  const form = useForm<Partial<BankTransactionMapping>>({
    resolver: zodResolver(BankTransactionMappingInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Bank Transaction Mapping" : "New Bank Transaction Mapping"}
        </h2>
            <FormField control={form.control} name="bank_transaction_field" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Field in Bank Transaction</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="file_field" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Column in Bank File</FormLabel>
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