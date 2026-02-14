"use client";

// Form for POS Payment Method
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PosPaymentMethod } from "../types/pos-payment-method.js";
import { PosPaymentMethodInsertSchema } from "../types/pos-payment-method.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface PosPaymentMethodFormProps {
  initialData?: Partial<PosPaymentMethod>;
  onSubmit: (data: Partial<PosPaymentMethod>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PosPaymentMethodForm({ initialData = {}, onSubmit, mode, isLoading }: PosPaymentMethodFormProps) {
  const form = useForm<Partial<PosPaymentMethod>>({
    resolver: zodResolver(PosPaymentMethodInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "POS Payment Method" : "New POS Payment Method"}
        </h2>
            {parent.doctype === 'POS Profile' && (
            <FormField control={form.control} name="default" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Default</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="allow_in_returns" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allow In Returns</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="mode_of_payment" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Mode of Payment (→ Mode of Payment)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Mode of Payment..." {...f} value={(f.value as string) ?? ""} />
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