"use client";

// Form for Lower Deduction Certificate
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LowerDeductionCertificate } from "../types/lower-deduction-certificate.js";
import { LowerDeductionCertificateInsertSchema } from "../types/lower-deduction-certificate.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LowerDeductionCertificateFormProps {
  initialData?: Partial<LowerDeductionCertificate>;
  onSubmit: (data: Partial<LowerDeductionCertificate>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function LowerDeductionCertificateForm({ initialData = {}, onSubmit, mode, isLoading }: LowerDeductionCertificateFormProps) {
  const form = useForm<Partial<LowerDeductionCertificate>>({
    resolver: zodResolver(LowerDeductionCertificateInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Lower Deduction Certificate" : "New Lower Deduction Certificate"}
        </h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Certificate Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="tax_withholding_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Withholding Category (→ Tax Withholding Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Tax Withholding Category..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="fiscal_year" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Fiscal Year (→ Fiscal Year)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Fiscal Year..." {...f} value={(f.value as string) ?? ""} />
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
            <FormField control={form.control} name="certificate_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Certificate No</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deductee Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="supplier" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier (→ Supplier)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="pan_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">PAN No</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Validity Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="valid_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Valid From</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="valid_upto" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Valid Up To</FormLabel>
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
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Rate Of TDS As Per Certificate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="certificate_limit" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Certificate Limit</FormLabel>
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

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}