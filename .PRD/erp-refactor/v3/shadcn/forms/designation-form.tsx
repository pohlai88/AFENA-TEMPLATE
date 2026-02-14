"use client";

// Form for Designation
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Designation } from "../types/designation.js";
import { DesignationInsertSchema } from "../types/designation.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DesignationFormProps {
  initialData?: Partial<Designation>;
  onSubmit: (data: Partial<Designation>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function DesignationForm({ initialData = {}, onSubmit, mode, isLoading }: DesignationFormProps) {
  const form = useForm<Partial<Designation>>({
    resolver: zodResolver(DesignationInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Designation" : "New Designation"}
        </h2>
            <FormField control={form.control} name="designation_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Designation</FormLabel>
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