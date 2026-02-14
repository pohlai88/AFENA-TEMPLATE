"use client";

// Form for Driving License Category
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DrivingLicenseCategory } from "../types/driving-license-category.js";
import { DrivingLicenseCategoryInsertSchema } from "../types/driving-license-category.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface DrivingLicenseCategoryFormProps {
  initialData?: Partial<DrivingLicenseCategory>;
  onSubmit: (data: Partial<DrivingLicenseCategory>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function DrivingLicenseCategoryForm({ initialData = {}, onSubmit, mode, isLoading }: DrivingLicenseCategoryFormProps) {
  const form = useForm<Partial<DrivingLicenseCategory>>({
    resolver: zodResolver(DrivingLicenseCategoryInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Driving License Category" : "New Driving License Category"}
        </h2>
            <FormField control={form.control} name="class" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Driver licence class</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Description</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="issuing_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Issuing Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="expiry_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Expiry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
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