"use client";

// Form for Currency Exchange Settings Result
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CurrencyExchangeSettingsResult } from "../types/currency-exchange-settings-result.js";
import { CurrencyExchangeSettingsResultInsertSchema } from "../types/currency-exchange-settings-result.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CurrencyExchangeSettingsResultFormProps {
  initialData?: Partial<CurrencyExchangeSettingsResult>;
  onSubmit: (data: Partial<CurrencyExchangeSettingsResult>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CurrencyExchangeSettingsResultForm({ initialData = {}, onSubmit, mode, isLoading }: CurrencyExchangeSettingsResultFormProps) {
  const form = useForm<Partial<CurrencyExchangeSettingsResult>>({
    resolver: zodResolver(CurrencyExchangeSettingsResultInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Currency Exchange Settings Result" : "New Currency Exchange Settings Result"}
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

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}