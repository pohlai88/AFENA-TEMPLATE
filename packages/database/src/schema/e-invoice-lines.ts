import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { moneyMinor } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const eInvoiceLines = pgTable(
  'e_invoice_lines',
  {
    ...erpEntityColumns,
    eInvoiceId: uuid('e_invoice_id').notNull(),
    lineNo: integer('line_no').notNull(),
    description: text('description').notNull(),
    quantityMinor: moneyMinor('quantity_minor'),
    unitPriceMinor: moneyMinor('unit_price_minor'),
    lineExtensionMinor: moneyMinor('line_extension_minor'),
    taxCode: text('tax_code').notNull(),
    taxAmountMinor: moneyMinor('tax_amount_minor'),
    allowanceMinor: moneyMinor('allowance_minor'),
    chargeMinor: moneyMinor('charge_minor'),
  },
  (t) => [
    ...erpIndexes('e_invoice_lines', t),
    index('e_invoice_lines_org_invoice_idx').on(t.orgId, t.eInvoiceId),
    check('e_invoice_lines_line_no_positive', sql`line_no > 0`),
  ],
);

export type EInvoiceLineRow = typeof eInvoiceLines.$inferSelect;
export type NewEInvoiceLineRow = typeof eInvoiceLines.$inferInsert;
