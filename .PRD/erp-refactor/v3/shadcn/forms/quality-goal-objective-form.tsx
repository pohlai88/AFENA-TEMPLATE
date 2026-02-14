"use client";

// Form for Quality Goal Objective
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QualityGoalObjective } from "../types/quality-goal-objective.js";
import { QualityGoalObjectiveInsertSchema } from "../types/quality-goal-objective.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface QualityGoalObjectiveFormProps {
  initialData?: Partial<QualityGoalObjective>;
  onSubmit: (data: Partial<QualityGoalObjective>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QualityGoalObjectiveForm({ initialData = {}, onSubmit, mode, isLoading }: QualityGoalObjectiveFormProps) {
  const form = useForm<Partial<QualityGoalObjective>>({
    resolver: zodResolver(QualityGoalObjectiveInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quality Goal Objective" : "New Quality Goal Objective"}
        </h2>
            <FormField control={form.control} name="objective" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Objective</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="target" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Target</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">UOM (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} />
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