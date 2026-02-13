"use client";

// Form for Coupon Code
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CouponCode } from "../types/coupon-code.js";
import { CouponCodeInsertSchema } from "../types/coupon-code.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CouponCodeFormProps {
  initialData?: Partial<CouponCode>;
  onSubmit: (data: Partial<CouponCode>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CouponCodeForm({ initialData = {}, onSubmit, mode, isLoading }: CouponCodeFormProps) {
  const form = useForm<Partial<CouponCode>>({
    resolver: zodResolver(CouponCodeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.coupon_name as string) ?? "Coupon Code" : "New Coupon Code"}
          </h2>
        </div>
            <FormField control={form.control} name="coupon_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Coupon Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>e.g. &quot;Summer Holiday 2019 Offer 20&quot;</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="coupon_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Coupon Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Promotional">Promotional</SelectItem>
                    <SelectItem value="Gift Card">Gift Card</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().coupon_type === "Gift Card" && (
            <FormField control={form.control} name="customer" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer (→ Customer)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="coupon_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Coupon Code</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>unique e.g. SAVE20  To be used to get discount</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="from_external_ecomm_platform" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">From External Ecomm Platform</FormLabel>
                </div>
              </FormItem>
            )} />
            {!form.getValues().from_external_ecomm_platform && (
            <FormField control={form.control} name="pricing_rule" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Pricing Rule (→ Pricing Rule)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Pricing Rule..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Validity and Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="valid_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Valid From</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="valid_upto" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Valid Up To</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().coupon_type === "Promotional" && (
            <FormField control={form.control} name="maximum_use" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Maximum Use</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="used" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Used</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Coupon Description</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Coupon Code)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Coupon Code..." {...f} value={(f.value as string) ?? ""} disabled />
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