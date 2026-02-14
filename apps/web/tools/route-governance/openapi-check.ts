import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { toOpenApiPath } from '../../src/lib/api/route-types';

import type { RouteFileEntry } from '../../src/lib/api/route-types';

type OpenApiSpec = {
  paths?: Record<string, Record<string, unknown>>;
};

function normalizeOpenApiMethod(m: string): string {
  return m.toLowerCase();
}

export async function loadOpenApiFromGenerator(
  manifest: RouteFileEntry[],
): Promise<OpenApiSpec> {
  const p = path.resolve(process.cwd(), 'src/lib/api/openapi-spec.ts');
  const mod = await import(pathToFileURL(p).toString());

  if (typeof mod.generateOpenApiFromManifest === 'function') {
    return mod.generateOpenApiFromManifest(manifest);
  }

  if (typeof mod.getOpenApiSpec === 'function') {
    return mod.getOpenApiSpec();
  }

  throw new Error(
    'OpenAPI generator must export generateOpenApiFromManifest(manifest) or getOpenApiSpec()',
  );
}

export function assertOpenApiMatchesManifest(
  spec: OpenApiSpec,
  manifest: RouteFileEntry[],
): void {
  const paths = spec.paths ?? {};
  const hasOp = (p: string, m: string) => !!paths[p]?.[normalizeOpenApiMethod(m)];

  for (const e of manifest) {
    const openApiPath = toOpenApiPath(e.path);

    if (e.tier === 'contract' && e.exposeInOpenApi) {
      for (const m of e.methods) {
        if (!hasOp(openApiPath, m)) {
          throw new Error(
            `OpenAPI missing operation: ${m} ${openApiPath} (from manifest ${e.path})`,
          );
        }
      }
    } else {
      if (paths[openApiPath]) {
        throw new Error(
          `Non-contract route appears in OpenAPI: ${openApiPath} (manifest tier=${e.tier})`,
        );
      }
    }
  }
}
