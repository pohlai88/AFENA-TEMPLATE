"use client";

// Form for Mode of Payment
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ModeOfPayment } from "../types/mode-of-payment.js";
import { ModeOfPaymentInsertSchema } from "../types/mode-of-payment.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ModeOfPaymentFormProps {
  initialData?: Partial<ModeOfPayment>;
  onSubmit: (data: Partial<ModeOfPayment>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ModeOfPaymentForm({ initialData = {}, onSubmit, mode, isLoading }: ModeOfPaymentFormProps) {
  const form = useForm<Partial<ModeOfPayment>>({
    resolver: zodResolver(ModeOfPaymentInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Mode of Payment" : "New Mode of Payment"}
        </h2>
            <FormField control={form.control} name="mode_of_payment" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Mode of Payment</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="enabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enabled</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank">Bank</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Accounts</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Mode of Payment Account — integrate with DataTable */}
                <p>Child table for Mode of Payment Account</p>
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