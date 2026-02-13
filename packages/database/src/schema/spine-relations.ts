import { relations } from 'drizzle-orm';

import { contacts } from './contacts';
import { deliveryNoteLines } from './delivery-note-lines';
import { deliveryNotes } from './delivery-notes';
import { docPostings } from './doc-postings';
import { goodsReceiptLines } from './goods-receipt-lines';
import { goodsReceipts } from './goods-receipts';
import { itemGroups } from './item-groups';
import { items } from './items';
import { payments } from './payments';
import { purchaseInvoiceLines } from './purchase-invoice-lines';
import { purchaseInvoices } from './purchase-invoices';
import { purchaseOrderLines } from './purchase-order-lines';
import { purchaseOrders } from './purchase-orders';
import { quotationLines } from './quotation-lines';
import { quotations } from './quotations';
import { salesInvoiceLines } from './sales-invoice-lines';
import { salesInvoices } from './sales-invoices';
import { salesOrderLines } from './sales-order-lines';
import { salesOrders } from './sales-orders';

// ── Master Data Relations ────────────────────────────────

export const itemGroupsRelations = relations(itemGroups, ({ one, many }) => ({
  parentGroup: one(itemGroups, {
    fields: [itemGroups.parentGroupId],
    references: [itemGroups.id],
    relationName: 'itemGroupParent',
  }),
  childGroups: many(itemGroups, { relationName: 'itemGroupParent' }),
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  itemGroup: one(itemGroups, {
    fields: [items.itemGroupId],
    references: [itemGroups.id],
  }),
}));

// ── Sales Invoice ────────────────────────────────────────

export const salesInvoicesRelations = relations(salesInvoices, ({ one, many }) => ({
  customer: one(contacts, {
    fields: [salesInvoices.customerId],
    references: [contacts.id],
  }),
  lines: many(salesInvoiceLines),
}));

export const salesInvoiceLinesRelations = relations(salesInvoiceLines, ({ one }) => ({
  salesInvoice: one(salesInvoices, {
    fields: [salesInvoiceLines.salesInvoiceId],
    references: [salesInvoices.id],
  }),
  item: one(items, {
    fields: [salesInvoiceLines.itemId],
    references: [items.id],
  }),
}));

// ── Payments ─────────────────────────────────────────────

export const paymentsRelations = relations(payments, ({ one }) => ({
  party: one(contacts, {
    fields: [payments.partyId],
    references: [contacts.id],
  }),
}));

// ── Sales Orders ─────────────────────────────────────────

export const salesOrdersRelations = relations(salesOrders, ({ one, many }) => ({
  customer: one(contacts, {
    fields: [salesOrders.customerId],
    references: [contacts.id],
  }),
  lines: many(salesOrderLines),
}));

export const salesOrderLinesRelations = relations(salesOrderLines, ({ one }) => ({
  salesOrder: one(salesOrders, {
    fields: [salesOrderLines.salesOrderId],
    references: [salesOrders.id],
  }),
  item: one(items, {
    fields: [salesOrderLines.itemId],
    references: [items.id],
  }),
}));

// ── Delivery Notes ───────────────────────────────────────

export const deliveryNotesRelations = relations(deliveryNotes, ({ one, many }) => ({
  customer: one(contacts, {
    fields: [deliveryNotes.customerId],
    references: [contacts.id],
  }),
  lines: many(deliveryNoteLines),
}));

export const deliveryNoteLinesRelations = relations(deliveryNoteLines, ({ one }) => ({
  deliveryNote: one(deliveryNotes, {
    fields: [deliveryNoteLines.deliveryNoteId],
    references: [deliveryNotes.id],
  }),
  item: one(items, {
    fields: [deliveryNoteLines.itemId],
    references: [items.id],
  }),
}));

// ── Purchase Orders ──────────────────────────────────────

export const purchaseOrdersRelations = relations(purchaseOrders, ({ one, many }) => ({
  supplier: one(contacts, {
    fields: [purchaseOrders.supplierId],
    references: [contacts.id],
  }),
  lines: many(purchaseOrderLines),
}));

export const purchaseOrderLinesRelations = relations(purchaseOrderLines, ({ one }) => ({
  purchaseOrder: one(purchaseOrders, {
    fields: [purchaseOrderLines.purchaseOrderId],
    references: [purchaseOrders.id],
  }),
  item: one(items, {
    fields: [purchaseOrderLines.itemId],
    references: [items.id],
  }),
}));

// ── Goods Receipts ───────────────────────────────────────

export const goodsReceiptsRelations = relations(goodsReceipts, ({ one, many }) => ({
  supplier: one(contacts, {
    fields: [goodsReceipts.supplierId],
    references: [contacts.id],
  }),
  lines: many(goodsReceiptLines),
}));

export const goodsReceiptLinesRelations = relations(goodsReceiptLines, ({ one }) => ({
  goodsReceipt: one(goodsReceipts, {
    fields: [goodsReceiptLines.goodsReceiptId],
    references: [goodsReceipts.id],
  }),
  item: one(items, {
    fields: [goodsReceiptLines.itemId],
    references: [items.id],
  }),
}));

// ── Purchase Invoices ────────────────────────────────────

export const purchaseInvoicesRelations = relations(purchaseInvoices, ({ one, many }) => ({
  supplier: one(contacts, {
    fields: [purchaseInvoices.supplierId],
    references: [contacts.id],
  }),
  lines: many(purchaseInvoiceLines),
}));

export const purchaseInvoiceLinesRelations = relations(purchaseInvoiceLines, ({ one }) => ({
  purchaseInvoice: one(purchaseInvoices, {
    fields: [purchaseInvoiceLines.purchaseInvoiceId],
    references: [purchaseInvoices.id],
  }),
  item: one(items, {
    fields: [purchaseInvoiceLines.itemId],
    references: [items.id],
  }),
}));

// ── Quotations ───────────────────────────────────────────

export const quotationsRelations = relations(quotations, ({ one, many }) => ({
  party: one(contacts, {
    fields: [quotations.partyId],
    references: [contacts.id],
  }),
  lines: many(quotationLines),
}));

export const quotationLinesRelations = relations(quotationLines, ({ one }) => ({
  quotation: one(quotations, {
    fields: [quotationLines.quotationId],
    references: [quotations.id],
  }),
  item: one(items, {
    fields: [quotationLines.itemId],
    references: [items.id],
  }),
}));

// ── Doc Postings ─────────────────────────────────────────

export const docPostingsRelations = relations(docPostings, ({ one }) => ({
  reversalPosting: one(docPostings, {
    fields: [docPostings.reversalPostingId],
    references: [docPostings.id],
    relationName: 'postingReversal',
  }),
}));
