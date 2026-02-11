import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Typography components following the Aura Design System type scale.
 *
 * Each component maps to an engine-generated typography class
 * (`.heading-1`, `.body`, `.caption`, etc.) while remaining
 * fully composable with Tailwind utility classes.
 *
 * @example
 * ```tsx
 * <TypographyH1>Dashboard</TypographyH1>
 * <TypographyP>Welcome to the platform.</TypographyP>
 * <TypographyMuted>Last updated 2 hours ago</TypographyMuted>
 * ```
 */

function TypographyH1({
  className,
  ...props
}: React.ComponentProps<'h1'>) {
  return (
    <h1
      data-slot="typography-h1"
      className={cn('heading-1 scroll-m-20', className)}
      {...props}
    />
  );
}

function TypographyH2({
  className,
  ...props
}: React.ComponentProps<'h2'>) {
  return (
    <h2
      data-slot="typography-h2"
      className={cn('heading-2 scroll-m-20 border-b pb-2 first:mt-0', className)}
      {...props}
    />
  );
}

function TypographyH3({
  className,
  ...props
}: React.ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="typography-h3"
      className={cn('heading-3 scroll-m-20', className)}
      {...props}
    />
  );
}

function TypographyH4({
  className,
  ...props
}: React.ComponentProps<'h4'>) {
  return (
    <h4
      data-slot="typography-h4"
      className={cn('heading-4 scroll-m-20', className)}
      {...props}
    />
  );
}

function TypographyP({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="typography-p"
      className={cn('body [&:not(:first-child)]:mt-6', className)}
      {...props}
    />
  );
}

function TypographyLead({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="typography-lead"
      className={cn('body-lg text-muted-foreground', className)}
      {...props}
    />
  );
}

function TypographyLarge({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="typography-large"
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  );
}

function TypographySmall({
  className,
  ...props
}: React.ComponentProps<'small'>) {
  return (
    <small
      data-slot="typography-small"
      className={cn('body-sm font-medium leading-none', className)}
      {...props}
    />
  );
}

function TypographyMuted({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="typography-muted"
      className={cn('caption text-muted-foreground', className)}
      {...props}
    />
  );
}

function TypographyBlockquote({
  className,
  ...props
}: React.ComponentProps<'blockquote'>) {
  return (
    <blockquote
      data-slot="typography-blockquote"
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    />
  );
}

function TypographyInlineCode({
  className,
  ...props
}: React.ComponentProps<'code'>) {
  return (
    <code
      data-slot="typography-inline-code"
      className={cn('code', className)}
      {...props}
    />
  );
}

function TypographyList({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="typography-list"
      className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}
      {...props}
    />
  );
}

export {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyLead,
  TypographyLarge,
  TypographySmall,
  TypographyMuted,
  TypographyBlockquote,
  TypographyInlineCode,
  TypographyList,
};
