import type {
  CompanyId,
  CurrencyCode,
  FiscalPeriodKey,
  IndustryOverlayKey,
  IsoDateTime,
  LedgerId,
  RoleKey,
  SiteId,
} from './branded';
import type { OrgId, UserId } from './ids';

export interface DomainContext {
  orgId: OrgId;
  companyId: CompanyId;
  currencyCode: CurrencyCode;
  locale?: string;
  activeOverlays: ReadonlySet<IndustryOverlayKey>;
  actor: {
    userId: UserId;
    roles: RoleKey[];
  };
  asOf: IsoDateTime;
  ledgerId?: LedgerId;
  periodKey?: FiscalPeriodKey;
  dimension?: {
    siteId?: SiteId;
    [key: string]: unknown;
  };
}
