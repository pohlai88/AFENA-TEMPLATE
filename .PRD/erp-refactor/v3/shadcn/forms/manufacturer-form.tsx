"use client";

// Form for Manufacturer
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Manufacturer } from "../types/manufacturer.js";
import { ManufacturerInsertSchema } from "../types/manufacturer.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ManufacturerFormProps {
  initialData?: Partial<Manufacturer>;
  onSubmit: (data: Partial<Manufacturer>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ManufacturerForm({ initialData = {}, onSubmit, mode, isLoading }: ManufacturerFormProps) {
  const form = useForm<Partial<Manufacturer>>({
    resolver: zodResolver(ManufacturerInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.short_name as string) ?? "Manufacturer" : "New Manufacturer"}
          </h2>
        </div>
            <FormField control={form.control} name="short_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Short Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Limited to 12 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="full_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Full Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="website" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Website</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="country" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Country (→ Country)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Country..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="logo" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Logo</FormLabel>
                <FormControl>
                  <Input type="file" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Address and Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="address_html" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Address HTML</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact_html" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Contact HTML</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="notes" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Notes</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}