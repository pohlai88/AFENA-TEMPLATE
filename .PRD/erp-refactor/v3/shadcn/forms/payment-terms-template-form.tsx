"use client";

// Form for Payment Terms Template
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PaymentTermsTemplate } from "../types/payment-terms-template.js";
import { PaymentTermsTemplateInsertSchema } from "../types/payment-terms-template.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface PaymentTermsTemplateFormProps {
  initialData?: Partial<PaymentTermsTemplate>;
  onSubmit: (data: Partial<PaymentTermsTemplate>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PaymentTermsTemplateForm({ initialData = {}, onSubmit, mode, isLoading }: PaymentTermsTemplateFormProps) {
  const form = useForm<Partial<PaymentTermsTemplate>>({
    resolver: zodResolver(PaymentTermsTemplateInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Payment Terms Template" : "New Payment Terms Template"}
        </h2>
            <FormField control={form.control} name="template_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Template Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="allocate_payment_based_on_payment_terms" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allocate Payment Based On Payment Terms</FormLabel>
                  <FormDescription>If this checkbox is checked, paid amount will be splitted and allocated as per the amounts in payment schedule against each payment term</FormDescription>
                </div>
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Payment Terms</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Payment Terms Template Detail — integrate with DataTable */}
                <p>Child table for Payment Terms Template Detail</p>
              </div>
            </div>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}