"use client";

// Form for Loyalty Point Entry Redemption
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoyaltyPointEntryRedemption } from "../types/loyalty-point-entry-redemption.js";
import { LoyaltyPointEntryRedemptionInsertSchema } from "../types/loyalty-point-entry-redemption.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface LoyaltyPointEntryRedemptionFormProps {
  initialData?: Partial<LoyaltyPointEntryRedemption>;
  onSubmit: (data: Partial<LoyaltyPointEntryRedemption>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function LoyaltyPointEntryRedemptionForm({ initialData = {}, onSubmit, mode, isLoading }: LoyaltyPointEntryRedemptionFormProps) {
  const form = useForm<Partial<LoyaltyPointEntryRedemption>>({
    resolver: zodResolver(LoyaltyPointEntryRedemptionInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Loyalty Point Entry Redemption" : "New Loyalty Point Entry Redemption"}
        </h2>
            <FormField control={form.control} name="sales_invoice" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Invoice</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="redemption_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Redemption Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="redeemed_points" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Redeemed Points</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
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