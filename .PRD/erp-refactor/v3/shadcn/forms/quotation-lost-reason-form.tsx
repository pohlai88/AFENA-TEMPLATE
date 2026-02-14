"use client";

// Form for Quotation Lost Reason
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QuotationLostReason } from "../types/quotation-lost-reason.js";
import { QuotationLostReasonInsertSchema } from "../types/quotation-lost-reason.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface QuotationLostReasonFormProps {
  initialData?: Partial<QuotationLostReason>;
  onSubmit: (data: Partial<QuotationLostReason>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QuotationLostReasonForm({ initialData = {}, onSubmit, mode, isLoading }: QuotationLostReasonFormProps) {
  const form = useForm<Partial<QuotationLostReason>>({
    resolver: zodResolver(QuotationLostReasonInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quotation Lost Reason" : "New Quotation Lost Reason"}
        </h2>
            <FormField control={form.control} name="order_lost_reason" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Quotation Lost Reason</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
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