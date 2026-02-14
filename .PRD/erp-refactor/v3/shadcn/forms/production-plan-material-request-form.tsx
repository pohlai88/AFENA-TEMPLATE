"use client";

// Form for Production Plan Material Request
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductionPlanMaterialRequest } from "../types/production-plan-material-request.js";
import { ProductionPlanMaterialRequestInsertSchema } from "../types/production-plan-material-request.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProductionPlanMaterialRequestFormProps {
  initialData?: Partial<ProductionPlanMaterialRequest>;
  onSubmit: (data: Partial<ProductionPlanMaterialRequest>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProductionPlanMaterialRequestForm({ initialData = {}, onSubmit, mode, isLoading }: ProductionPlanMaterialRequestFormProps) {
  const form = useForm<Partial<ProductionPlanMaterialRequest>>({
    resolver: zodResolver(ProductionPlanMaterialRequestInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Production Plan Material Request" : "New Production Plan Material Request"}
        </h2>
            <FormField control={form.control} name="material_request" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Material Request (→ Material Request)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Material Request..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="material_request_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Material Request Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
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