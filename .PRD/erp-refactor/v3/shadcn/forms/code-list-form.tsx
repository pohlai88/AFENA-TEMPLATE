"use client";

// Form for Code List
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CodeList } from "../types/code-list.js";
import { CodeListInsertSchema } from "../types/code-list.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CodeListFormProps {
  initialData?: Partial<CodeList>;
  onSubmit: (data: Partial<CodeList>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CodeListForm({ initialData = {}, onSubmit, mode, isLoading }: CodeListFormProps) {
  const form = useForm<Partial<CodeList>>({
    resolver: zodResolver(CodeListInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.title as string) ?? "Code List" : "New Code List"}
          </h2>
        </div>
            <FormField control={form.control} name="title" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Title</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="canonical_uri" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Canonical URI</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="url" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">URL</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_common_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Common Code (→ Common Code)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Common Code..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>This value shall be used when no matching Common Code for a record is found.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="version" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Version</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="publisher" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Publisher</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="publisher_id" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Publisher ID</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Description</FormLabel>
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