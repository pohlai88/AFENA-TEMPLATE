"use client";

// Form for Currency Exchange
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CurrencyExchange } from "../types/currency-exchange.js";
import { CurrencyExchangeInsertSchema } from "../types/currency-exchange.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface CurrencyExchangeFormProps {
  initialData?: Partial<CurrencyExchange>;
  onSubmit: (data: Partial<CurrencyExchange>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CurrencyExchangeForm({ initialData = {}, onSubmit, mode, isLoading }: CurrencyExchangeFormProps) {
  const form = useForm<Partial<CurrencyExchange>>({
    resolver: zodResolver(CurrencyExchangeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Currency Exchange" : "New Currency Exchange"}
        </h2>
            <FormField control={form.control} name="date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="from_currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="exchange_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Exchange Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="for_buying" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">For Buying</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="for_selling" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">For Selling</FormLabel>
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