"use client";

// Form for Plant Floor
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PlantFloor } from "../types/plant-floor.js";
import { PlantFloorInsertSchema } from "../types/plant-floor.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlantFloorFormProps {
  initialData?: Partial<PlantFloor>;
  onSubmit: (data: Partial<PlantFloor>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PlantFloorForm({ initialData = {}, onSubmit, mode, isLoading }: PlantFloorFormProps) {
  const form = useForm<Partial<PlantFloor>>({
    resolver: zodResolver(PlantFloorInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Plant Floor" : "New Plant Floor"}
        </h2>
        <Tabs defaultValue="workstations" className="w-full">
          <TabsList>
            <TabsTrigger value="workstations">Workstations</TabsTrigger>
            <TabsTrigger value="stock-summary">Stock Summary</TabsTrigger>
            <TabsTrigger value="floor">Floor</TabsTrigger>
          </TabsList>
          <TabsContent value="workstations" className="space-y-4">
            <FormField control={form.control} name="plant_dashboard" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Plant Dashboard</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="stock-summary" className="space-y-4">
            <FormField control={form.control} name="stock_summary" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Stock Summary</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="floor" className="space-y-4">
            <FormField control={form.control} name="floor_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Floor Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}