"use client";

// Form for Asset Maintenance Team
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AssetMaintenanceTeam } from "../types/asset-maintenance-team.js";
import { AssetMaintenanceTeamInsertSchema } from "../types/asset-maintenance-team.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssetMaintenanceTeamFormProps {
  initialData?: Partial<AssetMaintenanceTeam>;
  onSubmit: (data: Partial<AssetMaintenanceTeam>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AssetMaintenanceTeamForm({ initialData = {}, onSubmit, mode, isLoading }: AssetMaintenanceTeamFormProps) {
  const form = useForm<Partial<AssetMaintenanceTeam>>({
    resolver: zodResolver(AssetMaintenanceTeamInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Asset Maintenance Team" : "New Asset Maintenance Team"}
        </h2>
            <FormField control={form.control} name="maintenance_team_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Maintenance Team Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="maintenance_manager" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Maintenance Manager (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Maintenance Team Members</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Maintenance Team Member — integrate with DataTable */}
                <p>Child table for Maintenance Team Member</p>
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