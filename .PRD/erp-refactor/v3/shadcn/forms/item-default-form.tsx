"use client";

// Form for Item Default
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemDefault } from "../types/item-default.js";
import { ItemDefaultInsertSchema } from "../types/item-default.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ItemDefaultFormProps {
  initialData?: Partial<ItemDefault>;
  onSubmit: (data: Partial<ItemDefault>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemDefaultForm({ initialData = {}, onSubmit, mode, isLoading }: ItemDefaultFormProps) {
  const form = useForm<Partial<ItemDefault>>({
    resolver: zodResolver(ItemDefaultInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Item Default" : "New Item Default"}
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
            <FormField control={form.control} name="default_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_price_list" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Price List (→ Price List)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Price List..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_discount_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Discount Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_inventory_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Inventory Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="inventory_account_currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Inventory Account Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Purchase Defaults</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="buying_cost_center" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Buying Cost Center (→ Cost Center)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Cost Center..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_supplier" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Supplier (→ Supplier)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="expense_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Expense Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_provisional_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Provisional Account (Service) (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="purchase_expense_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Expense Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="purchase_expense_contra_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Expense Contra Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sales Defaults</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="selling_cost_center" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Selling Cost Center (→ Cost Center)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Cost Center..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="income_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Income Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cost of Goods Sold</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="default_cogs_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default COGS Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deferred Accounting Defaults</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {parent.enable_deferred_expense && (
            <FormField control={form.control} name="deferred_expense_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Deferred Expense Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {parent.enable_deferred_revenue && (
            <FormField control={form.control} name="deferred_revenue_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Deferred Revenue Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
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