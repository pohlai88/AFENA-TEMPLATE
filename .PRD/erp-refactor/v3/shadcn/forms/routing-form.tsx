"use client";

// Form for Routing
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Routing } from "../types/routing.js";
import { RoutingInsertSchema } from "../types/routing.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface RoutingFormProps {
  initialData?: Partial<Routing>;
  onSubmit: (data: Partial<Routing>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function RoutingForm({ initialData = {}, onSubmit, mode, isLoading }: RoutingFormProps) {
  const form = useForm<Partial<Routing>>({
    resolver: zodResolver(RoutingInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Routing" : "New Routing"}
        </h2>
            <FormField control={form.control} name="routing_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Routing Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!form.getValues().__islocal && (
            <FormField control={form.control} name="disabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disabled</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            <div className="col-span-2">
              <FormLabel className="">BOM Operation</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: BOM Operation — integrate with DataTable */}
                <p>Child table for BOM Operation</p>
              </div>
            </div>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}