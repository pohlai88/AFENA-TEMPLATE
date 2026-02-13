"use client";

// Form for Applicable On Account
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApplicableOnAccount } from "../types/applicable-on-account.js";
import { ApplicableOnAccountInsertSchema } from "../types/applicable-on-account.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ApplicableOnAccountFormProps {
  initialData?: Partial<ApplicableOnAccount>;
  onSubmit: (data: Partial<ApplicableOnAccount>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ApplicableOnAccountForm({ initialData = {}, onSubmit, mode, isLoading }: ApplicableOnAccountFormProps) {
  const form = useForm<Partial<ApplicableOnAccount>>({
    resolver: zodResolver(ApplicableOnAccountInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Applicable On Account" : "New Applicable On Account"}
        </h2>
            <FormField control={form.control} name="applicable_on_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Accounts (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_mandatory" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Mandatory</FormLabel>
                </div>
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