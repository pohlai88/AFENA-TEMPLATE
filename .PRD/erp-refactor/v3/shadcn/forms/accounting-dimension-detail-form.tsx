"use client";

// Form for Accounting Dimension Detail
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AccountingDimensionDetail } from "../types/accounting-dimension-detail.js";
import { AccountingDimensionDetailInsertSchema } from "../types/accounting-dimension-detail.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface AccountingDimensionDetailFormProps {
  initialData?: Partial<AccountingDimensionDetail>;
  onSubmit: (data: Partial<AccountingDimensionDetail>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AccountingDimensionDetailForm({ initialData = {}, onSubmit, mode, isLoading }: AccountingDimensionDetailFormProps) {
  const form = useForm<Partial<AccountingDimensionDetail>>({
    resolver: zodResolver(AccountingDimensionDetailInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Accounting Dimension Detail" : "New Accounting Dimension Detail"}
        </h2>
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_dimension" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Dimension</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mandatory_for_bs" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Mandatory For Balance Sheet</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="mandatory_for_pl" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Mandatory For Profit and Loss Account</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="automatically_post_balancing_accounting_entry" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Automatically post balancing accounting entry</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="offsetting_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Offsetting Account (→ Account)</FormLabel>
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