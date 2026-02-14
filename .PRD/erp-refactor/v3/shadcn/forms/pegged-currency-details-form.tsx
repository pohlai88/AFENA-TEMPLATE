"use client";

// Form for Pegged Currency Details
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PeggedCurrencyDetails } from "../types/pegged-currency-details.js";
import { PeggedCurrencyDetailsInsertSchema } from "../types/pegged-currency-details.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PeggedCurrencyDetailsFormProps {
  initialData?: Partial<PeggedCurrencyDetails>;
  onSubmit: (data: Partial<PeggedCurrencyDetails>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PeggedCurrencyDetailsForm({ initialData = {}, onSubmit, mode, isLoading }: PeggedCurrencyDetailsFormProps) {
  const form = useForm<Partial<PeggedCurrencyDetails>>({
    resolver: zodResolver(PeggedCurrencyDetailsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Pegged Currency Details" : "New Pegged Currency Details"}
        </h2>
            <FormField control={form.control} name="source_currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="pegged_against" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Pegged Against (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="pegged_exchange_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Exchange Rate</FormLabel>
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