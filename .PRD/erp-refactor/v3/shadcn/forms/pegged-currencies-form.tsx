"use client";

// Form for Pegged Currencies
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PeggedCurrencies } from "../types/pegged-currencies.js";
import { PeggedCurrenciesInsertSchema } from "../types/pegged-currencies.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PeggedCurrenciesFormProps {
  initialData?: Partial<PeggedCurrencies>;
  onSubmit: (data: Partial<PeggedCurrencies>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PeggedCurrenciesForm({ initialData = {}, onSubmit, mode, isLoading }: PeggedCurrenciesFormProps) {
  const form = useForm<Partial<PeggedCurrencies>>({
    resolver: zodResolver(PeggedCurrenciesInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Pegged Currencies" : "New Pegged Currencies"}
        </h2>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">pegged_currency_item</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Pegged Currency Details — integrate with DataTable */}
                <p>Child table for Pegged Currency Details</p>
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