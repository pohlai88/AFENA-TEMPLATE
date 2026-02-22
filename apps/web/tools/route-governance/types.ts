export type Tier = 'contract' | 'bff' | 'admin' | 'auth';
export type ApiVersion = 'v1' | 'v2';
export type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT' | 'HEAD' | 'OPTIONS';

export type Kind = 'entity' | 'webhook' | 'docs' | 'bff' | 'admin';

type Base = {
  file: string; // repo-relative route.ts path
  path: string; // canonical Next token form
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

export type RouteMetaStrict = Omit<RouteFileEntry, 'file' | 'kind'> & {
  // ROUTE_META does not need file/kind; manifest supplies those.
  // We still validate them in CI.
};
