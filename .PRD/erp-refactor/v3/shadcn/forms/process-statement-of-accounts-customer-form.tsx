"use client";

// Form for Process Statement Of Accounts Customer
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProcessStatementOfAccountsCustomer } from "../types/process-statement-of-accounts-customer.js";
import { ProcessStatementOfAccountsCustomerInsertSchema } from "../types/process-statement-of-accounts-customer.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProcessStatementOfAccountsCustomerFormProps {
  initialData?: Partial<ProcessStatementOfAccountsCustomer>;
  onSubmit: (data: Partial<ProcessStatementOfAccountsCustomer>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProcessStatementOfAccountsCustomerForm({ initialData = {}, onSubmit, mode, isLoading }: ProcessStatementOfAccountsCustomerFormProps) {
  const form = useForm<Partial<ProcessStatementOfAccountsCustomer>>({
    resolver: zodResolver(ProcessStatementOfAccountsCustomerInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Process Statement Of Accounts Customer" : "New Process Statement Of Accounts Customer"}
        </h2>
            <FormField control={form.control} name="customer" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer (→ Customer)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="customer_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="billing_email" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Billing Email</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="primary_email" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Primary Contact Email</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
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