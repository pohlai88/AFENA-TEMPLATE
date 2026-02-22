'use client';

import { Checkbox } from 'afenda-ui/components/checkbox';
import { FieldGroup, FieldSet } from 'afenda-ui/components/field';
import { Input } from 'afenda-ui/components/input';
import { Label } from 'afenda-ui/components/label';
import { NativeSelect, NativeSelectOption } from 'afenda-ui/components/native-select';
import { useId, useState } from 'react';

/**
 * FormConfigRenderer — Renders form fields from form.config.
 * Config-driven forms; uses afenda-ui (shadcn) components only.
 */

type FormFieldConfig = {
  type: 'boolean' | 'string' | 'int' | 'enum' | 'date' | 'timestamptz' | 'json';
  label: string;
  required?: boolean;
  choices?: readonly string[];
};

type FormConfig = {
  entityType: string;
  order: readonly string[];
  fields: Record<string, FormFieldConfig>;
};

interface FormConfigRendererProps {
  config: FormConfig;
  defaultValues?: Record<string, string | boolean | number | null>;
  /** Field name prefix for form (e.g. for grouped forms) */
  namePrefix?: string;
}

function toCamel(s: string): string {
  return s
    .split(/[-_]/)
    .map((p, i) =>
      i === 0 ? p.toLowerCase() : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase(),
    )
    .join('');
}

export function FormConfigRenderer({
  config,
  defaultValues = {},
  namePrefix = '',
}: FormConfigRendererProps) {
  const baseId = useId();
  const name = (key: string) => (namePrefix ? `${namePrefix}.${key}` : key);
  const [boolValues, setBoolValues] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const fieldKey of config.order) {
      const field = config.fields[fieldKey];
      if (field?.type === 'boolean') {
        const camelKey = toCamel(fieldKey);
        const dv = defaultValues[fieldKey] ?? defaultValues[camelKey] ?? '';
        init[fieldKey] =
          typeof dv === 'boolean' ? dv : String(dv) === 'true';
      }
    }
    return init;
  });

  return (
    <FieldSet className="space-y-4">
      {config.order.map((fieldKey) => {
        const field = config.fields[fieldKey];
        if (!field) return null;

        const inputName = name(fieldKey);
        const camelKey = toCamel(fieldKey);
        const defaultValue = defaultValues[fieldKey] ?? defaultValues[camelKey] ?? '';
        const uid = `${baseId}-${fieldKey}`;

        if (field.type === 'boolean') {
          const checked = boolValues[fieldKey] ?? false;
          return (
            <FieldGroup key={fieldKey} className="flex flex-row items-center gap-2">
              <input
                type="hidden"
                name={inputName}
                value={checked ? 'true' : 'false'}
                readOnly
                aria-hidden
              />
              <Checkbox
                id={uid}
                checked={checked}
                onCheckedChange={(c) =>
                  setBoolValues((prev) => ({ ...prev, [fieldKey]: !!c }))
                }
                aria-describedby={field.required ? `${uid}-req` : undefined}
                aria-required={field.required}
              />
              <Label
                htmlFor={uid}
                className="font-normal cursor-pointer"
              >
                {field.label}
                {field.required && (
                  <span id={`${uid}-req`} className="text-destructive ml-0.5">
                    *
                  </span>
                )}
              </Label>
            </FieldGroup>
          );
        }

        if (field.type === 'enum' && field.choices?.length) {
          return (
            <FieldGroup key={fieldKey} className="space-y-2">
              <Label htmlFor={uid}>
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-0.5">*</span>
                )}
              </Label>
              <NativeSelect
                id={uid}
                name={inputName}
                defaultValue={String(defaultValue)}
                required={field.required}
                className="w-full"
              >
                <NativeSelectOption value="">
                  Select {field.label}
                </NativeSelectOption>
                {field.choices.map((opt) => (
                  <NativeSelectOption key={opt} value={opt}>
                    {opt}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FieldGroup>
          );
        }

        // string, int, date, timestamptz, json
        const inputType =
          field.type === 'int'
            ? 'number'
            : field.type === 'date' || field.type === 'timestamptz'
              ? 'datetime-local'
              : 'text';

        return (
          <FieldGroup key={fieldKey} className="space-y-2">
            <Label htmlFor={uid}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-0.5">*</span>
              )}
            </Label>
            <Input
              id={uid}
              name={inputName}
              type={inputType}
              defaultValue={String(defaultValue ?? '')}
              placeholder={field.label}
              required={field.required}
            />
          </FieldGroup>
        );
      })}
    </FieldSet>
  );
}
