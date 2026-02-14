"use client";

// Form for UAE VAT Account
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UaeVatAccount } from "../types/uae-vat-account.js";
import { UaeVatAccountInsertSchema } from "../types/uae-vat-account.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface UaeVatAccountFormProps {
  initialData?: Partial<UaeVatAccount>;
  onSubmit: (data: Partial<UaeVatAccount>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function UaeVatAccountForm({ initialData = {}, onSubmit, mode, isLoading }: UaeVatAccountFormProps) {
  const form = useForm<Partial<UaeVatAccount>>({
    resolver: zodResolver(UaeVatAccountInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "UAE VAT Account" : "New UAE VAT Account"}
        </h2>
            <FormField control={form.control} name="account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
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