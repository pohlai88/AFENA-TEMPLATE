"use client";

// Form for Master Production Schedule
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MasterProductionSchedule } from "../types/master-production-schedule.js";
import { MasterProductionScheduleInsertSchema } from "../types/master-production-schedule.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MasterProductionScheduleFormProps {
  initialData?: Partial<MasterProductionSchedule>;
  onSubmit: (data: Partial<MasterProductionSchedule>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function MasterProductionScheduleForm({ initialData = {}, onSubmit, mode, isLoading }: MasterProductionScheduleFormProps) {
  const form = useForm<Partial<MasterProductionSchedule>>({
    resolver: zodResolver(MasterProductionScheduleInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Master Production Schedule" : "New Master Production Schedule"}
        </h2>
        <Tabs defaultValue="planning" className="w-full">
          <TabsList>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="demand">Demand</TabsTrigger>
          </TabsList>
          <TabsContent value="planning" className="space-y-4">
            <FormField control={form.control} name="naming_series" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Naming Series</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  </SelectContent>
                </Select>
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
            <FormField control={form.control} name="posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="from_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Select Items</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Master Production Schedule Item — integrate with DataTable */}
                <p>Child table for Master Production Schedule Item</p>
              </div>
            </div>
            <FormField control={form.control} name="parent_warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Parent Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>For projected and forecast quantities, the system will consider all child warehouses under the selected parent warehouse.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
          </TabsContent>
          <TabsContent value="demand" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Open Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Sales Orders</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Production Plan Sales Order — integrate with DataTable */}
                <p>Child table for Production Plan Sales Order</p>
              </div>
            </div>
            <div className="col-span-2">
              <FormLabel className="">Material Requests</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Production Plan Material Request — integrate with DataTable */}
                <p>Child table for Production Plan Material Request</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actual Demand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Items</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Master Production Schedule Item — integrate with DataTable */}
                <p>Child table for Master Production Schedule Item</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Forecast Demand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="sales_forecast" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Forecast (→ Sales Forecast)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Forecast..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Master Production Schedule)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Master Production Schedule..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
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