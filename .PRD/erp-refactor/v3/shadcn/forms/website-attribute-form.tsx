"use client";

// Form for Website Attribute
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { WebsiteAttribute } from "../types/website-attribute.js";
import { WebsiteAttributeInsertSchema } from "../types/website-attribute.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface WebsiteAttributeFormProps {
  initialData?: Partial<WebsiteAttribute>;
  onSubmit: (data: Partial<WebsiteAttribute>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function WebsiteAttributeForm({ initialData = {}, onSubmit, mode, isLoading }: WebsiteAttributeFormProps) {
  const form = useForm<Partial<WebsiteAttribute>>({
    resolver: zodResolver(WebsiteAttributeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Website Attribute" : "New Website Attribute"}
        </h2>
            <FormField control={form.control} name="attribute" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Attribute (→ Item Attribute)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item Attribute..." {...f} value={(f.value as string) ?? ""} />
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