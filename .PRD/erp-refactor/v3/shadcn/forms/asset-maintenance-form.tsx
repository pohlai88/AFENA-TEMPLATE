"use client";

// Form for Asset Maintenance
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AssetMaintenance } from "../types/asset-maintenance.js";
import { AssetMaintenanceInsertSchema } from "../types/asset-maintenance.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssetMaintenanceFormProps {
  initialData?: Partial<AssetMaintenance>;
  onSubmit: (data: Partial<AssetMaintenance>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AssetMaintenanceForm({ initialData = {}, onSubmit, mode, isLoading }: AssetMaintenanceFormProps) {
  const form = useForm<Partial<AssetMaintenance>>({
    resolver: zodResolver(AssetMaintenanceInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Asset Maintenance" : "New Asset Maintenance"}
        </h2>
            <FormField control={form.control} name="asset_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Name (→ Asset)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Asset..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="asset_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Asset Category</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
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
            <FormField control={form.control} name="item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Code</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
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
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="maintenance_team" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Maintenance Team (→ Asset Maintenance Team)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Asset Maintenance Team..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="maintenance_manager_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Maintenance Manager Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Maintenance Tasks</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Asset Maintenance Task — integrate with DataTable */}
                <p>Child table for Asset Maintenance Task</p>
              </div>
            </div>
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