"use client";

// Form for Account Category
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AccountCategory } from "../types/account-category.js";
import { AccountCategoryInsertSchema } from "../types/account-category.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AccountCategoryFormProps {
  initialData?: Partial<AccountCategory>;
  onSubmit: (data: Partial<AccountCategory>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AccountCategoryForm({ initialData = {}, onSubmit, mode, isLoading }: AccountCategoryFormProps) {
  const form = useForm<Partial<AccountCategory>>({
    resolver: zodResolver(AccountCategoryInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Account Category" : "New Account Category"}
        </h2>
            <FormField control={form.control} name="account_category_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account Category Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Description</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
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