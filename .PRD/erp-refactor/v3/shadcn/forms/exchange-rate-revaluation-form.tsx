"use client";

// Form for Exchange Rate Revaluation
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ExchangeRateRevaluation } from "../types/exchange-rate-revaluation.js";
import { ExchangeRateRevaluationInsertSchema } from "../types/exchange-rate-revaluation.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExchangeRateRevaluationFormProps {
  initialData?: Partial<ExchangeRateRevaluation>;
  onSubmit: (data: Partial<ExchangeRateRevaluation>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ExchangeRateRevaluationForm({ initialData = {}, onSubmit, mode, isLoading }: ExchangeRateRevaluationFormProps) {
  const form = useForm<Partial<ExchangeRateRevaluation>>({
    resolver: zodResolver(ExchangeRateRevaluationInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Exchange Rate Revaluation" : "New Exchange Rate Revaluation"}
        </h2>
            <FormField control={form.control} name="posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="rounding_loss_allowance" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rounding Loss Allowance</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Only values between [0,1) are allowed. Like {0.00, 0.04, 0.09, ...}
Ex: If allowance is set at 0.07, accounts that have balance of 0.07 in either of the currencies will be considered as zero balance account</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Exchange Rate Revaluation Account</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Exchange Rate Revaluation Account — integrate with DataTable */}
                <p>Child table for Exchange Rate Revaluation Account</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="gain_loss_unbooked" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Gain/Loss from Revaluation</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="gain_loss_booked" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Gain/Loss already booked</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormDescription>Gain/Loss accumulated in foreign currency account. Accounts with '0' balance in either Base or Account currency</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_gain_loss" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Gain/Loss</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Exchange Rate Revaluation)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Exchange Rate Revaluation..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
          {mode === "edit" && (initialData as any)?.docstatus === 0 && (
            <Button type="button" variant="outline" disabled={isLoading}>
              Submit
            </Button>
          )}
          {mode === "edit" && (initialData as any)?.docstatus === 1 && (
            <Button type="button" variant="destructive" disabled={isLoading}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}