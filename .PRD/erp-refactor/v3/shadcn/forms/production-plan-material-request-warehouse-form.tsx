"use client";

// Form for Production Plan Material Request Warehouse
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductionPlanMaterialRequestWarehouse } from "../types/production-plan-material-request-warehouse.js";
import { ProductionPlanMaterialRequestWarehouseInsertSchema } from "../types/production-plan-material-request-warehouse.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProductionPlanMaterialRequestWarehouseFormProps {
  initialData?: Partial<ProductionPlanMaterialRequestWarehouse>;
  onSubmit: (data: Partial<ProductionPlanMaterialRequestWarehouse>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProductionPlanMaterialRequestWarehouseForm({ initialData = {}, onSubmit, mode, isLoading }: ProductionPlanMaterialRequestWarehouseFormProps) {
  const form = useForm<Partial<ProductionPlanMaterialRequestWarehouse>>({
    resolver: zodResolver(ProductionPlanMaterialRequestWarehouseInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Production Plan Material Request Warehouse" : "New Production Plan Material Request Warehouse"}
        </h2>
            <FormField control={form.control} name="warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
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