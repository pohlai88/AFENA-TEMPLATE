"use client";

// Form for Maintenance Visit Purpose
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MaintenanceVisitPurpose } from "../types/maintenance-visit-purpose.js";
import { MaintenanceVisitPurposeInsertSchema } from "../types/maintenance-visit-purpose.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MaintenanceVisitPurposeFormProps {
  initialData?: Partial<MaintenanceVisitPurpose>;
  onSubmit: (data: Partial<MaintenanceVisitPurpose>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function MaintenanceVisitPurposeForm({ initialData = {}, onSubmit, mode, isLoading }: MaintenanceVisitPurposeFormProps) {
  const form = useForm<Partial<MaintenanceVisitPurpose>>({
    resolver: zodResolver(MaintenanceVisitPurposeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Maintenance Visit Purpose" : "New Maintenance Visit Purpose"}
        </h2>
            <FormField control={form.control} name="item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Code (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="item_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="service_person" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Person (→ Sales Person)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Person..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="serial_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Serial No (→ Serial No)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Serial No..." {...f} value={(f.value as string) ?? ""} />
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
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="work_done" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Work Done</FormLabel>
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