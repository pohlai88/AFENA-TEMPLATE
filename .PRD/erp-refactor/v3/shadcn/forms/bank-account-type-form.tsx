"use client";

// Form for Bank Account Type
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BankAccountType } from "../types/bank-account-type.js";
import { BankAccountTypeInsertSchema } from "../types/bank-account-type.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface BankAccountTypeFormProps {
  initialData?: Partial<BankAccountType>;
  onSubmit: (data: Partial<BankAccountType>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BankAccountTypeForm({ initialData = {}, onSubmit, mode, isLoading }: BankAccountTypeFormProps) {
  const form = useForm<Partial<BankAccountType>>({
    resolver: zodResolver(BankAccountTypeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Bank Account Type" : "New Bank Account Type"}
        </h2>
            <FormField control={form.control} name="account_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account Type</FormLabel>
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