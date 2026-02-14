"use client";

// Form for Currency Exchange Settings Details
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CurrencyExchangeSettingsDetails } from "../types/currency-exchange-settings-details.js";
import { CurrencyExchangeSettingsDetailsInsertSchema } from "../types/currency-exchange-settings-details.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CurrencyExchangeSettingsDetailsFormProps {
  initialData?: Partial<CurrencyExchangeSettingsDetails>;
  onSubmit: (data: Partial<CurrencyExchangeSettingsDetails>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CurrencyExchangeSettingsDetailsForm({ initialData = {}, onSubmit, mode, isLoading }: CurrencyExchangeSettingsDetailsFormProps) {
  const form = useForm<Partial<CurrencyExchangeSettingsDetails>>({
    resolver: zodResolver(CurrencyExchangeSettingsDetailsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Currency Exchange Settings Details" : "New Currency Exchange Settings Details"}
        </h2>
            <FormField control={form.control} name="key" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Key</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Value</FormLabel>
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