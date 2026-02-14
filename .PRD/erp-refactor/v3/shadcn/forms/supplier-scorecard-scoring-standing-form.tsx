"use client";

// Form for Supplier Scorecard Scoring Standing
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SupplierScorecardScoringStanding } from "../types/supplier-scorecard-scoring-standing.js";
import { SupplierScorecardScoringStandingInsertSchema } from "../types/supplier-scorecard-scoring-standing.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SupplierScorecardScoringStandingFormProps {
  initialData?: Partial<SupplierScorecardScoringStanding>;
  onSubmit: (data: Partial<SupplierScorecardScoringStanding>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SupplierScorecardScoringStandingForm({ initialData = {}, onSubmit, mode, isLoading }: SupplierScorecardScoringStandingFormProps) {
  const form = useForm<Partial<SupplierScorecardScoringStanding>>({
    resolver: zodResolver(SupplierScorecardScoringStandingInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Supplier Scorecard Scoring Standing" : "New Supplier Scorecard Scoring Standing"}
        </h2>
            <FormField control={form.control} name="standing_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Standing Name (→ Supplier Scorecard Standing)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier Scorecard Standing..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="standing_color" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Color</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Blue">Blue</SelectItem>
                    <SelectItem value="Purple">Purple</SelectItem>
                    <SelectItem value="Green">Green</SelectItem>
                    <SelectItem value="Yellow">Yellow</SelectItem>
                    <SelectItem value="Orange">Orange</SelectItem>
                    <SelectItem value="Red">Red</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="min_grade" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Min Grade</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="max_grade" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Max Grade</FormLabel>
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
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="warn_rfqs" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Warn RFQs</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="warn_pos" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Warn Purchase Orders</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="prevent_rfqs" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Prevent RFQs</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="prevent_pos" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Prevent Purchase Orders</FormLabel>
                </div>
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