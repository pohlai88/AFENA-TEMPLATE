"use client";

// Form for Authorization Rule
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AuthorizationRule } from "../types/authorization-rule.js";
import { AuthorizationRuleInsertSchema } from "../types/authorization-rule.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthorizationRuleFormProps {
  initialData?: Partial<AuthorizationRule>;
  onSubmit: (data: Partial<AuthorizationRule>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AuthorizationRuleForm({ initialData = {}, onSubmit, mode, isLoading }: AuthorizationRuleFormProps) {
  const form = useForm<Partial<AuthorizationRule>>({
    resolver: zodResolver(AuthorizationRuleInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Authorization Rule" : "New Authorization Rule"}
        </h2>
            <FormField control={form.control} name="transaction" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Transaction</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sales Order">Sales Order</SelectItem>
                    <SelectItem value="Purchase Order">Purchase Order</SelectItem>
                    <SelectItem value="Quotation">Quotation</SelectItem>
                    <SelectItem value="Delivery Note">Delivery Note</SelectItem>
                    <SelectItem value="Sales Invoice">Sales Invoice</SelectItem>
                    <SelectItem value="Purchase Invoice">Purchase Invoice</SelectItem>
                    <SelectItem value="Purchase Receipt">Purchase Receipt</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="based_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Based On</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Grand Total">Grand Total</SelectItem>
                    <SelectItem value="Average Discount">Average Discount</SelectItem>
                    <SelectItem value="Customerwise Discount">Customerwise Discount</SelectItem>
                    <SelectItem value="Itemwise Discount">Itemwise Discount</SelectItem>
                    <SelectItem value="Item Group wise Discount">Item Group wise Discount</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="master_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer / Item / Item Group</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
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
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Authorized Value</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
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
            <FormField control={form.control} name="system_role" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Applicable To (Role) (→ Role)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Role..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_emp" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Applicable To (Employee) (→ Employee)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Employee..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="system_user" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Applicable To (User) (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_designation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Applicable To (Designation) (→ Designation)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Designation..." {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="approving_role" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Approving Role (above authorized value) (→ Role)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Role..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="approving_user" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Approving User  (above authorized value) (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
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