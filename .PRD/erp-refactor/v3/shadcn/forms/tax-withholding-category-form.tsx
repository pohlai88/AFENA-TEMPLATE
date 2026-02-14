"use client";

// Form for Tax Withholding Category
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TaxWithholdingCategory } from "../types/tax-withholding-category.js";
import { TaxWithholdingCategoryInsertSchema } from "../types/tax-withholding-category.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaxWithholdingCategoryFormProps {
  initialData?: Partial<TaxWithholdingCategory>;
  onSubmit: (data: Partial<TaxWithholdingCategory>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function TaxWithholdingCategoryForm({ initialData = {}, onSubmit, mode, isLoading }: TaxWithholdingCategoryFormProps) {
  const form = useForm<Partial<TaxWithholdingCategory>>({
    resolver: zodResolver(TaxWithholdingCategoryInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Tax Withholding Category" : "New Tax Withholding Category"}
        </h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="category_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Category Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tax_deduction_basis" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Deduct Tax On Basis</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Gross Total">Gross Total</SelectItem>
                    <SelectItem value="Net Total">Net Total</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="round_off_tax_amount" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Round Off Tax Amount</FormLabel>
                  <FormDescription>Checking this will round off the tax amount to the nearest integer</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="tax_on_excess_amount" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Only Deduct Tax On Excess Amount </FormLabel>
                  <FormDescription>Tax withheld only for amount exceeding cumulative threshold</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="disable_cumulative_threshold" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disable Cumulative Threshold</FormLabel>
                  <FormDescription>When checked, only transaction threshold will be applied for transaction individually</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="disable_transaction_threshold" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disable Transaction Threshold</FormLabel>
                  <FormDescription>When checked, only cumulative threshold will be applied</FormDescription>
                </div>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tax Withholding Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Rates</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Tax Withholding Rate — integrate with DataTable */}
                <p>Child table for Tax Withholding Rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Accounts</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Tax Withholding Account — integrate with DataTable */}
                <p>Child table for Tax Withholding Account</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}