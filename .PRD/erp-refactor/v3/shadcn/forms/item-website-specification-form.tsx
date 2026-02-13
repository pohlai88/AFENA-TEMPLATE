"use client";

// Form for Item Website Specification
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemWebsiteSpecification } from "../types/item-website-specification.js";
import { ItemWebsiteSpecificationInsertSchema } from "../types/item-website-specification.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ItemWebsiteSpecificationFormProps {
  initialData?: Partial<ItemWebsiteSpecification>;
  onSubmit: (data: Partial<ItemWebsiteSpecification>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemWebsiteSpecificationForm({ initialData = {}, onSubmit, mode, isLoading }: ItemWebsiteSpecificationFormProps) {
  const form = useForm<Partial<ItemWebsiteSpecification>>({
    resolver: zodResolver(ItemWebsiteSpecificationInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Item Website Specification" : "New Item Website Specification"}
        </h2>
            <FormField control={form.control} name="label" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Label</FormLabel>
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