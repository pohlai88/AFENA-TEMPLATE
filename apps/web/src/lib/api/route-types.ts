/** Shared route types for manifest and OpenAPI generator. */

export type Tier = 'contract' | 'bff' | 'admin' | 'auth';
export type ApiVersion = 'v1' | 'v2';
export type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT' | 'HEAD' | 'OPTIONS';
export type Kind = 'entity' | 'webhook' | 'docs' | 'bff' | 'admin';

type Base = {
  file: string;
  path: string;
  methods: readonly Method[];
  tier: Tier;
  exposeInOpenApi: boolean;
  kind: Kind;
};

export type ContractEntry = Base & {
  tier: 'contract';
  version: ApiVersion;
  exposeInOpenApi: true;
};

export type NonContractEntry = Base & {
  tier: Exclude<Tier, 'contract'>;
  version?: never;
  exposeInOpenApi: false;
};

export type RouteFileEntry = ContractEntry | NonContractEntry;

/** ROUTE_META shape (no file/kind; manifest supplies those). */
export type RouteMetaStrict = Omit<RouteFileEntry, 'file' | 'kind'>;

/** Convert canonical Next token path to OpenAPI path form. */
export function toOpenApiPath(canonicalPath: string): string {
  if (canonicalPath.includes(':') || canonicalPath.includes('{') || canonicalPath.includes('}')) {
    throw new Error(`Invalid path (no : or {{ }} in code): ${canonicalPath}`);
  }
  return canonicalPath.replaceAll('[', '{').replaceAll(']', '}');
}
