"use client";

// Form for Subscription Plan
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubscriptionPlan } from "../types/subscription-plan.js";
import { SubscriptionPlanInsertSchema } from "../types/subscription-plan.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubscriptionPlanFormProps {
  initialData?: Partial<SubscriptionPlan>;
  onSubmit: (data: Partial<SubscriptionPlan>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SubscriptionPlanForm({ initialData = {}, onSubmit, mode, isLoading }: SubscriptionPlanFormProps) {
  const form = useForm<Partial<SubscriptionPlan>>({
    resolver: zodResolver(SubscriptionPlanInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Subscription Plan" : "New Subscription Plan"}
        </h2>
            <FormField control={form.control} name="plan_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Plan Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="currency" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Currency (→ Currency)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Currency..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="item" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="price_determination" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Subscription Price Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Fixed Rate">Fixed Rate</SelectItem>
                    <SelectItem value="Based On Price List">Based On Price List</SelectItem>
                    <SelectItem value="Monthly Rate">Monthly Rate</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {['Fixed Rate', 'Monthly Rate'].includes(form.getValues().price_determination) && (
            <FormField control={form.control} name="cost" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Cost</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().price_determination==="Based On Price List" && (
            <FormField control={form.control} name="price_list" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Price List (→ Price List)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Price List..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="billing_interval" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Billing Interval</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Week">Week</SelectItem>
                    <SelectItem value="Month">Month</SelectItem>
                    <SelectItem value="Year">Year</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="billing_interval_count" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Billing Interval Count</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Number of intervals for the interval field e.g if Interval is 'Days' and Billing Interval Count is 3, invoices will be generated every 3 days</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="product_price_id" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Product Price ID</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="payment_gateway" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Gateway (→ Payment Gateway Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Payment Gateway Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accounting Dimensions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="cost_center" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Cost Center (→ Cost Center)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Cost Center..." {...f} value={(f.value as string) ?? ""} />
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
        </div>
      </form>
    </Form>
  );
}