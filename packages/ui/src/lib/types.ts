import type * as React from 'react';

/**
 * Extracts props from a React component type.
 * Works with function components, class components, and intrinsic elements.
 *
 * @example
 * ```tsx
 * type ButtonProps = ComponentProps<typeof Button>;
 * type DivProps = ComponentProps<"div">;
 * ```
 */
export type ComponentProps<T> = T extends React.ComponentType<infer P>
  ? P
  : T extends keyof React.JSX.IntrinsicElements
    ? React.JSX.IntrinsicElements[T]
    : never;

/**
 * Props for a polymorphic component that can render as different elements.
 * Follows the Radix `asChild` / shadcn `Slot` pattern.
 *
 * @example
 * ```tsx
 * type CardProps = PolymorphicProps<"div", { variant?: "default" | "outline" }>;
 * ```
 */
export type PolymorphicProps<
  Element extends React.ElementType,
  Props = object,
> = Props &
  Omit<React.ComponentPropsWithoutRef<Element>, keyof Props> & {
    asChild?: boolean;
  };

/**
 * Utility type to make specific keys required while keeping others optional.
 *
 * @example
 * ```tsx
 * type Props = RequiredKeys<{ a?: string; b?: number; c?: boolean }, "a" | "b">;
 * // { a: string; b: number; c?: boolean }
 * ```
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Utility type to make specific keys optional while keeping others required.
 *
 * @example
 * ```tsx
 * type Props = OptionalKeys<{ a: string; b: number; c: boolean }, "a" | "b">;
 * // { a?: string; b?: number; c: boolean }
 * ```
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Extracts the value type from a Record.
 */
export type ValueOf<T> = T[keyof T];

/**
 * Makes all properties and nested properties readonly.
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Makes all properties and nested properties optional.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Strict version of `Omit` that constrains keys to actual keys of `T`.
 */
export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Merge two types, with the second type's properties overriding the first.
 * Useful for component prop extension.
 *
 * @example
 * ```tsx
 * type BaseProps = React.ComponentProps<"button">;
 * type MyButtonProps = Merge<BaseProps, { variant: "primary" | "ghost" }>;
 * ```
 */
export type Merge<A, B> = Omit<A, keyof B> & B;
