"use client";

// Form for Asset Category Account
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AssetCategoryAccount } from "../types/asset-category-account.js";
import { AssetCategoryAccountInsertSchema } from "../types/asset-category-account.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AssetCategoryAccountFormProps {
  initialData?: Partial<AssetCategoryAccount>;
  onSubmit: (data: Partial<AssetCategoryAccount>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AssetCategoryAccountForm({ initialData = {}, onSubmit, mode, isLoading }: AssetCategoryAccountFormProps) {
  const form = useForm<Partial<AssetCategoryAccount>>({
    resolver: zodResolver(AssetCategoryAccountInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Asset Category Account" : "New Asset Category Account"}
        </h2>
            <FormField control={form.control} name="company_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="fixed_asset_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Fixed Asset Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="accumulated_depreciation_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Accumulated Depreciation Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="depreciation_expense_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Depreciation Expense Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="capital_work_in_progress_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Capital Work In Progress Account (→ Account)</FormLabel>
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