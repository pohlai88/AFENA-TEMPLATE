import { relations } from 'drizzle-orm';

import { bankAccounts } from './bank-accounts';
import { bankMatchingRules } from './bank-matching-rules';
import { deliveryNoteLines } from './delivery-note-lines';
import { deliveryNotes } from './delivery-notes';
import { dunningNotices } from './dunning-notices';
import { dunningRuns } from './dunning-runs';
import { openingBalanceBatches } from './opening-balance-batches';
import { openingBalanceLines } from './opening-balance-lines';
import { paymentMethodAccounts } from './payment-method-accounts';
import { paymentMethods } from './payment-methods';
import { paymentTermsTemplateDetails } from './payment-terms-template-details';
import { paymentTermsTemplates } from './payment-terms-templates';
import { payments } from './payments';
import { r2Files } from './r2-files';
import { users } from './users';

export const usersRelations = relations(users, ({ many }) => ({
  r2Files: many(r2Files),
}));

export const r2FilesRelations = relations(r2Files, ({ one }) => ({
  user: one(users, {
    fields: [r2Files.userId],
    references: [users.userId],
  }),
}));

export const deliveryNotesRelations = relations(deliveryNotes, ({ many }) => ({
  lines: many(deliveryNoteLines),
}));

export const deliveryNoteLinesRelations = relations(deliveryNoteLines, ({ one }) => ({
  deliveryNote: one(deliveryNotes, {
    fields: [deliveryNoteLines.deliveryNoteId, deliveryNoteLines.orgId],
    references: [deliveryNotes.id, deliveryNotes.orgId],
  }),
}));

// ── Finance Domain: ERPNext Gap Closure (v3.2) ─────────────────────────

// bank_accounts → payments, bank_matching_rules
export const bankAccountsRelations = relations(bankAccounts, ({ many }) => ({
  payments: many(payments),
  matchingRules: many(bankMatchingRules),
}));

// payments → bank_accounts, payment_methods
export const paymentsRelations = relations(payments, ({ one }) => ({
  bankAccount: one(bankAccounts, {
    fields: [payments.bankAccountId, payments.orgId],
    references: [bankAccounts.id, bankAccounts.orgId],
  }),
  paymentMethod: one(paymentMethods, {
    fields: [payments.paymentMethodId, payments.orgId],
    references: [paymentMethods.id, paymentMethods.orgId],
  }),
}));

// payment_methods → payment_method_accounts, payments
export const paymentMethodsRelations = relations(paymentMethods, ({ many }) => ({
  accounts: many(paymentMethodAccounts),
  payments: many(payments),
}));

// payment_method_accounts → payment_methods
export const paymentMethodAccountsRelations = relations(paymentMethodAccounts, ({ one }) => ({
  paymentMethod: one(paymentMethods, {
    fields: [paymentMethodAccounts.paymentMethodId, paymentMethodAccounts.orgId],
    references: [paymentMethods.id, paymentMethods.orgId],
  }),
}));

// payment_terms_templates → payment_terms_template_details
export const paymentTermsTemplatesRelations = relations(paymentTermsTemplates, ({ many }) => ({
  details: many(paymentTermsTemplateDetails),
}));

// payment_terms_template_details → payment_terms_templates
export const paymentTermsTemplateDetailsRelations = relations(
  paymentTermsTemplateDetails,
  ({ one }) => ({
    template: one(paymentTermsTemplates, {
      fields: [paymentTermsTemplateDetails.templateId, paymentTermsTemplateDetails.orgId],
      references: [paymentTermsTemplates.id, paymentTermsTemplates.orgId],
    }),
  }),
);

// dunning_runs → dunning_notices
export const dunningRunsRelations = relations(dunningRuns, ({ many }) => ({
  notices: many(dunningNotices),
}));

// dunning_notices → dunning_runs
export const dunningNoticesRelations = relations(dunningNotices, ({ one }) => ({
  dunningRun: one(dunningRuns, {
    fields: [dunningNotices.dunningRunId, dunningNotices.orgId],
    references: [dunningRuns.id, dunningRuns.orgId],
  }),
}));

// bank_matching_rules → bank_accounts
export const bankMatchingRulesRelations = relations(bankMatchingRules, ({ one }) => ({
  bankAccount: one(bankAccounts, {
    fields: [bankMatchingRules.bankAccountId, bankMatchingRules.orgId],
    references: [bankAccounts.id, bankAccounts.orgId],
  }),
}));

// opening_balance_batches → opening_balance_lines
export const openingBalanceBatchesRelations = relations(openingBalanceBatches, ({ many }) => ({
  lines: many(openingBalanceLines),
}));

// opening_balance_lines → opening_balance_batches
export const openingBalanceLinesRelations = relations(openingBalanceLines, ({ one }) => ({
  batch: one(openingBalanceBatches, {
    fields: [openingBalanceLines.batchId, openingBalanceLines.orgId],
    references: [openingBalanceBatches.id, openingBalanceBatches.orgId],
  }),
}));
