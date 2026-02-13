"use client";

// Form for Employee Education
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EmployeeEducation } from "../types/employee-education.js";
import { EmployeeEducationInsertSchema } from "../types/employee-education.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface EmployeeEducationFormProps {
  initialData?: Partial<EmployeeEducation>;
  onSubmit: (data: Partial<EmployeeEducation>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function EmployeeEducationForm({ initialData = {}, onSubmit, mode, isLoading }: EmployeeEducationFormProps) {
  const form = useForm<Partial<EmployeeEducation>>({
    resolver: zodResolver(EmployeeEducationInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Employee Education" : "New Employee Education"}
        </h2>
            <FormField control={form.control} name="school_univ" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">School/University</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="qualification" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Qualification</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="level" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Level</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                    <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                    <SelectItem value="Under Graduate">Under Graduate</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="year_of_passing" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Year of Passing</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="class_per" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Class / Percentage</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="maj_opt_subj" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Major/Optional Subjects</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
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