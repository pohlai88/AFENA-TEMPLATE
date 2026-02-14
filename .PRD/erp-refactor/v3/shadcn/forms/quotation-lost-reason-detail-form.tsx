"use client";

// Form for Quotation Lost Reason Detail
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QuotationLostReasonDetail } from "../types/quotation-lost-reason-detail.js";
import { QuotationLostReasonDetailInsertSchema } from "../types/quotation-lost-reason-detail.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface QuotationLostReasonDetailFormProps {
  initialData?: Partial<QuotationLostReasonDetail>;
  onSubmit: (data: Partial<QuotationLostReasonDetail>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QuotationLostReasonDetailForm({ initialData = {}, onSubmit, mode, isLoading }: QuotationLostReasonDetailFormProps) {
  const form = useForm<Partial<QuotationLostReasonDetail>>({
    resolver: zodResolver(QuotationLostReasonDetailInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quotation Lost Reason Detail" : "New Quotation Lost Reason Detail"}
        </h2>
            <FormField control={form.control} name="lost_reason" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Quotation Lost Reason (→ Quotation Lost Reason)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Quotation Lost Reason..." {...f} value={(f.value as string) ?? ""} />
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