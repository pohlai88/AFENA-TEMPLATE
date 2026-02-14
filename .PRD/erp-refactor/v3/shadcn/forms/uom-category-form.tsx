"use client";

// Form for UOM Category
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UomCategory } from "../types/uom-category.js";
import { UomCategoryInsertSchema } from "../types/uom-category.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface UomCategoryFormProps {
  initialData?: Partial<UomCategory>;
  onSubmit: (data: Partial<UomCategory>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function UomCategoryForm({ initialData = {}, onSubmit, mode, isLoading }: UomCategoryFormProps) {
  const form = useForm<Partial<UomCategory>>({
    resolver: zodResolver(UomCategoryInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "UOM Category" : "New UOM Category"}
        </h2>
            <FormField control={form.control} name="category_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Category Name</FormLabel>
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