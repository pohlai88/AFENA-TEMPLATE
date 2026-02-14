"use client";

// Form for Purchase Taxes and Charges Template
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PurchaseTaxesAndChargesTemplate } from "../types/purchase-taxes-and-charges-template.js";
import { PurchaseTaxesAndChargesTemplateInsertSchema } from "../types/purchase-taxes-and-charges-template.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PurchaseTaxesAndChargesTemplateFormProps {
  initialData?: Partial<PurchaseTaxesAndChargesTemplate>;
  onSubmit: (data: Partial<PurchaseTaxesAndChargesTemplate>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PurchaseTaxesAndChargesTemplateForm({ initialData = {}, onSubmit, mode, isLoading }: PurchaseTaxesAndChargesTemplateFormProps) {
  const form = useForm<Partial<PurchaseTaxesAndChargesTemplate>>({
    resolver: zodResolver(PurchaseTaxesAndChargesTemplateInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.title as string) ?? "Purchase Taxes and Charges Template" : "New Purchase Taxes and Charges Template"}
          </h2>
        </div>
            <FormField control={form.control} name="title" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Title</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_default" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Default</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="disabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disabled</FormLabel>
                </div>
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
            <FormField control={form.control} name="tax_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Category (→ Tax Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Tax Category..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Purchase Taxes and Charges</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Purchase Taxes and Charges — integrate with DataTable */}
                <p>Child table for Purchase Taxes and Charges</p>
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