"use client";

// Form for Bank Account Subtype
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BankAccountSubtype } from "../types/bank-account-subtype.js";
import { BankAccountSubtypeInsertSchema } from "../types/bank-account-subtype.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface BankAccountSubtypeFormProps {
  initialData?: Partial<BankAccountSubtype>;
  onSubmit: (data: Partial<BankAccountSubtype>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BankAccountSubtypeForm({ initialData = {}, onSubmit, mode, isLoading }: BankAccountSubtypeFormProps) {
  const form = useForm<Partial<BankAccountSubtype>>({
    resolver: zodResolver(BankAccountSubtypeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Bank Account Subtype" : "New Bank Account Subtype"}
        </h2>
            <FormField control={form.control} name="account_subtype" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account Subtype</FormLabel>
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