"use client";

// Form for Driver
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Driver } from "../types/driver.js";
import { DriverInsertSchema } from "../types/driver.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DriverFormProps {
  initialData?: Partial<Driver>;
  onSubmit: (data: Partial<Driver>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function DriverForm({ initialData = {}, onSubmit, mode, isLoading }: DriverFormProps) {
  const form = useForm<Partial<Driver>>({
    resolver: zodResolver(DriverInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.full_name as string) ?? "Driver" : "New Driver"}
          </h2>
        </div>
            <FormField control={form.control} name="naming_series" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Series</FormLabel>
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
            <FormField control={form.control} name="full_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Full Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Left">Left</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="transporter" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Transporter (→ Supplier)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Applicable for external driver</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="employee" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Employee (→ Employee)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Employee..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="cell_number" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Cellphone Number</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Address (→ Address)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Address..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="user" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">User (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">License Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="license_number" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">License Number</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="issuing_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Issuing Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="expiry_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Expiry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Driving License Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Driving License Category</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Driving License Category — integrate with DataTable */}
                <p>Child table for Driving License Category</p>
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