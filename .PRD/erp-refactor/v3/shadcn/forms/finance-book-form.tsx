"use client";

// Form for Finance Book
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FinanceBook } from "../types/finance-book.js";
import { FinanceBookInsertSchema } from "../types/finance-book.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FinanceBookFormProps {
  initialData?: Partial<FinanceBook>;
  onSubmit: (data: Partial<FinanceBook>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function FinanceBookForm({ initialData = {}, onSubmit, mode, isLoading }: FinanceBookFormProps) {
  const form = useForm<Partial<FinanceBook>>({
    resolver: zodResolver(FinanceBookInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Finance Book" : "New Finance Book"}
        </h2>
            <FormField control={form.control} name="finance_book_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Name</FormLabel>
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