'use client';

import * as React from 'react';

import { Toaster } from '../components/sonner';

/**
 * Mounts the Sonner `<Toaster />` at the root of the app.
 *
 * Separated into its own provider so the root layout stays clean
 * and the Toaster can be swapped or configured in one place.
 *
 * @example
 * ```tsx
 * <ToasterProvider />
 * ```
 */
function ToasterProvider() {
  return <Toaster />;
}

export { ToasterProvider };
