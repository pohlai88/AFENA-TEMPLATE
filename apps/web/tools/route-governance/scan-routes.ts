import path from 'node:path';
import { pathToFileURL } from 'node:url';

import fg from 'fast-glob';

import type { Method, RouteMetaStrict } from '../../src/lib/api/route-types';

const HANDLER_METHODS: Method[] = ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'HEAD', 'OPTIONS'];

export type ScannedRouteFile = {
  file: string; // repo-relative
  absFile: string; // absolute
  exportedHandlers: Method[];
  meta: RouteMetaStrict;
};

interface RouteModule {
  GET?: unknown;
  POST?: unknown;
  PATCH?: unknown;
  DELETE?: unknown;
  PUT?: unknown;
  HEAD?: unknown;
  OPTIONS?: unknown;
  ROUTE_META?: RouteMetaStrict;
}

export async function scanRouteFiles(): Promise<ScannedRouteFile[]> {
  const appDir = path.resolve(process.cwd(), 'app/api');
  const matches = await fg(['**/route.ts'], { cwd: appDir, absolute: true, dot: false });

  const out: ScannedRouteFile[] = [];

  for (const abs of matches) {
    const mod = await import(pathToFileURL(abs).toString()) as RouteModule;

    const exportedHandlers = HANDLER_METHODS.filter((m) => typeof mod[m] === 'function');
    const meta = mod.ROUTE_META;

    if (!meta) throw new Error(`Missing export const ROUTE_META in ${abs}`);

    out.push({
      file: path.relative(process.cwd(), abs),
      absFile: abs,
      exportedHandlers,
      meta,
    });
  }

  return out;
}
