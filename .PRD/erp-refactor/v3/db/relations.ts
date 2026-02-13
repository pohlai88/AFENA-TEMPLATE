import { relations } from 'drizzle-orm';
import { account, accountCategory, accountClosingBalance, accountingDimension, accountingDimensionDetail, accountingDimensionFilter, accountingPeriod, accountsSettings, activityCost, activityType, advancePaymentLedgerEntry, advanceTaxesAndCharges, allowedDimension, allowedToTransactWith, applicableOnAccount, appointment, appointmentBookingSettings, appointmentBookingSlots, asset, assetActivity, assetCapitalization, assetCapitalizationAssetItem, assetCapitalizationServiceItem, assetCapitalizationStockItem, assetCategory, assetCategoryAccount, assetDepreciationSchedule, assetFinanceBook, assetMaintenance, assetMaintenanceLog, assetMaintenanceTask, assetMaintenanceTeam, assetMovement, assetMovementItem, assetRepair, assetRepairConsumedItem, assetRepairPurchaseInvoice, assetShiftAllocation, assetShiftFactor, assetValueAdjustment, authorizationControl, authorizationRule, availabilityOfSlots, bank, bankAccount, bankAccountSubtype, bankAccountType, bankClearance, bankClearanceDetail, bankGuarantee, bankReconciliationTool, bankStatementImport, bankTransaction, bankTransactionMapping, bankTransactionPayments, batch, bin, bisectAccountingStatements, bisectNodes, blanketOrder, blanketOrderItem, bom, bomCreator, bomCreatorItem, bomExplosionItem, bomItem, bomOperation, bomScrapItem, bomUpdateBatch, bomUpdateLog, bomUpdateTool, bomWebsiteItem, bomWebsiteOperation, branch, brand, budget, budgetAccount, budgetDistribution, bulkTransactionLog, bulkTransactionLogDetail, buyingSettings, callLog, campaign, campaignEmailSchedule, campaignItem, cashierClosing, cashierClosingPayments, chartOfAccountsImporter, chequePrintTemplate, closedDocument, codeList, commonCode, communicationMedium, communicationMediumTimeslot, company, competitor, competitorDetail, contract, contractFulfilmentChecklist, contractTemplate, contractTemplateFulfilmentTerms, costCenter, costCenterAllocation, costCenterAllocationPercentage, couponCode, crmNote, crmSettings, currencyExchange, currencyExchangeSettings, currencyExchangeSettingsDetails, currencyExchangeSettingsResult, customer, customerCreditLimit, customerGroup, customerGroupItem, customerItem, customerNumberAtSupplier, customsTariffNumber, deliveryNote, deliveryNoteItem, deliveryScheduleItem, deliverySettings, deliveryStop, deliveryTrip, department, dependentTask, depreciationSchedule, designation, discountedInvoice, downtimeEntry, driver, drivingLicenseCategory, dunning, dunningLetterText, dunningType, emailCampaign, emailDigest, emailDigestRecipient, employee, employeeEducation, employeeExternalWorkHistory, employeeGroup, employeeGroupTable, employeeInternalWorkHistory, exchangeRateRevaluation, exchangeRateRevaluationAccount, financeBook, financialReportRow, financialReportTemplate, fiscalYear, fiscalYearCompany, glEntry, globalDefaults, holiday, holidayList, importSupplierInvoice, incomingCallHandlingSchedule, incomingCallSettings, incoterm, industryType, installationNote, installationNoteItem, inventoryDimension, invoiceDiscounting, issue, issuePriority, issueType, item, itemAlternative, itemAttribute, itemAttributeValue, itemBarcode, itemCustomerDetail, itemDefault, itemGroup, itemLeadTime, itemManufacturer, itemPrice, itemQualityInspectionParameter, itemReorder, itemSupplier, itemTax, itemTaxTemplate, itemTaxTemplateDetail, itemVariant, itemVariantAttribute, itemVariantSettings, itemWebsiteSpecification, itemWiseTaxDetail, jobCard, jobCardItem, jobCardOperation, jobCardScheduledTime, jobCardScrapItem, jobCardTimeLog, journalEntry, journalEntryAccount, journalEntryTemplate, journalEntryTemplateAccount, landedCostItem, landedCostPurchaseReceipt, landedCostTaxesAndCharges, landedCostVendorInvoice, landedCostVoucher, lead, ledgerHealth, ledgerHealthMonitor, ledgerHealthMonitorCompany, ledgerMerge, ledgerMergeAccounts, linkedLocation, location, lostReasonDetail, lowerDeductionCertificate, loyaltyPointEntry, loyaltyPointEntryRedemption, loyaltyProgram, loyaltyProgramCollection, maintenanceSchedule, maintenanceScheduleDetail, maintenanceScheduleItem, maintenanceTeamMember, maintenanceVisit, maintenanceVisitPurpose, manufacturer, manufacturingSettings, marketSegment, masterProductionSchedule, masterProductionScheduleItem, materialRequest, materialRequestItem, materialRequestPlanItem, modeOfPayment, modeOfPaymentAccount, monthlyDistribution, monthlyDistributionPercentage, nonConformance, openingInvoiceCreationTool, openingInvoiceCreationToolItem, operation, opportunity, opportunityItem, opportunityLostReason, opportunityLostReasonDetail, opportunityType, overduePayment, packedItem, packingSlip, packingSlipItem, partyAccount, partyLink, partySpecificItem, partyType, pauseSlaOnStatus, paymentEntry, paymentEntryDeduction, paymentEntryReference, paymentGatewayAccount, paymentLedgerEntry, paymentOrder, paymentOrderReference, paymentReconciliation, paymentReconciliationAllocation, paymentReconciliationInvoice, paymentReconciliationPayment, paymentRequest, paymentSchedule, paymentTerm, paymentTermsTemplate, paymentTermsTemplateDetail, peggedCurrencies, peggedCurrencyDetails, periodClosingVoucher, pickList, pickListItem, plaidSettings, plantFloor, portalUser, posClosingEntry, posClosingEntryDetail, posClosingEntryTaxes, posCustomerGroup, posField, posInvoice, posInvoiceItem, posInvoiceMergeLog, posInvoiceReference, posItemGroup, posOpeningEntry, posOpeningEntryDetail, posPaymentMethod, posProfile, posProfileUser, posSearchFields, posSettings, priceList, priceListCountry, pricingRule, pricingRuleBrand, pricingRuleDetail, pricingRuleItemCode, pricingRuleItemGroup, processDeferredAccounting, processPaymentReconciliation, processPaymentReconciliationLog, processPaymentReconciliationLogAllocations, processPeriodClosingVoucher, processPeriodClosingVoucherDetail, processStatementOfAccounts, processStatementOfAccountsCc, processStatementOfAccountsCustomer, processSubscription, productBundle, productBundleItem, productionPlan, productionPlanItem, productionPlanItemReference, productionPlanMaterialRequest, productionPlanMaterialRequestWarehouse, productionPlanSalesOrder, productionPlanSubAssemblyItem, project, projectTemplate, projectTemplateTask, projectType, projectUpdate, projectUser, projectsSettings, promotionalScheme, promotionalSchemePriceDiscount, promotionalSchemeProductDiscount, prospect, prospectLead, prospectOpportunity, psoaCostCenter, psoaProject, purchaseInvoice, purchaseInvoiceAdvance, purchaseInvoiceItem, purchaseOrder, purchaseOrderItem, purchaseOrderItemSupplied, purchaseReceipt, purchaseReceiptItem, purchaseReceiptItemSupplied, purchaseTaxesAndCharges, purchaseTaxesAndChargesTemplate, putawayRule, qualityAction, qualityActionResolution, qualityFeedback, qualityFeedbackParameter, qualityFeedbackTemplate, qualityFeedbackTemplateParameter, qualityGoal, qualityGoalObjective, qualityInspection, qualityInspectionParameter, qualityInspectionParameterGroup, qualityInspectionReading, qualityInspectionTemplate, qualityMeeting, qualityMeetingAgenda, qualityMeetingMinutes, qualityProcedure, qualityProcedureProcess, qualityReview, qualityReviewObjective, quickStockBalance, quotation, quotationItem, quotationLostReason, quotationLostReasonDetail, renameTool, repostAccountingLedger, repostAccountingLedgerItems, repostAccountingLedgerSettings, repostAllowedTypes, repostItemValuation, repostPaymentLedger, repostPaymentLedgerItems, requestForQuotation, requestForQuotationItem, requestForQuotationSupplier, routing, salesForecast, salesForecastItem, salesInvoice, salesInvoiceAdvance, salesInvoiceItem, salesInvoicePayment, salesInvoiceReference, salesInvoiceTimesheet, salesOrder, salesOrderItem, salesPartner, salesPartnerItem, salesPartnerType, salesPerson, salesStage, salesTaxesAndCharges, salesTaxesAndChargesTemplate, salesTeam, sellingSettings, serialAndBatchBundle, serialAndBatchEntry, serialNo, serviceDay, serviceLevelAgreement, serviceLevelPriority, shareBalance, shareTransfer, shareType, shareholder, shipment, shipmentDeliveryNote, shipmentParcel, shipmentParcelTemplate, shippingRule, shippingRuleCondition, shippingRuleCountry, slaFulfilledOnStatus, smsCenter, southAfricaVatAccount, southAfricaVatSettings, stockClosingBalance, stockClosingEntry, stockEntry, stockEntryDetail, stockEntryType, stockLedgerEntry, stockReconciliation, stockReconciliationItem, stockRepostingSettings, stockReservationEntry, stockSettings, subOperation, subcontractingBom, subcontractingInwardOrder, subcontractingInwardOrderItem, subcontractingInwardOrderReceivedItem, subcontractingInwardOrderScrapItem, subcontractingInwardOrderServiceItem, subcontractingOrder, subcontractingOrderItem, subcontractingOrderServiceItem, subcontractingOrderSuppliedItem, subcontractingReceipt, subcontractingReceiptItem, subcontractingReceiptSuppliedItem, subscription, subscriptionInvoice, subscriptionPlan, subscriptionPlanDetail, subscriptionSettings, supplier, supplierGroup, supplierGroupItem, supplierItem, supplierNumberAtCustomer, supplierQuotation, supplierQuotationItem, supplierScorecard, supplierScorecardCriteria, supplierScorecardPeriod, supplierScorecardScoringCriteria, supplierScorecardScoringStanding, supplierScorecardScoringVariable, supplierScorecardStanding, supplierScorecardVariable, supportSearchSource, supportSettings, targetDetail, task, taskDependsOn, taskType, taxCategory, taxRule, taxWithholdingAccount, taxWithholdingCategory, taxWithholdingEntry, taxWithholdingGroup, taxWithholdingRate, telephonyCallType, termsAndConditions, territory, territoryItem, timesheet, timesheetDetail, transactionDeletionRecord, transactionDeletionRecordDetails, transactionDeletionRecordItem, transactionDeletionRecordToDelete, uaeVatAccount, uaeVatSettings, unreconcilePayment, unreconcilePaymentEntries, uom, uomCategory, uomConversionDetail, uomConversionFactor, variantField, vehicle, video, videoSettings, voiceCallSettings, warehouse, warehouseType, warrantyClaim, websiteAttribute, websiteFilterField, websiteItemGroup, workOrder, workOrderItem, workOrderOperation, workstation, workstationCost, workstationOperatingComponent, workstationOperatingComponentAccount, workstationType, workstationWorkingHour } from './schema.js';

export const accountRelations = relations(account, ({ one }) => ({
  company: one(company, { fields: [account.company], references: [company.id] }),
  parentAccount: one(account, { fields: [account.parent_account], references: [account.id] }),
  accountCategory: one(accountCategory, { fields: [account.account_category], references: [accountCategory.id] }),
}));

export const accountClosingBalanceRelations = relations(accountClosingBalance, ({ one }) => ({
  account: one(account, { fields: [accountClosingBalance.account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [accountClosingBalance.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [accountClosingBalance.project], references: [project.id] }),
  company: one(company, { fields: [accountClosingBalance.company], references: [company.id] }),
  financeBook: one(financeBook, { fields: [accountClosingBalance.finance_book], references: [financeBook.id] }),
  periodClosingVoucher: one(periodClosingVoucher, { fields: [accountClosingBalance.period_closing_voucher], references: [periodClosingVoucher.id] }),
}));

export const accountingDimensionRelations = relations(accountingDimension, ({ many }) => ({
  dimensionDefaults: many(accountingDimensionDetail),
}));

export const accountingDimensionDetailRelations = relations(accountingDimensionDetail, ({ one }) => ({
  company: one(company, { fields: [accountingDimensionDetail.company], references: [company.id] }),
  offsettingAccount: one(account, { fields: [accountingDimensionDetail.offsetting_account], references: [account.id] }),
}));

export const accountingDimensionFilterRelations = relations(accountingDimensionFilter, ({ one, many }) => ({
  company: one(company, { fields: [accountingDimensionFilter.company], references: [company.id] }),
  accounts: many(applicableOnAccount),
  dimensions: many(allowedDimension),
}));

export const accountingPeriodRelations = relations(accountingPeriod, ({ one, many }) => ({
  company: one(company, { fields: [accountingPeriod.company], references: [company.id] }),
  closedDocuments: many(closedDocument),
}));

export const advancePaymentLedgerEntryRelations = relations(advancePaymentLedgerEntry, ({ one }) => ({
  company: one(company, { fields: [advancePaymentLedgerEntry.company], references: [company.id] }),
}));

export const advanceTaxesAndChargesRelations = relations(advanceTaxesAndCharges, ({ one }) => ({
  accountHead: one(account, { fields: [advanceTaxesAndCharges.account_head], references: [account.id] }),
  costCenter: one(costCenter, { fields: [advanceTaxesAndCharges.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [advanceTaxesAndCharges.project], references: [project.id] }),
}));

export const allowedToTransactWithRelations = relations(allowedToTransactWith, ({ one }) => ({
  company: one(company, { fields: [allowedToTransactWith.company], references: [company.id] }),
}));

export const applicableOnAccountRelations = relations(applicableOnAccount, ({ one }) => ({
  applicableOnAccount: one(account, { fields: [applicableOnAccount.applicable_on_account], references: [account.id] }),
}));

export const bankRelations = relations(bank, ({ many }) => ({
  bankTransactionMapping: many(bankTransactionMapping),
}));

export const bankAccountRelations = relations(bankAccount, ({ one }) => ({
  account: one(account, { fields: [bankAccount.account], references: [account.id] }),
  bank: one(bank, { fields: [bankAccount.bank], references: [bank.id] }),
  accountType: one(bankAccountType, { fields: [bankAccount.account_type], references: [bankAccountType.id] }),
  accountSubtype: one(bankAccountSubtype, { fields: [bankAccount.account_subtype], references: [bankAccountSubtype.id] }),
  company: one(company, { fields: [bankAccount.company], references: [company.id] }),
}));

export const bankClearanceRelations = relations(bankClearance, ({ one, many }) => ({
  account: one(account, { fields: [bankClearance.account], references: [account.id] }),
  bankAccount: one(bankAccount, { fields: [bankClearance.bank_account], references: [bankAccount.id] }),
  paymentEntries: many(bankClearanceDetail),
}));

export const bankGuaranteeRelations = relations(bankGuarantee, ({ one }) => ({
  customer: one(customer, { fields: [bankGuarantee.customer], references: [customer.id] }),
  supplier: one(supplier, { fields: [bankGuarantee.supplier], references: [supplier.id] }),
  project: one(project, { fields: [bankGuarantee.project], references: [project.id] }),
  bank: one(bank, { fields: [bankGuarantee.bank], references: [bank.id] }),
  bankAccount: one(bankAccount, { fields: [bankGuarantee.bank_account], references: [bankAccount.id] }),
  account: one(account, { fields: [bankGuarantee.account], references: [account.id] }),
  amendedFrom: one(bankGuarantee, { fields: [bankGuarantee.amended_from], references: [bankGuarantee.id] }),
}));

export const bankReconciliationToolRelations = relations(bankReconciliationTool, ({ one }) => ({
  company: one(company, { fields: [bankReconciliationTool.company], references: [company.id] }),
  bankAccount: one(bankAccount, { fields: [bankReconciliationTool.bank_account], references: [bankAccount.id] }),
}));

export const bankStatementImportRelations = relations(bankStatementImport, ({ one }) => ({
  company: one(company, { fields: [bankStatementImport.company], references: [company.id] }),
  bankAccount: one(bankAccount, { fields: [bankStatementImport.bank_account], references: [bankAccount.id] }),
  bank: one(bank, { fields: [bankStatementImport.bank], references: [bank.id] }),
}));

export const bankTransactionRelations = relations(bankTransaction, ({ one, many }) => ({
  bankAccount: one(bankAccount, { fields: [bankTransaction.bank_account], references: [bankAccount.id] }),
  company: one(company, { fields: [bankTransaction.company], references: [company.id] }),
  amendedFrom: one(bankTransaction, { fields: [bankTransaction.amended_from], references: [bankTransaction.id] }),
  paymentEntries: many(bankTransactionPayments),
}));

export const bisectAccountingStatementsRelations = relations(bisectAccountingStatements, ({ one }) => ({
  company: one(company, { fields: [bisectAccountingStatements.company], references: [company.id] }),
  currentNode: one(bisectNodes, { fields: [bisectAccountingStatements.current_node], references: [bisectNodes.id] }),
}));

export const bisectNodesRelations = relations(bisectNodes, ({ one }) => ({
  root: one(bisectNodes, { fields: [bisectNodes.root], references: [bisectNodes.id] }),
  leftChild: one(bisectNodes, { fields: [bisectNodes.left_child], references: [bisectNodes.id] }),
  rightChild: one(bisectNodes, { fields: [bisectNodes.right_child], references: [bisectNodes.id] }),
}));

export const budgetRelations = relations(budget, ({ one, many }) => ({
  company: one(company, { fields: [budget.company], references: [company.id] }),
  costCenter: one(costCenter, { fields: [budget.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [budget.project], references: [project.id] }),
  account: one(account, { fields: [budget.account], references: [account.id] }),
  amendedFrom: one(budget, { fields: [budget.amended_from], references: [budget.id] }),
  fromFiscalYear: one(fiscalYear, { fields: [budget.from_fiscal_year], references: [fiscalYear.id] }),
  toFiscalYear: one(fiscalYear, { fields: [budget.to_fiscal_year], references: [fiscalYear.id] }),
  budgetDistribution: many(budgetDistribution),
}));

export const budgetAccountRelations = relations(budgetAccount, ({ one }) => ({
  account: one(account, { fields: [budgetAccount.account], references: [account.id] }),
}));

export const cashierClosingRelations = relations(cashierClosing, ({ one, many }) => ({
  amendedFrom: one(cashierClosing, { fields: [cashierClosing.amended_from], references: [cashierClosing.id] }),
  payments: many(cashierClosingPayments),
}));

export const cashierClosingPaymentsRelations = relations(cashierClosingPayments, ({ one }) => ({
  modeOfPayment: one(modeOfPayment, { fields: [cashierClosingPayments.mode_of_payment], references: [modeOfPayment.id] }),
}));

export const chartOfAccountsImporterRelations = relations(chartOfAccountsImporter, ({ one }) => ({
  company: one(company, { fields: [chartOfAccountsImporter.company], references: [company.id] }),
}));

export const costCenterRelations = relations(costCenter, ({ one }) => ({
  parentCostCenter: one(costCenter, { fields: [costCenter.parent_cost_center], references: [costCenter.id] }),
  company: one(company, { fields: [costCenter.company], references: [company.id] }),
  oldParent: one(costCenter, { fields: [costCenter.old_parent], references: [costCenter.id] }),
}));

export const costCenterAllocationRelations = relations(costCenterAllocation, ({ one, many }) => ({
  mainCostCenter: one(costCenter, { fields: [costCenterAllocation.main_cost_center], references: [costCenter.id] }),
  company: one(company, { fields: [costCenterAllocation.company], references: [company.id] }),
  amendedFrom: one(costCenterAllocation, { fields: [costCenterAllocation.amended_from], references: [costCenterAllocation.id] }),
  allocationPercentages: many(costCenterAllocationPercentage),
}));

export const costCenterAllocationPercentageRelations = relations(costCenterAllocationPercentage, ({ one }) => ({
  costCenter: one(costCenter, { fields: [costCenterAllocationPercentage.cost_center], references: [costCenter.id] }),
}));

export const couponCodeRelations = relations(couponCode, ({ one }) => ({
  customer: one(customer, { fields: [couponCode.customer], references: [customer.id] }),
  pricingRule: one(pricingRule, { fields: [couponCode.pricing_rule], references: [pricingRule.id] }),
  amendedFrom: one(couponCode, { fields: [couponCode.amended_from], references: [couponCode.id] }),
}));

export const currencyExchangeSettingsRelations = relations(currencyExchangeSettings, ({ many }) => ({
  reqParams: many(currencyExchangeSettingsDetails),
  resultKey: many(currencyExchangeSettingsResult),
}));

export const customerGroupItemRelations = relations(customerGroupItem, ({ one }) => ({
  customerGroup: one(customerGroup, { fields: [customerGroupItem.customer_group], references: [customerGroup.id] }),
}));

export const customerItemRelations = relations(customerItem, ({ one }) => ({
  customer: one(customer, { fields: [customerItem.customer], references: [customer.id] }),
}));

export const discountedInvoiceRelations = relations(discountedInvoice, ({ one }) => ({
  salesInvoice: one(salesInvoice, { fields: [discountedInvoice.sales_invoice], references: [salesInvoice.id] }),
  customer: one(customer, { fields: [discountedInvoice.customer], references: [customer.id] }),
  debitTo: one(account, { fields: [discountedInvoice.debit_to], references: [account.id] }),
}));

export const dunningRelations = relations(dunning, ({ one, many }) => ({
  customer: one(customer, { fields: [dunning.customer], references: [customer.id] }),
  company: one(company, { fields: [dunning.company], references: [company.id] }),
  dunningType: one(dunningType, { fields: [dunning.dunning_type], references: [dunningType.id] }),
  incomeAccount: one(account, { fields: [dunning.income_account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [dunning.cost_center], references: [costCenter.id] }),
  amendedFrom: one(dunning, { fields: [dunning.amended_from], references: [dunning.id] }),
  overduePayments: many(overduePayment),
}));

export const dunningTypeRelations = relations(dunningType, ({ one, many }) => ({
  company: one(company, { fields: [dunningType.company], references: [company.id] }),
  incomeAccount: one(account, { fields: [dunningType.income_account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [dunningType.cost_center], references: [costCenter.id] }),
  dunningLetterText: many(dunningLetterText),
}));

export const exchangeRateRevaluationRelations = relations(exchangeRateRevaluation, ({ one, many }) => ({
  company: one(company, { fields: [exchangeRateRevaluation.company], references: [company.id] }),
  amendedFrom: one(exchangeRateRevaluation, { fields: [exchangeRateRevaluation.amended_from], references: [exchangeRateRevaluation.id] }),
  accounts: many(exchangeRateRevaluationAccount),
}));

export const exchangeRateRevaluationAccountRelations = relations(exchangeRateRevaluationAccount, ({ one }) => ({
  account: one(account, { fields: [exchangeRateRevaluationAccount.account], references: [account.id] }),
}));

export const financialReportTemplateRelations = relations(financialReportTemplate, ({ many }) => ({
  rows: many(financialReportRow),
}));

export const fiscalYearRelations = relations(fiscalYear, ({ many }) => ({
  companies: many(fiscalYearCompany),
}));

export const fiscalYearCompanyRelations = relations(fiscalYearCompany, ({ one }) => ({
  company: one(company, { fields: [fiscalYearCompany.company], references: [company.id] }),
}));

export const glEntryRelations = relations(glEntry, ({ one }) => ({
  fiscalYear: one(fiscalYear, { fields: [glEntry.fiscal_year], references: [fiscalYear.id] }),
  account: one(account, { fields: [glEntry.account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [glEntry.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [glEntry.project], references: [project.id] }),
  financeBook: one(financeBook, { fields: [glEntry.finance_book], references: [financeBook.id] }),
  company: one(company, { fields: [glEntry.company], references: [company.id] }),
}));

export const invoiceDiscountingRelations = relations(invoiceDiscounting, ({ one, many }) => ({
  company: one(company, { fields: [invoiceDiscounting.company], references: [company.id] }),
  shortTermLoan: one(account, { fields: [invoiceDiscounting.short_term_loan], references: [account.id] }),
  bankAccount: one(account, { fields: [invoiceDiscounting.bank_account], references: [account.id] }),
  bankChargesAccount: one(account, { fields: [invoiceDiscounting.bank_charges_account], references: [account.id] }),
  accountsReceivableCredit: one(account, { fields: [invoiceDiscounting.accounts_receivable_credit], references: [account.id] }),
  accountsReceivableDiscounted: one(account, { fields: [invoiceDiscounting.accounts_receivable_discounted], references: [account.id] }),
  accountsReceivableUnpaid: one(account, { fields: [invoiceDiscounting.accounts_receivable_unpaid], references: [account.id] }),
  amendedFrom: one(invoiceDiscounting, { fields: [invoiceDiscounting.amended_from], references: [invoiceDiscounting.id] }),
  invoices: many(discountedInvoice),
}));

export const itemTaxTemplateRelations = relations(itemTaxTemplate, ({ one, many }) => ({
  company: one(company, { fields: [itemTaxTemplate.company], references: [company.id] }),
  taxes: many(itemTaxTemplateDetail),
}));

export const itemTaxTemplateDetailRelations = relations(itemTaxTemplateDetail, ({ one }) => ({
  taxType: one(account, { fields: [itemTaxTemplateDetail.tax_type], references: [account.id] }),
}));

export const journalEntryRelations = relations(journalEntry, ({ one, many }) => ({
  company: one(company, { fields: [journalEntry.company], references: [company.id] }),
  processDeferredAccounting: one(processDeferredAccounting, { fields: [journalEntry.process_deferred_accounting], references: [processDeferredAccounting.id] }),
  reversalOf: one(journalEntry, { fields: [journalEntry.reversal_of], references: [journalEntry.id] }),
  fromTemplate: one(journalEntryTemplate, { fields: [journalEntry.from_template], references: [journalEntryTemplate.id] }),
  financeBook: one(financeBook, { fields: [journalEntry.finance_book], references: [financeBook.id] }),
  taxWithholdingCategory: one(taxWithholdingCategory, { fields: [journalEntry.tax_withholding_category], references: [taxWithholdingCategory.id] }),
  stockAssetAccount: one(account, { fields: [journalEntry.stock_asset_account], references: [account.id] }),
  periodicEntryDifferenceAccount: one(account, { fields: [journalEntry.periodic_entry_difference_account], references: [account.id] }),
  taxWithholdingGroup: one(taxWithholdingGroup, { fields: [journalEntry.tax_withholding_group], references: [taxWithholdingGroup.id] }),
  interCompanyJournalEntryReference: one(journalEntry, { fields: [journalEntry.inter_company_journal_entry_reference], references: [journalEntry.id] }),
  modeOfPayment: one(modeOfPayment, { fields: [journalEntry.mode_of_payment], references: [modeOfPayment.id] }),
  paymentOrder: one(paymentOrder, { fields: [journalEntry.payment_order], references: [paymentOrder.id] }),
  stockEntry: one(stockEntry, { fields: [journalEntry.stock_entry], references: [stockEntry.id] }),
  amendedFrom: one(journalEntry, { fields: [journalEntry.amended_from], references: [journalEntry.id] }),
  accounts: many(journalEntryAccount),
  taxWithholdingEntries: many(taxWithholdingEntry),
}));

export const journalEntryAccountRelations = relations(journalEntryAccount, ({ one }) => ({
  account: one(account, { fields: [journalEntryAccount.account], references: [account.id] }),
  bankAccount: one(bankAccount, { fields: [journalEntryAccount.bank_account], references: [bankAccount.id] }),
  costCenter: one(costCenter, { fields: [journalEntryAccount.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [journalEntryAccount.project], references: [project.id] }),
}));

export const journalEntryTemplateRelations = relations(journalEntryTemplate, ({ one, many }) => ({
  company: one(company, { fields: [journalEntryTemplate.company], references: [company.id] }),
  accounts: many(journalEntryTemplateAccount),
}));

export const journalEntryTemplateAccountRelations = relations(journalEntryTemplateAccount, ({ one }) => ({
  account: one(account, { fields: [journalEntryTemplateAccount.account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [journalEntryTemplateAccount.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [journalEntryTemplateAccount.project], references: [project.id] }),
}));

export const ledgerHealthMonitorRelations = relations(ledgerHealthMonitor, ({ many }) => ({
  companies: many(ledgerHealthMonitorCompany),
}));

export const ledgerHealthMonitorCompanyRelations = relations(ledgerHealthMonitorCompany, ({ one }) => ({
  company: one(company, { fields: [ledgerHealthMonitorCompany.company], references: [company.id] }),
}));

export const ledgerMergeRelations = relations(ledgerMerge, ({ one, many }) => ({
  account: one(account, { fields: [ledgerMerge.account], references: [account.id] }),
  company: one(company, { fields: [ledgerMerge.company], references: [company.id] }),
  mergeAccounts: many(ledgerMergeAccounts),
}));

export const ledgerMergeAccountsRelations = relations(ledgerMergeAccounts, ({ one }) => ({
  account: one(account, { fields: [ledgerMergeAccounts.account], references: [account.id] }),
}));

export const loyaltyPointEntryRelations = relations(loyaltyPointEntry, ({ one }) => ({
  loyaltyProgram: one(loyaltyProgram, { fields: [loyaltyPointEntry.loyalty_program], references: [loyaltyProgram.id] }),
  customer: one(customer, { fields: [loyaltyPointEntry.customer], references: [customer.id] }),
  redeemAgainst: one(loyaltyPointEntry, { fields: [loyaltyPointEntry.redeem_against], references: [loyaltyPointEntry.id] }),
  company: one(company, { fields: [loyaltyPointEntry.company], references: [company.id] }),
}));

export const loyaltyProgramRelations = relations(loyaltyProgram, ({ one, many }) => ({
  customerGroup: one(customerGroup, { fields: [loyaltyProgram.customer_group], references: [customerGroup.id] }),
  customerTerritory: one(territory, { fields: [loyaltyProgram.customer_territory], references: [territory.id] }),
  expenseAccount: one(account, { fields: [loyaltyProgram.expense_account], references: [account.id] }),
  company: one(company, { fields: [loyaltyProgram.company], references: [company.id] }),
  costCenter: one(costCenter, { fields: [loyaltyProgram.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [loyaltyProgram.project], references: [project.id] }),
  collectionRules: many(loyaltyProgramCollection),
}));

export const modeOfPaymentRelations = relations(modeOfPayment, ({ many }) => ({
  accounts: many(modeOfPaymentAccount),
}));

export const modeOfPaymentAccountRelations = relations(modeOfPaymentAccount, ({ one }) => ({
  company: one(company, { fields: [modeOfPaymentAccount.company], references: [company.id] }),
  defaultAccount: one(account, { fields: [modeOfPaymentAccount.default_account], references: [account.id] }),
}));

export const monthlyDistributionRelations = relations(monthlyDistribution, ({ one, many }) => ({
  fiscalYear: one(fiscalYear, { fields: [monthlyDistribution.fiscal_year], references: [fiscalYear.id] }),
  percentages: many(monthlyDistributionPercentage),
}));

export const openingInvoiceCreationToolRelations = relations(openingInvoiceCreationTool, ({ one, many }) => ({
  company: one(company, { fields: [openingInvoiceCreationTool.company], references: [company.id] }),
  costCenter: one(costCenter, { fields: [openingInvoiceCreationTool.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [openingInvoiceCreationTool.project], references: [project.id] }),
  invoices: many(openingInvoiceCreationToolItem),
}));

export const openingInvoiceCreationToolItemRelations = relations(openingInvoiceCreationToolItem, ({ one }) => ({
  temporaryOpeningAccount: one(account, { fields: [openingInvoiceCreationToolItem.temporary_opening_account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [openingInvoiceCreationToolItem.cost_center], references: [costCenter.id] }),
}));

export const overduePaymentRelations = relations(overduePayment, ({ one }) => ({
  salesInvoice: one(salesInvoice, { fields: [overduePayment.sales_invoice], references: [salesInvoice.id] }),
  paymentTerm: one(paymentTerm, { fields: [overduePayment.payment_term], references: [paymentTerm.id] }),
  modeOfPayment: one(modeOfPayment, { fields: [overduePayment.mode_of_payment], references: [modeOfPayment.id] }),
}));

export const posClosingEntryRelations = relations(posClosingEntry, ({ one, many }) => ({
  posOpeningEntry: one(posOpeningEntry, { fields: [posClosingEntry.pos_opening_entry], references: [posOpeningEntry.id] }),
  company: one(company, { fields: [posClosingEntry.company], references: [company.id] }),
  posProfile: one(posProfile, { fields: [posClosingEntry.pos_profile], references: [posProfile.id] }),
  amendedFrom: one(posClosingEntry, { fields: [posClosingEntry.amended_from], references: [posClosingEntry.id] }),
  paymentReconciliation: many(posClosingEntryDetail),
  taxes: many(posClosingEntryTaxes),
  posInvoices: many(posInvoiceReference),
  salesInvoices: many(salesInvoiceReference),
}));

export const posClosingEntryDetailRelations = relations(posClosingEntryDetail, ({ one }) => ({
  modeOfPayment: one(modeOfPayment, { fields: [posClosingEntryDetail.mode_of_payment], references: [modeOfPayment.id] }),
}));

export const posClosingEntryTaxesRelations = relations(posClosingEntryTaxes, ({ one }) => ({
  accountHead: one(account, { fields: [posClosingEntryTaxes.account_head], references: [account.id] }),
}));

export const posCustomerGroupRelations = relations(posCustomerGroup, ({ one }) => ({
  customerGroup: one(customerGroup, { fields: [posCustomerGroup.customer_group], references: [customerGroup.id] }),
}));

export const posInvoiceRelations = relations(posInvoice, ({ one, many }) => ({
  customer: one(customer, { fields: [posInvoice.customer], references: [customer.id] }),
  posProfile: one(posProfile, { fields: [posInvoice.pos_profile], references: [posProfile.id] }),
  consolidatedInvoice: one(salesInvoice, { fields: [posInvoice.consolidated_invoice], references: [salesInvoice.id] }),
  company: one(company, { fields: [posInvoice.company], references: [company.id] }),
  amendedFrom: one(posInvoice, { fields: [posInvoice.amended_from], references: [posInvoice.id] }),
  returnAgainst: one(posInvoice, { fields: [posInvoice.return_against], references: [posInvoice.id] }),
  project: one(project, { fields: [posInvoice.project], references: [project.id] }),
  costCenter: one(costCenter, { fields: [posInvoice.cost_center], references: [costCenter.id] }),
  sellingPriceList: one(priceList, { fields: [posInvoice.selling_price_list], references: [priceList.id] }),
  setWarehouse: one(warehouse, { fields: [posInvoice.set_warehouse], references: [warehouse.id] }),
  taxesAndCharges: one(salesTaxesAndChargesTemplate, { fields: [posInvoice.taxes_and_charges], references: [salesTaxesAndChargesTemplate.id] }),
  shippingRule: one(shippingRule, { fields: [posInvoice.shipping_rule], references: [shippingRule.id] }),
  taxCategory: one(taxCategory, { fields: [posInvoice.tax_category], references: [taxCategory.id] }),
  couponCode: one(couponCode, { fields: [posInvoice.coupon_code], references: [couponCode.id] }),
  cashBankAccount: one(account, { fields: [posInvoice.cash_bank_account], references: [account.id] }),
  accountForChangeAmount: one(account, { fields: [posInvoice.account_for_change_amount], references: [account.id] }),
  writeOffAccount: one(account, { fields: [posInvoice.write_off_account], references: [account.id] }),
  writeOffCostCenter: one(costCenter, { fields: [posInvoice.write_off_cost_center], references: [costCenter.id] }),
  loyaltyProgram: one(loyaltyProgram, { fields: [posInvoice.loyalty_program], references: [loyaltyProgram.id] }),
  loyaltyRedemptionAccount: one(account, { fields: [posInvoice.loyalty_redemption_account], references: [account.id] }),
  loyaltyRedemptionCostCenter: one(costCenter, { fields: [posInvoice.loyalty_redemption_cost_center], references: [costCenter.id] }),
  territory: one(territory, { fields: [posInvoice.territory], references: [territory.id] }),
  paymentTermsTemplate: one(paymentTermsTemplate, { fields: [posInvoice.payment_terms_template], references: [paymentTermsTemplate.id] }),
  tcName: one(termsAndConditions, { fields: [posInvoice.tc_name], references: [termsAndConditions.id] }),
  interCompanyInvoiceReference: one(purchaseInvoice, { fields: [posInvoice.inter_company_invoice_reference], references: [purchaseInvoice.id] }),
  customerGroup: one(customerGroup, { fields: [posInvoice.customer_group], references: [customerGroup.id] }),
  debitTo: one(account, { fields: [posInvoice.debit_to], references: [account.id] }),
  salesPartner: one(salesPartner, { fields: [posInvoice.sales_partner], references: [salesPartner.id] }),
  items: many(posInvoiceItem),
  pricingRules: many(pricingRuleDetail),
  packedItems: many(packedItem),
  timesheets: many(salesInvoiceTimesheet),
  taxes: many(salesTaxesAndCharges),
  advances: many(salesInvoiceAdvance),
  paymentSchedule: many(paymentSchedule),
  payments: many(salesInvoicePayment),
  salesTeam: many(salesTeam),
  itemWiseTaxDetails: many(itemWiseTaxDetail),
}));

export const posInvoiceItemRelations = relations(posInvoiceItem, ({ one }) => ({
  itemCode: one(item, { fields: [posInvoiceItem.item_code], references: [item.id] }),
  itemGroup: one(itemGroup, { fields: [posInvoiceItem.item_group], references: [itemGroup.id] }),
  stockUom: one(uom, { fields: [posInvoiceItem.stock_uom], references: [uom.id] }),
  uom: one(uom, { fields: [posInvoiceItem.uom], references: [uom.id] }),
  itemTaxTemplate: one(itemTaxTemplate, { fields: [posInvoiceItem.item_tax_template], references: [itemTaxTemplate.id] }),
  incomeAccount: one(account, { fields: [posInvoiceItem.income_account], references: [account.id] }),
  asset: one(asset, { fields: [posInvoiceItem.asset], references: [asset.id] }),
  financeBook: one(financeBook, { fields: [posInvoiceItem.finance_book], references: [financeBook.id] }),
  expenseAccount: one(account, { fields: [posInvoiceItem.expense_account], references: [account.id] }),
  deferredRevenueAccount: one(account, { fields: [posInvoiceItem.deferred_revenue_account], references: [account.id] }),
  weightUom: one(uom, { fields: [posInvoiceItem.weight_uom], references: [uom.id] }),
  warehouse: one(warehouse, { fields: [posInvoiceItem.warehouse], references: [warehouse.id] }),
  targetWarehouse: one(warehouse, { fields: [posInvoiceItem.target_warehouse], references: [warehouse.id] }),
  qualityInspection: one(qualityInspection, { fields: [posInvoiceItem.quality_inspection], references: [qualityInspection.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [posInvoiceItem.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  batchNo: one(batch, { fields: [posInvoiceItem.batch_no], references: [batch.id] }),
  salesOrder: one(salesOrder, { fields: [posInvoiceItem.sales_order], references: [salesOrder.id] }),
  deliveryNote: one(deliveryNote, { fields: [posInvoiceItem.delivery_note], references: [deliveryNote.id] }),
  costCenter: one(costCenter, { fields: [posInvoiceItem.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [posInvoiceItem.project], references: [project.id] }),
}));

export const posInvoiceMergeLogRelations = relations(posInvoiceMergeLog, ({ one, many }) => ({
  company: one(company, { fields: [posInvoiceMergeLog.company], references: [company.id] }),
  posClosingEntry: one(posClosingEntry, { fields: [posInvoiceMergeLog.pos_closing_entry], references: [posClosingEntry.id] }),
  customer: one(customer, { fields: [posInvoiceMergeLog.customer], references: [customer.id] }),
  customerGroup: one(customerGroup, { fields: [posInvoiceMergeLog.customer_group], references: [customerGroup.id] }),
  consolidatedInvoice: one(salesInvoice, { fields: [posInvoiceMergeLog.consolidated_invoice], references: [salesInvoice.id] }),
  consolidatedCreditNote: one(salesInvoice, { fields: [posInvoiceMergeLog.consolidated_credit_note], references: [salesInvoice.id] }),
  amendedFrom: one(posInvoiceMergeLog, { fields: [posInvoiceMergeLog.amended_from], references: [posInvoiceMergeLog.id] }),
  posInvoices: many(posInvoiceReference),
}));

export const posInvoiceReferenceRelations = relations(posInvoiceReference, ({ one }) => ({
  posInvoice: one(posInvoice, { fields: [posInvoiceReference.pos_invoice], references: [posInvoice.id] }),
  customer: one(customer, { fields: [posInvoiceReference.customer], references: [customer.id] }),
  returnAgainst: one(posInvoice, { fields: [posInvoiceReference.return_against], references: [posInvoice.id] }),
}));

export const posItemGroupRelations = relations(posItemGroup, ({ one }) => ({
  itemGroup: one(itemGroup, { fields: [posItemGroup.item_group], references: [itemGroup.id] }),
}));

export const posOpeningEntryRelations = relations(posOpeningEntry, ({ one, many }) => ({
  company: one(company, { fields: [posOpeningEntry.company], references: [company.id] }),
  posProfile: one(posProfile, { fields: [posOpeningEntry.pos_profile], references: [posProfile.id] }),
  amendedFrom: one(posOpeningEntry, { fields: [posOpeningEntry.amended_from], references: [posOpeningEntry.id] }),
  balanceDetails: many(posOpeningEntryDetail),
}));

export const posOpeningEntryDetailRelations = relations(posOpeningEntryDetail, ({ one }) => ({
  modeOfPayment: one(modeOfPayment, { fields: [posOpeningEntryDetail.mode_of_payment], references: [modeOfPayment.id] }),
}));

export const posPaymentMethodRelations = relations(posPaymentMethod, ({ one }) => ({
  modeOfPayment: one(modeOfPayment, { fields: [posPaymentMethod.mode_of_payment], references: [modeOfPayment.id] }),
}));

export const posProfileRelations = relations(posProfile, ({ one, many }) => ({
  company: one(company, { fields: [posProfile.company], references: [company.id] }),
  customer: one(customer, { fields: [posProfile.customer], references: [customer.id] }),
  warehouse: one(warehouse, { fields: [posProfile.warehouse], references: [warehouse.id] }),
  sellingPriceList: one(priceList, { fields: [posProfile.selling_price_list], references: [priceList.id] }),
  writeOffAccount: one(account, { fields: [posProfile.write_off_account], references: [account.id] }),
  writeOffCostCenter: one(costCenter, { fields: [posProfile.write_off_cost_center], references: [costCenter.id] }),
  incomeAccount: one(account, { fields: [posProfile.income_account], references: [account.id] }),
  expenseAccount: one(account, { fields: [posProfile.expense_account], references: [account.id] }),
  taxesAndCharges: one(salesTaxesAndChargesTemplate, { fields: [posProfile.taxes_and_charges], references: [salesTaxesAndChargesTemplate.id] }),
  taxCategory: one(taxCategory, { fields: [posProfile.tax_category], references: [taxCategory.id] }),
  accountForChangeAmount: one(account, { fields: [posProfile.account_for_change_amount], references: [account.id] }),
  costCenter: one(costCenter, { fields: [posProfile.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [posProfile.project], references: [project.id] }),
  tcName: one(termsAndConditions, { fields: [posProfile.tc_name], references: [termsAndConditions.id] }),
  applicableForUsers: many(posProfileUser),
  payments: many(posPaymentMethod),
  itemGroups: many(posItemGroup),
  customerGroups: many(posCustomerGroup),
}));

export const posSettingsRelations = relations(posSettings, ({ many }) => ({
  invoiceFields: many(posField),
  posSearchFields: many(posSearchFields),
}));

export const psoaCostCenterRelations = relations(psoaCostCenter, ({ one }) => ({
  costCenterName: one(costCenter, { fields: [psoaCostCenter.cost_center_name], references: [costCenter.id] }),
}));

export const psoaProjectRelations = relations(psoaProject, ({ one }) => ({
  projectName: one(project, { fields: [psoaProject.project_name], references: [project.id] }),
}));

export const partyAccountRelations = relations(partyAccount, ({ one }) => ({
  company: one(company, { fields: [partyAccount.company], references: [company.id] }),
  account: one(account, { fields: [partyAccount.account], references: [account.id] }),
  advanceAccount: one(account, { fields: [partyAccount.advance_account], references: [account.id] }),
}));

export const paymentEntryRelations = relations(paymentEntry, ({ one, many }) => ({
  company: one(company, { fields: [paymentEntry.company], references: [company.id] }),
  modeOfPayment: one(modeOfPayment, { fields: [paymentEntry.mode_of_payment], references: [modeOfPayment.id] }),
  taxWithholdingCategory: one(taxWithholdingCategory, { fields: [paymentEntry.tax_withholding_category], references: [taxWithholdingCategory.id] }),
  bankAccount: one(bankAccount, { fields: [paymentEntry.bank_account], references: [bankAccount.id] }),
  partyBankAccount: one(bankAccount, { fields: [paymentEntry.party_bank_account], references: [bankAccount.id] }),
  paidFrom: one(account, { fields: [paymentEntry.paid_from], references: [account.id] }),
  paidTo: one(account, { fields: [paymentEntry.paid_to], references: [account.id] }),
  purchaseTaxesAndChargesTemplate: one(purchaseTaxesAndChargesTemplate, { fields: [paymentEntry.purchase_taxes_and_charges_template], references: [purchaseTaxesAndChargesTemplate.id] }),
  salesTaxesAndChargesTemplate: one(salesTaxesAndChargesTemplate, { fields: [paymentEntry.sales_taxes_and_charges_template], references: [salesTaxesAndChargesTemplate.id] }),
  taxWithholdingGroup: one(taxWithholdingGroup, { fields: [paymentEntry.tax_withholding_group], references: [taxWithholdingGroup.id] }),
  project: one(project, { fields: [paymentEntry.project], references: [project.id] }),
  costCenter: one(costCenter, { fields: [paymentEntry.cost_center], references: [costCenter.id] }),
  paymentOrder: one(paymentOrder, { fields: [paymentEntry.payment_order], references: [paymentOrder.id] }),
  amendedFrom: one(paymentEntry, { fields: [paymentEntry.amended_from], references: [paymentEntry.id] }),
  references: many(paymentEntryReference),
  deductions: many(paymentEntryDeduction),
  taxes: many(advanceTaxesAndCharges),
  taxWithholdingEntries: many(taxWithholdingEntry),
}));

export const paymentEntryDeductionRelations = relations(paymentEntryDeduction, ({ one }) => ({
  account: one(account, { fields: [paymentEntryDeduction.account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [paymentEntryDeduction.cost_center], references: [costCenter.id] }),
}));

export const paymentEntryReferenceRelations = relations(paymentEntryReference, ({ one }) => ({
  paymentTerm: one(paymentTerm, { fields: [paymentEntryReference.payment_term], references: [paymentTerm.id] }),
  account: one(account, { fields: [paymentEntryReference.account], references: [account.id] }),
  paymentRequest: one(paymentRequest, { fields: [paymentEntryReference.payment_request], references: [paymentRequest.id] }),
}));

export const paymentGatewayAccountRelations = relations(paymentGatewayAccount, ({ one }) => ({
  company: one(company, { fields: [paymentGatewayAccount.company], references: [company.id] }),
  paymentAccount: one(account, { fields: [paymentGatewayAccount.payment_account], references: [account.id] }),
}));

export const paymentLedgerEntryRelations = relations(paymentLedgerEntry, ({ one }) => ({
  company: one(company, { fields: [paymentLedgerEntry.company], references: [company.id] }),
  account: one(account, { fields: [paymentLedgerEntry.account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [paymentLedgerEntry.cost_center], references: [costCenter.id] }),
  financeBook: one(financeBook, { fields: [paymentLedgerEntry.finance_book], references: [financeBook.id] }),
  project: one(project, { fields: [paymentLedgerEntry.project], references: [project.id] }),
}));

export const paymentOrderRelations = relations(paymentOrder, ({ one, many }) => ({
  company: one(company, { fields: [paymentOrder.company], references: [company.id] }),
  party: one(supplier, { fields: [paymentOrder.party], references: [supplier.id] }),
  companyBank: one(bank, { fields: [paymentOrder.company_bank], references: [bank.id] }),
  companyBankAccount: one(bankAccount, { fields: [paymentOrder.company_bank_account], references: [bankAccount.id] }),
  amendedFrom: one(paymentOrder, { fields: [paymentOrder.amended_from], references: [paymentOrder.id] }),
  references: many(paymentOrderReference),
}));

export const paymentOrderReferenceRelations = relations(paymentOrderReference, ({ one }) => ({
  supplier: one(supplier, { fields: [paymentOrderReference.supplier], references: [supplier.id] }),
  paymentRequest: one(paymentRequest, { fields: [paymentOrderReference.payment_request], references: [paymentRequest.id] }),
  modeOfPayment: one(modeOfPayment, { fields: [paymentOrderReference.mode_of_payment], references: [modeOfPayment.id] }),
  bankAccount: one(bankAccount, { fields: [paymentOrderReference.bank_account], references: [bankAccount.id] }),
  account: one(account, { fields: [paymentOrderReference.account], references: [account.id] }),
}));

export const paymentReconciliationRelations = relations(paymentReconciliation, ({ one, many }) => ({
  company: one(company, { fields: [paymentReconciliation.company], references: [company.id] }),
  receivablePayableAccount: one(account, { fields: [paymentReconciliation.receivable_payable_account], references: [account.id] }),
  defaultAdvanceAccount: one(account, { fields: [paymentReconciliation.default_advance_account], references: [account.id] }),
  bankCashAccount: one(account, { fields: [paymentReconciliation.bank_cash_account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [paymentReconciliation.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [paymentReconciliation.project], references: [project.id] }),
  payments: many(paymentReconciliationPayment),
  invoices: many(paymentReconciliationInvoice),
  allocation: many(paymentReconciliationAllocation),
}));

export const paymentReconciliationAllocationRelations = relations(paymentReconciliationAllocation, ({ one }) => ({
  differenceAccount: one(account, { fields: [paymentReconciliationAllocation.difference_account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [paymentReconciliationAllocation.cost_center], references: [costCenter.id] }),
}));

export const paymentReconciliationPaymentRelations = relations(paymentReconciliationPayment, ({ one }) => ({
  costCenter: one(costCenter, { fields: [paymentReconciliationPayment.cost_center], references: [costCenter.id] }),
}));

export const paymentRequestRelations = relations(paymentRequest, ({ one, many }) => ({
  company: one(company, { fields: [paymentRequest.company], references: [company.id] }),
  modeOfPayment: one(modeOfPayment, { fields: [paymentRequest.mode_of_payment], references: [modeOfPayment.id] }),
  bankAccount: one(bankAccount, { fields: [paymentRequest.bank_account], references: [bankAccount.id] }),
  bank: one(bank, { fields: [paymentRequest.bank], references: [bank.id] }),
  costCenter: one(costCenter, { fields: [paymentRequest.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [paymentRequest.project], references: [project.id] }),
  paymentGatewayAccount: one(paymentGatewayAccount, { fields: [paymentRequest.payment_gateway_account], references: [paymentGatewayAccount.id] }),
  paymentOrder: one(paymentOrder, { fields: [paymentRequest.payment_order], references: [paymentOrder.id] }),
  amendedFrom: one(paymentRequest, { fields: [paymentRequest.amended_from], references: [paymentRequest.id] }),
  subscriptionPlans: many(subscriptionPlanDetail),
}));

export const paymentScheduleRelations = relations(paymentSchedule, ({ one }) => ({
  paymentTerm: one(paymentTerm, { fields: [paymentSchedule.payment_term], references: [paymentTerm.id] }),
  modeOfPayment: one(modeOfPayment, { fields: [paymentSchedule.mode_of_payment], references: [modeOfPayment.id] }),
}));

export const paymentTermRelations = relations(paymentTerm, ({ one }) => ({
  modeOfPayment: one(modeOfPayment, { fields: [paymentTerm.mode_of_payment], references: [modeOfPayment.id] }),
}));

export const paymentTermsTemplateRelations = relations(paymentTermsTemplate, ({ many }) => ({
  terms: many(paymentTermsTemplateDetail),
}));

export const paymentTermsTemplateDetailRelations = relations(paymentTermsTemplateDetail, ({ one }) => ({
  paymentTerm: one(paymentTerm, { fields: [paymentTermsTemplateDetail.payment_term], references: [paymentTerm.id] }),
  modeOfPayment: one(modeOfPayment, { fields: [paymentTermsTemplateDetail.mode_of_payment], references: [modeOfPayment.id] }),
}));

export const peggedCurrenciesRelations = relations(peggedCurrencies, ({ many }) => ({
  peggedCurrencyItem: many(peggedCurrencyDetails),
}));

export const periodClosingVoucherRelations = relations(periodClosingVoucher, ({ one }) => ({
  company: one(company, { fields: [periodClosingVoucher.company], references: [company.id] }),
  fiscalYear: one(fiscalYear, { fields: [periodClosingVoucher.fiscal_year], references: [fiscalYear.id] }),
  amendedFrom: one(periodClosingVoucher, { fields: [periodClosingVoucher.amended_from], references: [periodClosingVoucher.id] }),
  closingAccountHead: one(account, { fields: [periodClosingVoucher.closing_account_head], references: [account.id] }),
}));

export const pricingRuleRelations = relations(pricingRule, ({ one, many }) => ({
  warehouse: one(warehouse, { fields: [pricingRule.warehouse], references: [warehouse.id] }),
  otherItemCode: one(item, { fields: [pricingRule.other_item_code], references: [item.id] }),
  otherItemGroup: one(itemGroup, { fields: [pricingRule.other_item_group], references: [itemGroup.id] }),
  otherBrand: one(brand, { fields: [pricingRule.other_brand], references: [brand.id] }),
  customer: one(customer, { fields: [pricingRule.customer], references: [customer.id] }),
  customerGroup: one(customerGroup, { fields: [pricingRule.customer_group], references: [customerGroup.id] }),
  territory: one(territory, { fields: [pricingRule.territory], references: [territory.id] }),
  salesPartner: one(salesPartner, { fields: [pricingRule.sales_partner], references: [salesPartner.id] }),
  supplier: one(supplier, { fields: [pricingRule.supplier], references: [supplier.id] }),
  supplierGroup: one(supplierGroup, { fields: [pricingRule.supplier_group], references: [supplierGroup.id] }),
  freeItem: one(item, { fields: [pricingRule.free_item], references: [item.id] }),
  freeItemUom: one(uom, { fields: [pricingRule.free_item_uom], references: [uom.id] }),
  company: one(company, { fields: [pricingRule.company], references: [company.id] }),
  forPriceList: one(priceList, { fields: [pricingRule.for_price_list], references: [priceList.id] }),
  promotionalScheme: one(promotionalScheme, { fields: [pricingRule.promotional_scheme], references: [promotionalScheme.id] }),
  items: many(pricingRuleItemCode),
  itemGroups: many(pricingRuleItemGroup),
  brands: many(pricingRuleBrand),
}));

export const pricingRuleBrandRelations = relations(pricingRuleBrand, ({ one }) => ({
  brand: one(brand, { fields: [pricingRuleBrand.brand], references: [brand.id] }),
  uom: one(uom, { fields: [pricingRuleBrand.uom], references: [uom.id] }),
}));

export const pricingRuleDetailRelations = relations(pricingRuleDetail, ({ one }) => ({
  pricingRule: one(pricingRule, { fields: [pricingRuleDetail.pricing_rule], references: [pricingRule.id] }),
}));

export const pricingRuleItemCodeRelations = relations(pricingRuleItemCode, ({ one }) => ({
  itemCode: one(item, { fields: [pricingRuleItemCode.item_code], references: [item.id] }),
  uom: one(uom, { fields: [pricingRuleItemCode.uom], references: [uom.id] }),
}));

export const pricingRuleItemGroupRelations = relations(pricingRuleItemGroup, ({ one }) => ({
  itemGroup: one(itemGroup, { fields: [pricingRuleItemGroup.item_group], references: [itemGroup.id] }),
  uom: one(uom, { fields: [pricingRuleItemGroup.uom], references: [uom.id] }),
}));

export const processDeferredAccountingRelations = relations(processDeferredAccounting, ({ one }) => ({
  company: one(company, { fields: [processDeferredAccounting.company], references: [company.id] }),
  account: one(account, { fields: [processDeferredAccounting.account], references: [account.id] }),
  amendedFrom: one(processDeferredAccounting, { fields: [processDeferredAccounting.amended_from], references: [processDeferredAccounting.id] }),
}));

export const processPaymentReconciliationRelations = relations(processPaymentReconciliation, ({ one }) => ({
  company: one(company, { fields: [processPaymentReconciliation.company], references: [company.id] }),
  receivablePayableAccount: one(account, { fields: [processPaymentReconciliation.receivable_payable_account], references: [account.id] }),
  defaultAdvanceAccount: one(account, { fields: [processPaymentReconciliation.default_advance_account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [processPaymentReconciliation.cost_center], references: [costCenter.id] }),
  bankCashAccount: one(account, { fields: [processPaymentReconciliation.bank_cash_account], references: [account.id] }),
  amendedFrom: one(processPaymentReconciliation, { fields: [processPaymentReconciliation.amended_from], references: [processPaymentReconciliation.id] }),
}));

export const processPaymentReconciliationLogRelations = relations(processPaymentReconciliationLog, ({ one, many }) => ({
  processPr: one(processPaymentReconciliation, { fields: [processPaymentReconciliationLog.process_pr], references: [processPaymentReconciliation.id] }),
  allocations: many(processPaymentReconciliationLogAllocations),
}));

export const processPaymentReconciliationLogAllocationsRelations = relations(processPaymentReconciliationLogAllocations, ({ one }) => ({
  differenceAccount: one(account, { fields: [processPaymentReconciliationLogAllocations.difference_account], references: [account.id] }),
}));

export const processPeriodClosingVoucherRelations = relations(processPeriodClosingVoucher, ({ one, many }) => ({
  parentPcv: one(periodClosingVoucher, { fields: [processPeriodClosingVoucher.parent_pcv], references: [periodClosingVoucher.id] }),
  amendedFrom: one(processPeriodClosingVoucher, { fields: [processPeriodClosingVoucher.amended_from], references: [processPeriodClosingVoucher.id] }),
  normalBalances: many(processPeriodClosingVoucherDetail),
  zOpeningBalances: many(processPeriodClosingVoucherDetail),
}));

export const processStatementOfAccountsRelations = relations(processStatementOfAccounts, ({ one, many }) => ({
  company: one(company, { fields: [processStatementOfAccounts.company], references: [company.id] }),
  account: one(account, { fields: [processStatementOfAccounts.account], references: [account.id] }),
  territory: one(territory, { fields: [processStatementOfAccounts.territory], references: [territory.id] }),
  financeBook: one(financeBook, { fields: [processStatementOfAccounts.finance_book], references: [financeBook.id] }),
  paymentTermsTemplate: one(paymentTermsTemplate, { fields: [processStatementOfAccounts.payment_terms_template], references: [paymentTermsTemplate.id] }),
  salesPartner: one(salesPartner, { fields: [processStatementOfAccounts.sales_partner], references: [salesPartner.id] }),
  salesPerson: one(salesPerson, { fields: [processStatementOfAccounts.sales_person], references: [salesPerson.id] }),
  termsAndConditions: one(termsAndConditions, { fields: [processStatementOfAccounts.terms_and_conditions], references: [termsAndConditions.id] }),
  costCenter: many(psoaCostCenter),
  project: many(psoaProject),
  ccTo: many(processStatementOfAccountsCc),
  customers: many(processStatementOfAccountsCustomer),
}));

export const processStatementOfAccountsCustomerRelations = relations(processStatementOfAccountsCustomer, ({ one }) => ({
  customer: one(customer, { fields: [processStatementOfAccountsCustomer.customer], references: [customer.id] }),
}));

export const processSubscriptionRelations = relations(processSubscription, ({ one }) => ({
  subscription: one(subscription, { fields: [processSubscription.subscription], references: [subscription.id] }),
  amendedFrom: one(processSubscription, { fields: [processSubscription.amended_from], references: [processSubscription.id] }),
}));

export const promotionalSchemeRelations = relations(promotionalScheme, ({ one, many }) => ({
  otherItemCode: one(item, { fields: [promotionalScheme.other_item_code], references: [item.id] }),
  otherItemGroup: one(itemGroup, { fields: [promotionalScheme.other_item_group], references: [itemGroup.id] }),
  otherBrand: one(brand, { fields: [promotionalScheme.other_brand], references: [brand.id] }),
  company: one(company, { fields: [promotionalScheme.company], references: [company.id] }),
  items: many(pricingRuleItemCode),
  itemGroups: many(pricingRuleItemGroup),
  brands: many(pricingRuleBrand),
  customer: many(customerItem),
  customerGroup: many(customerGroupItem),
  territory: many(territoryItem),
  salesPartner: many(salesPartnerItem),
  campaign: many(campaignItem),
  supplier: many(supplierItem),
  supplierGroup: many(supplierGroupItem),
  priceDiscountSlabs: many(promotionalSchemePriceDiscount),
  productDiscountSlabs: many(promotionalSchemeProductDiscount),
}));

export const promotionalSchemePriceDiscountRelations = relations(promotionalSchemePriceDiscount, ({ one }) => ({
  forPriceList: one(priceList, { fields: [promotionalSchemePriceDiscount.for_price_list], references: [priceList.id] }),
  warehouse: one(warehouse, { fields: [promotionalSchemePriceDiscount.warehouse], references: [warehouse.id] }),
}));

export const promotionalSchemeProductDiscountRelations = relations(promotionalSchemeProductDiscount, ({ one }) => ({
  freeItem: one(item, { fields: [promotionalSchemeProductDiscount.free_item], references: [item.id] }),
  freeItemUom: one(uom, { fields: [promotionalSchemeProductDiscount.free_item_uom], references: [uom.id] }),
  warehouse: one(warehouse, { fields: [promotionalSchemeProductDiscount.warehouse], references: [warehouse.id] }),
}));

export const purchaseInvoiceRelations = relations(purchaseInvoice, ({ one, many }) => ({
  supplier: one(supplier, { fields: [purchaseInvoice.supplier], references: [supplier.id] }),
  company: one(company, { fields: [purchaseInvoice.company], references: [company.id] }),
  returnAgainst: one(purchaseInvoice, { fields: [purchaseInvoice.return_against], references: [purchaseInvoice.id] }),
  amendedFrom: one(purchaseInvoice, { fields: [purchaseInvoice.amended_from], references: [purchaseInvoice.id] }),
  costCenter: one(costCenter, { fields: [purchaseInvoice.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [purchaseInvoice.project], references: [project.id] }),
  buyingPriceList: one(priceList, { fields: [purchaseInvoice.buying_price_list], references: [priceList.id] }),
  setWarehouse: one(warehouse, { fields: [purchaseInvoice.set_warehouse], references: [warehouse.id] }),
  setFromWarehouse: one(warehouse, { fields: [purchaseInvoice.set_from_warehouse], references: [warehouse.id] }),
  rejectedWarehouse: one(warehouse, { fields: [purchaseInvoice.rejected_warehouse], references: [warehouse.id] }),
  supplierWarehouse: one(warehouse, { fields: [purchaseInvoice.supplier_warehouse], references: [warehouse.id] }),
  taxCategory: one(taxCategory, { fields: [purchaseInvoice.tax_category], references: [taxCategory.id] }),
  taxesAndCharges: one(purchaseTaxesAndChargesTemplate, { fields: [purchaseInvoice.taxes_and_charges], references: [purchaseTaxesAndChargesTemplate.id] }),
  shippingRule: one(shippingRule, { fields: [purchaseInvoice.shipping_rule], references: [shippingRule.id] }),
  incoterm: one(incoterm, { fields: [purchaseInvoice.incoterm], references: [incoterm.id] }),
  taxWithholdingGroup: one(taxWithholdingGroup, { fields: [purchaseInvoice.tax_withholding_group], references: [taxWithholdingGroup.id] }),
  modeOfPayment: one(modeOfPayment, { fields: [purchaseInvoice.mode_of_payment], references: [modeOfPayment.id] }),
  cashBankAccount: one(account, { fields: [purchaseInvoice.cash_bank_account], references: [account.id] }),
  writeOffAccount: one(account, { fields: [purchaseInvoice.write_off_account], references: [account.id] }),
  writeOffCostCenter: one(costCenter, { fields: [purchaseInvoice.write_off_cost_center], references: [costCenter.id] }),
  paymentTermsTemplate: one(paymentTermsTemplate, { fields: [purchaseInvoice.payment_terms_template], references: [paymentTermsTemplate.id] }),
  tcName: one(termsAndConditions, { fields: [purchaseInvoice.tc_name], references: [termsAndConditions.id] }),
  creditTo: one(account, { fields: [purchaseInvoice.credit_to], references: [account.id] }),
  unrealizedProfitLossAccount: one(account, { fields: [purchaseInvoice.unrealized_profit_loss_account], references: [account.id] }),
  subscription: one(subscription, { fields: [purchaseInvoice.subscription], references: [subscription.id] }),
  representsCompany: one(company, { fields: [purchaseInvoice.represents_company], references: [company.id] }),
  supplierGroup: one(supplierGroup, { fields: [purchaseInvoice.supplier_group], references: [supplierGroup.id] }),
  interCompanyInvoiceReference: one(salesInvoice, { fields: [purchaseInvoice.inter_company_invoice_reference], references: [salesInvoice.id] }),
  items: many(purchaseInvoiceItem),
  pricingRules: many(pricingRuleDetail),
  suppliedItems: many(purchaseReceiptItemSupplied),
  taxes: many(purchaseTaxesAndCharges),
  advances: many(purchaseInvoiceAdvance),
  paymentSchedule: many(paymentSchedule),
  itemWiseTaxDetails: many(itemWiseTaxDetail),
  taxWithholdingEntries: many(taxWithholdingEntry),
}));

export const purchaseInvoiceItemRelations = relations(purchaseInvoiceItem, ({ one }) => ({
  itemCode: one(item, { fields: [purchaseInvoiceItem.item_code], references: [item.id] }),
  productBundle: one(productBundle, { fields: [purchaseInvoiceItem.product_bundle], references: [productBundle.id] }),
  brand: one(brand, { fields: [purchaseInvoiceItem.brand], references: [brand.id] }),
  itemGroup: one(itemGroup, { fields: [purchaseInvoiceItem.item_group], references: [itemGroup.id] }),
  uom: one(uom, { fields: [purchaseInvoiceItem.uom], references: [uom.id] }),
  stockUom: one(uom, { fields: [purchaseInvoiceItem.stock_uom], references: [uom.id] }),
  itemTaxTemplate: one(itemTaxTemplate, { fields: [purchaseInvoiceItem.item_tax_template], references: [itemTaxTemplate.id] }),
  taxWithholdingCategory: one(taxWithholdingCategory, { fields: [purchaseInvoiceItem.tax_withholding_category], references: [taxWithholdingCategory.id] }),
  warehouse: one(warehouse, { fields: [purchaseInvoiceItem.warehouse], references: [warehouse.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [purchaseInvoiceItem.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  fromWarehouse: one(warehouse, { fields: [purchaseInvoiceItem.from_warehouse], references: [warehouse.id] }),
  qualityInspection: one(qualityInspection, { fields: [purchaseInvoiceItem.quality_inspection], references: [qualityInspection.id] }),
  rejectedWarehouse: one(warehouse, { fields: [purchaseInvoiceItem.rejected_warehouse], references: [warehouse.id] }),
  rejectedSerialAndBatchBundle: one(serialAndBatchBundle, { fields: [purchaseInvoiceItem.rejected_serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  batchNo: one(batch, { fields: [purchaseInvoiceItem.batch_no], references: [batch.id] }),
  manufacturer: one(manufacturer, { fields: [purchaseInvoiceItem.manufacturer], references: [manufacturer.id] }),
  expenseAccount: one(account, { fields: [purchaseInvoiceItem.expense_account], references: [account.id] }),
  wipCompositeAsset: one(asset, { fields: [purchaseInvoiceItem.wip_composite_asset], references: [asset.id] }),
  assetLocation: one(location, { fields: [purchaseInvoiceItem.asset_location], references: [location.id] }),
  assetCategory: one(assetCategory, { fields: [purchaseInvoiceItem.asset_category], references: [assetCategory.id] }),
  deferredExpenseAccount: one(account, { fields: [purchaseInvoiceItem.deferred_expense_account], references: [account.id] }),
  bom: one(bom, { fields: [purchaseInvoiceItem.bom], references: [bom.id] }),
  purchaseOrder: one(purchaseOrder, { fields: [purchaseInvoiceItem.purchase_order], references: [purchaseOrder.id] }),
  purchaseReceipt: one(purchaseReceipt, { fields: [purchaseInvoiceItem.purchase_receipt], references: [purchaseReceipt.id] }),
  materialRequest: one(materialRequest, { fields: [purchaseInvoiceItem.material_request], references: [materialRequest.id] }),
  weightUom: one(uom, { fields: [purchaseInvoiceItem.weight_uom], references: [uom.id] }),
  project: one(project, { fields: [purchaseInvoiceItem.project], references: [project.id] }),
  costCenter: one(costCenter, { fields: [purchaseInvoiceItem.cost_center], references: [costCenter.id] }),
}));

export const purchaseTaxesAndChargesRelations = relations(purchaseTaxesAndCharges, ({ one }) => ({
  accountHead: one(account, { fields: [purchaseTaxesAndCharges.account_head], references: [account.id] }),
  costCenter: one(costCenter, { fields: [purchaseTaxesAndCharges.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [purchaseTaxesAndCharges.project], references: [project.id] }),
}));

export const purchaseTaxesAndChargesTemplateRelations = relations(purchaseTaxesAndChargesTemplate, ({ one, many }) => ({
  company: one(company, { fields: [purchaseTaxesAndChargesTemplate.company], references: [company.id] }),
  taxCategory: one(taxCategory, { fields: [purchaseTaxesAndChargesTemplate.tax_category], references: [taxCategory.id] }),
  taxes: many(purchaseTaxesAndCharges),
}));

export const repostAccountingLedgerRelations = relations(repostAccountingLedger, ({ one, many }) => ({
  company: one(company, { fields: [repostAccountingLedger.company], references: [company.id] }),
  amendedFrom: one(repostAccountingLedger, { fields: [repostAccountingLedger.amended_from], references: [repostAccountingLedger.id] }),
  vouchers: many(repostAccountingLedgerItems),
}));

export const repostAccountingLedgerSettingsRelations = relations(repostAccountingLedgerSettings, ({ many }) => ({
  allowedTypes: many(repostAllowedTypes),
}));

export const repostPaymentLedgerRelations = relations(repostPaymentLedger, ({ one, many }) => ({
  company: one(company, { fields: [repostPaymentLedger.company], references: [company.id] }),
  amendedFrom: one(repostPaymentLedger, { fields: [repostPaymentLedger.amended_from], references: [repostPaymentLedger.id] }),
  repostVouchers: many(repostPaymentLedgerItems),
}));

export const salesInvoiceRelations = relations(salesInvoice, ({ one, many }) => ({
  company: one(company, { fields: [salesInvoice.company], references: [company.id] }),
  customer: one(customer, { fields: [salesInvoice.customer], references: [customer.id] }),
  posProfile: one(posProfile, { fields: [salesInvoice.pos_profile], references: [posProfile.id] }),
  returnAgainst: one(salesInvoice, { fields: [salesInvoice.return_against], references: [salesInvoice.id] }),
  amendedFrom: one(salesInvoice, { fields: [salesInvoice.amended_from], references: [salesInvoice.id] }),
  posClosingEntry: one(posClosingEntry, { fields: [salesInvoice.pos_closing_entry], references: [posClosingEntry.id] }),
  costCenter: one(costCenter, { fields: [salesInvoice.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [salesInvoice.project], references: [project.id] }),
  sellingPriceList: one(priceList, { fields: [salesInvoice.selling_price_list], references: [priceList.id] }),
  setWarehouse: one(warehouse, { fields: [salesInvoice.set_warehouse], references: [warehouse.id] }),
  setTargetWarehouse: one(warehouse, { fields: [salesInvoice.set_target_warehouse], references: [warehouse.id] }),
  taxCategory: one(taxCategory, { fields: [salesInvoice.tax_category], references: [taxCategory.id] }),
  taxesAndCharges: one(salesTaxesAndChargesTemplate, { fields: [salesInvoice.taxes_and_charges], references: [salesTaxesAndChargesTemplate.id] }),
  shippingRule: one(shippingRule, { fields: [salesInvoice.shipping_rule], references: [shippingRule.id] }),
  incoterm: one(incoterm, { fields: [salesInvoice.incoterm], references: [incoterm.id] }),
  taxWithholdingGroup: one(taxWithholdingGroup, { fields: [salesInvoice.tax_withholding_group], references: [taxWithholdingGroup.id] }),
  couponCode: one(couponCode, { fields: [salesInvoice.coupon_code], references: [couponCode.id] }),
  additionalDiscountAccount: one(account, { fields: [salesInvoice.additional_discount_account], references: [account.id] }),
  cashBankAccount: one(account, { fields: [salesInvoice.cash_bank_account], references: [account.id] }),
  accountForChangeAmount: one(account, { fields: [salesInvoice.account_for_change_amount], references: [account.id] }),
  writeOffAccount: one(account, { fields: [salesInvoice.write_off_account], references: [account.id] }),
  writeOffCostCenter: one(costCenter, { fields: [salesInvoice.write_off_cost_center], references: [costCenter.id] }),
  loyaltyProgram: one(loyaltyProgram, { fields: [salesInvoice.loyalty_program], references: [loyaltyProgram.id] }),
  loyaltyRedemptionAccount: one(account, { fields: [salesInvoice.loyalty_redemption_account], references: [account.id] }),
  loyaltyRedemptionCostCenter: one(costCenter, { fields: [salesInvoice.loyalty_redemption_cost_center], references: [costCenter.id] }),
  territory: one(territory, { fields: [salesInvoice.territory], references: [territory.id] }),
  paymentTermsTemplate: one(paymentTermsTemplate, { fields: [salesInvoice.payment_terms_template], references: [paymentTermsTemplate.id] }),
  tcName: one(termsAndConditions, { fields: [salesInvoice.tc_name], references: [termsAndConditions.id] }),
  debitTo: one(account, { fields: [salesInvoice.debit_to], references: [account.id] }),
  unrealizedProfitLossAccount: one(account, { fields: [salesInvoice.unrealized_profit_loss_account], references: [account.id] }),
  salesPartner: one(salesPartner, { fields: [salesInvoice.sales_partner], references: [salesPartner.id] }),
  subscription: one(subscription, { fields: [salesInvoice.subscription], references: [subscription.id] }),
  customerGroup: one(customerGroup, { fields: [salesInvoice.customer_group], references: [customerGroup.id] }),
  representsCompany: one(company, { fields: [salesInvoice.represents_company], references: [company.id] }),
  interCompanyInvoiceReference: one(purchaseInvoice, { fields: [salesInvoice.inter_company_invoice_reference], references: [purchaseInvoice.id] }),
  items: many(salesInvoiceItem),
  pricingRules: many(pricingRuleDetail),
  packedItems: many(packedItem),
  timesheets: many(salesInvoiceTimesheet),
  taxes: many(salesTaxesAndCharges),
  advances: many(salesInvoiceAdvance),
  paymentSchedule: many(paymentSchedule),
  payments: many(salesInvoicePayment),
  salesTeam: many(salesTeam),
  itemWiseTaxDetails: many(itemWiseTaxDetail),
  taxWithholdingEntries: many(taxWithholdingEntry),
}));

export const salesInvoiceItemRelations = relations(salesInvoiceItem, ({ one }) => ({
  itemCode: one(item, { fields: [salesInvoiceItem.item_code], references: [item.id] }),
  itemGroup: one(itemGroup, { fields: [salesInvoiceItem.item_group], references: [itemGroup.id] }),
  stockUom: one(uom, { fields: [salesInvoiceItem.stock_uom], references: [uom.id] }),
  uom: one(uom, { fields: [salesInvoiceItem.uom], references: [uom.id] }),
  itemTaxTemplate: one(itemTaxTemplate, { fields: [salesInvoiceItem.item_tax_template], references: [itemTaxTemplate.id] }),
  taxWithholdingCategory: one(taxWithholdingCategory, { fields: [salesInvoiceItem.tax_withholding_category], references: [taxWithholdingCategory.id] }),
  incomeAccount: one(account, { fields: [salesInvoiceItem.income_account], references: [account.id] }),
  asset: one(asset, { fields: [salesInvoiceItem.asset], references: [asset.id] }),
  financeBook: one(financeBook, { fields: [salesInvoiceItem.finance_book], references: [financeBook.id] }),
  expenseAccount: one(account, { fields: [salesInvoiceItem.expense_account], references: [account.id] }),
  discountAccount: one(account, { fields: [salesInvoiceItem.discount_account], references: [account.id] }),
  deferredRevenueAccount: one(account, { fields: [salesInvoiceItem.deferred_revenue_account], references: [account.id] }),
  weightUom: one(uom, { fields: [salesInvoiceItem.weight_uom], references: [uom.id] }),
  warehouse: one(warehouse, { fields: [salesInvoiceItem.warehouse], references: [warehouse.id] }),
  targetWarehouse: one(warehouse, { fields: [salesInvoiceItem.target_warehouse], references: [warehouse.id] }),
  qualityInspection: one(qualityInspection, { fields: [salesInvoiceItem.quality_inspection], references: [qualityInspection.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [salesInvoiceItem.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  batchNo: one(batch, { fields: [salesInvoiceItem.batch_no], references: [batch.id] }),
  salesOrder: one(salesOrder, { fields: [salesInvoiceItem.sales_order], references: [salesOrder.id] }),
  deliveryNote: one(deliveryNote, { fields: [salesInvoiceItem.delivery_note], references: [deliveryNote.id] }),
  posInvoice: one(posInvoice, { fields: [salesInvoiceItem.pos_invoice], references: [posInvoice.id] }),
  purchaseOrder: one(purchaseOrder, { fields: [salesInvoiceItem.purchase_order], references: [purchaseOrder.id] }),
  costCenter: one(costCenter, { fields: [salesInvoiceItem.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [salesInvoiceItem.project], references: [project.id] }),
}));

export const salesInvoicePaymentRelations = relations(salesInvoicePayment, ({ one }) => ({
  modeOfPayment: one(modeOfPayment, { fields: [salesInvoicePayment.mode_of_payment], references: [modeOfPayment.id] }),
  account: one(account, { fields: [salesInvoicePayment.account], references: [account.id] }),
}));

export const salesInvoiceReferenceRelations = relations(salesInvoiceReference, ({ one }) => ({
  salesInvoice: one(salesInvoice, { fields: [salesInvoiceReference.sales_invoice], references: [salesInvoice.id] }),
  customer: one(customer, { fields: [salesInvoiceReference.customer], references: [customer.id] }),
  returnAgainst: one(salesInvoice, { fields: [salesInvoiceReference.return_against], references: [salesInvoice.id] }),
}));

export const salesInvoiceTimesheetRelations = relations(salesInvoiceTimesheet, ({ one }) => ({
  activityType: one(activityType, { fields: [salesInvoiceTimesheet.activity_type], references: [activityType.id] }),
  timeSheet: one(timesheet, { fields: [salesInvoiceTimesheet.time_sheet], references: [timesheet.id] }),
}));

export const salesPartnerItemRelations = relations(salesPartnerItem, ({ one }) => ({
  salesPartner: one(salesPartner, { fields: [salesPartnerItem.sales_partner], references: [salesPartner.id] }),
}));

export const salesTaxesAndChargesRelations = relations(salesTaxesAndCharges, ({ one }) => ({
  accountHead: one(account, { fields: [salesTaxesAndCharges.account_head], references: [account.id] }),
  costCenter: one(costCenter, { fields: [salesTaxesAndCharges.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [salesTaxesAndCharges.project], references: [project.id] }),
}));

export const salesTaxesAndChargesTemplateRelations = relations(salesTaxesAndChargesTemplate, ({ one, many }) => ({
  company: one(company, { fields: [salesTaxesAndChargesTemplate.company], references: [company.id] }),
  taxCategory: one(taxCategory, { fields: [salesTaxesAndChargesTemplate.tax_category], references: [taxCategory.id] }),
  taxes: many(salesTaxesAndCharges),
}));

export const shareBalanceRelations = relations(shareBalance, ({ one }) => ({
  shareType: one(shareType, { fields: [shareBalance.share_type], references: [shareType.id] }),
}));

export const shareTransferRelations = relations(shareTransfer, ({ one }) => ({
  fromShareholder: one(shareholder, { fields: [shareTransfer.from_shareholder], references: [shareholder.id] }),
  toShareholder: one(shareholder, { fields: [shareTransfer.to_shareholder], references: [shareholder.id] }),
  equityOrLiabilityAccount: one(account, { fields: [shareTransfer.equity_or_liability_account], references: [account.id] }),
  assetAccount: one(account, { fields: [shareTransfer.asset_account], references: [account.id] }),
  shareType: one(shareType, { fields: [shareTransfer.share_type], references: [shareType.id] }),
  company: one(company, { fields: [shareTransfer.company], references: [company.id] }),
  amendedFrom: one(shareTransfer, { fields: [shareTransfer.amended_from], references: [shareTransfer.id] }),
}));

export const shareholderRelations = relations(shareholder, ({ one, many }) => ({
  company: one(company, { fields: [shareholder.company], references: [company.id] }),
  shareBalance: many(shareBalance),
}));

export const shippingRuleRelations = relations(shippingRule, ({ one, many }) => ({
  company: one(company, { fields: [shippingRule.company], references: [company.id] }),
  account: one(account, { fields: [shippingRule.account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [shippingRule.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [shippingRule.project], references: [project.id] }),
  conditions: many(shippingRuleCondition),
  countries: many(shippingRuleCountry),
}));

export const southAfricaVatAccountRelations = relations(southAfricaVatAccount, ({ one }) => ({
  account: one(account, { fields: [southAfricaVatAccount.account], references: [account.id] }),
}));

export const subscriptionRelations = relations(subscription, ({ one, many }) => ({
  company: one(company, { fields: [subscription.company], references: [company.id] }),
  salesTaxTemplate: one(salesTaxesAndChargesTemplate, { fields: [subscription.sales_tax_template], references: [salesTaxesAndChargesTemplate.id] }),
  purchaseTaxTemplate: one(purchaseTaxesAndChargesTemplate, { fields: [subscription.purchase_tax_template], references: [purchaseTaxesAndChargesTemplate.id] }),
  costCenter: one(costCenter, { fields: [subscription.cost_center], references: [costCenter.id] }),
  plans: many(subscriptionPlanDetail),
}));

export const subscriptionPlanRelations = relations(subscriptionPlan, ({ one }) => ({
  item: one(item, { fields: [subscriptionPlan.item], references: [item.id] }),
  priceList: one(priceList, { fields: [subscriptionPlan.price_list], references: [priceList.id] }),
  paymentGateway: one(paymentGatewayAccount, { fields: [subscriptionPlan.payment_gateway], references: [paymentGatewayAccount.id] }),
  costCenter: one(costCenter, { fields: [subscriptionPlan.cost_center], references: [costCenter.id] }),
}));

export const subscriptionPlanDetailRelations = relations(subscriptionPlanDetail, ({ one }) => ({
  plan: one(subscriptionPlan, { fields: [subscriptionPlanDetail.plan], references: [subscriptionPlan.id] }),
}));

export const supplierGroupItemRelations = relations(supplierGroupItem, ({ one }) => ({
  supplierGroup: one(supplierGroup, { fields: [supplierGroupItem.supplier_group], references: [supplierGroup.id] }),
}));

export const supplierItemRelations = relations(supplierItem, ({ one }) => ({
  supplier: one(supplier, { fields: [supplierItem.supplier], references: [supplier.id] }),
}));

export const taxRuleRelations = relations(taxRule, ({ one }) => ({
  salesTaxTemplate: one(salesTaxesAndChargesTemplate, { fields: [taxRule.sales_tax_template], references: [salesTaxesAndChargesTemplate.id] }),
  purchaseTaxTemplate: one(purchaseTaxesAndChargesTemplate, { fields: [taxRule.purchase_tax_template], references: [purchaseTaxesAndChargesTemplate.id] }),
  customer: one(customer, { fields: [taxRule.customer], references: [customer.id] }),
  supplier: one(supplier, { fields: [taxRule.supplier], references: [supplier.id] }),
  item: one(item, { fields: [taxRule.item], references: [item.id] }),
  taxCategory: one(taxCategory, { fields: [taxRule.tax_category], references: [taxCategory.id] }),
  customerGroup: one(customerGroup, { fields: [taxRule.customer_group], references: [customerGroup.id] }),
  supplierGroup: one(supplierGroup, { fields: [taxRule.supplier_group], references: [supplierGroup.id] }),
  itemGroup: one(itemGroup, { fields: [taxRule.item_group], references: [itemGroup.id] }),
  company: one(company, { fields: [taxRule.company], references: [company.id] }),
}));

export const taxWithholdingAccountRelations = relations(taxWithholdingAccount, ({ one }) => ({
  company: one(company, { fields: [taxWithholdingAccount.company], references: [company.id] }),
  account: one(account, { fields: [taxWithholdingAccount.account], references: [account.id] }),
}));

export const taxWithholdingCategoryRelations = relations(taxWithholdingCategory, ({ many }) => ({
  rates: many(taxWithholdingRate),
  accounts: many(taxWithholdingAccount),
}));

export const taxWithholdingEntryRelations = relations(taxWithholdingEntry, ({ one }) => ({
  company: one(company, { fields: [taxWithholdingEntry.company], references: [company.id] }),
  taxWithholdingCategory: one(taxWithholdingCategory, { fields: [taxWithholdingEntry.tax_withholding_category], references: [taxWithholdingCategory.id] }),
  taxWithholdingGroup: one(taxWithholdingGroup, { fields: [taxWithholdingEntry.tax_withholding_group], references: [taxWithholdingGroup.id] }),
  lowerDeductionCertificate: one(lowerDeductionCertificate, { fields: [taxWithholdingEntry.lower_deduction_certificate], references: [lowerDeductionCertificate.id] }),
}));

export const taxWithholdingRateRelations = relations(taxWithholdingRate, ({ one }) => ({
  taxWithholdingGroup: one(taxWithholdingGroup, { fields: [taxWithholdingRate.tax_withholding_group], references: [taxWithholdingGroup.id] }),
}));

export const territoryItemRelations = relations(territoryItem, ({ one }) => ({
  territory: one(territory, { fields: [territoryItem.territory], references: [territory.id] }),
}));

export const unreconcilePaymentRelations = relations(unreconcilePayment, ({ one, many }) => ({
  company: one(company, { fields: [unreconcilePayment.company], references: [company.id] }),
  amendedFrom: one(unreconcilePayment, { fields: [unreconcilePayment.amended_from], references: [unreconcilePayment.id] }),
  allocations: many(unreconcilePaymentEntries),
}));

export const assetRelations = relations(asset, ({ one, many }) => ({
  company: one(company, { fields: [asset.company], references: [company.id] }),
  itemCode: one(item, { fields: [asset.item_code], references: [item.id] }),
  location: one(location, { fields: [asset.location], references: [location.id] }),
  assetCategory: one(assetCategory, { fields: [asset.asset_category], references: [assetCategory.id] }),
  purchaseReceipt: one(purchaseReceipt, { fields: [asset.purchase_receipt], references: [purchaseReceipt.id] }),
  purchaseInvoice: one(purchaseInvoice, { fields: [asset.purchase_invoice], references: [purchaseInvoice.id] }),
  costCenter: one(costCenter, { fields: [asset.cost_center], references: [costCenter.id] }),
  assetOwnerCompany: one(company, { fields: [asset.asset_owner_company], references: [company.id] }),
  customer: one(customer, { fields: [asset.customer], references: [customer.id] }),
  supplier: one(supplier, { fields: [asset.supplier], references: [supplier.id] }),
  custodian: one(employee, { fields: [asset.custodian], references: [employee.id] }),
  department: one(department, { fields: [asset.department], references: [department.id] }),
  defaultFinanceBook: one(financeBook, { fields: [asset.default_finance_book], references: [financeBook.id] }),
  journalEntryForScrap: one(journalEntry, { fields: [asset.journal_entry_for_scrap], references: [journalEntry.id] }),
  splitFrom: one(asset, { fields: [asset.split_from], references: [asset.id] }),
  amendedFrom: one(asset, { fields: [asset.amended_from], references: [asset.id] }),
  financeBooks: many(assetFinanceBook),
}));

export const assetActivityRelations = relations(assetActivity, ({ one }) => ({
  asset: one(asset, { fields: [assetActivity.asset], references: [asset.id] }),
}));

export const assetCapitalizationRelations = relations(assetCapitalization, ({ one, many }) => ({
  company: one(company, { fields: [assetCapitalization.company], references: [company.id] }),
  targetAsset: one(asset, { fields: [assetCapitalization.target_asset], references: [asset.id] }),
  financeBook: one(financeBook, { fields: [assetCapitalization.finance_book], references: [financeBook.id] }),
  targetItemCode: one(item, { fields: [assetCapitalization.target_item_code], references: [item.id] }),
  amendedFrom: one(assetCapitalization, { fields: [assetCapitalization.amended_from], references: [assetCapitalization.id] }),
  costCenter: one(costCenter, { fields: [assetCapitalization.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [assetCapitalization.project], references: [project.id] }),
  targetFixedAssetAccount: one(account, { fields: [assetCapitalization.target_fixed_asset_account], references: [account.id] }),
  stockItems: many(assetCapitalizationStockItem),
  assetItems: many(assetCapitalizationAssetItem),
  serviceItems: many(assetCapitalizationServiceItem),
}));

export const assetCapitalizationAssetItemRelations = relations(assetCapitalizationAssetItem, ({ one }) => ({
  asset: one(asset, { fields: [assetCapitalizationAssetItem.asset], references: [asset.id] }),
  financeBook: one(financeBook, { fields: [assetCapitalizationAssetItem.finance_book], references: [financeBook.id] }),
  itemCode: one(item, { fields: [assetCapitalizationAssetItem.item_code], references: [item.id] }),
  costCenter: one(costCenter, { fields: [assetCapitalizationAssetItem.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [assetCapitalizationAssetItem.project], references: [project.id] }),
  fixedAssetAccount: one(account, { fields: [assetCapitalizationAssetItem.fixed_asset_account], references: [account.id] }),
}));

export const assetCapitalizationServiceItemRelations = relations(assetCapitalizationServiceItem, ({ one }) => ({
  itemCode: one(item, { fields: [assetCapitalizationServiceItem.item_code], references: [item.id] }),
  expenseAccount: one(account, { fields: [assetCapitalizationServiceItem.expense_account], references: [account.id] }),
  uom: one(uom, { fields: [assetCapitalizationServiceItem.uom], references: [uom.id] }),
  costCenter: one(costCenter, { fields: [assetCapitalizationServiceItem.cost_center], references: [costCenter.id] }),
}));

export const assetCapitalizationStockItemRelations = relations(assetCapitalizationStockItem, ({ one }) => ({
  itemCode: one(item, { fields: [assetCapitalizationStockItem.item_code], references: [item.id] }),
  warehouse: one(warehouse, { fields: [assetCapitalizationStockItem.warehouse], references: [warehouse.id] }),
  stockUom: one(uom, { fields: [assetCapitalizationStockItem.stock_uom], references: [uom.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [assetCapitalizationStockItem.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  batchNo: one(batch, { fields: [assetCapitalizationStockItem.batch_no], references: [batch.id] }),
  costCenter: one(costCenter, { fields: [assetCapitalizationStockItem.cost_center], references: [costCenter.id] }),
}));

export const assetCategoryRelations = relations(assetCategory, ({ many }) => ({
  financeBooks: many(assetFinanceBook),
  accounts: many(assetCategoryAccount),
}));

export const assetCategoryAccountRelations = relations(assetCategoryAccount, ({ one }) => ({
  companyName: one(company, { fields: [assetCategoryAccount.company_name], references: [company.id] }),
  fixedAssetAccount: one(account, { fields: [assetCategoryAccount.fixed_asset_account], references: [account.id] }),
  accumulatedDepreciationAccount: one(account, { fields: [assetCategoryAccount.accumulated_depreciation_account], references: [account.id] }),
  depreciationExpenseAccount: one(account, { fields: [assetCategoryAccount.depreciation_expense_account], references: [account.id] }),
  capitalWorkInProgressAccount: one(account, { fields: [assetCategoryAccount.capital_work_in_progress_account], references: [account.id] }),
}));

export const assetDepreciationScheduleRelations = relations(assetDepreciationSchedule, ({ one, many }) => ({
  asset: one(asset, { fields: [assetDepreciationSchedule.asset], references: [asset.id] }),
  company: one(company, { fields: [assetDepreciationSchedule.company], references: [company.id] }),
  financeBook: one(financeBook, { fields: [assetDepreciationSchedule.finance_book], references: [financeBook.id] }),
  amendedFrom: one(assetDepreciationSchedule, { fields: [assetDepreciationSchedule.amended_from], references: [assetDepreciationSchedule.id] }),
  depreciationSchedule: many(depreciationSchedule),
}));

export const assetFinanceBookRelations = relations(assetFinanceBook, ({ one }) => ({
  financeBook: one(financeBook, { fields: [assetFinanceBook.finance_book], references: [financeBook.id] }),
}));

export const assetMaintenanceRelations = relations(assetMaintenance, ({ one, many }) => ({
  assetName: one(asset, { fields: [assetMaintenance.asset_name], references: [asset.id] }),
  company: one(company, { fields: [assetMaintenance.company], references: [company.id] }),
  maintenanceTeam: one(assetMaintenanceTeam, { fields: [assetMaintenance.maintenance_team], references: [assetMaintenanceTeam.id] }),
  assetMaintenanceTasks: many(assetMaintenanceTask),
}));

export const assetMaintenanceLogRelations = relations(assetMaintenanceLog, ({ one }) => ({
  assetMaintenance: one(assetMaintenance, { fields: [assetMaintenanceLog.asset_maintenance], references: [assetMaintenance.id] }),
  task: one(assetMaintenanceTask, { fields: [assetMaintenanceLog.task], references: [assetMaintenanceTask.id] }),
  amendedFrom: one(assetMaintenanceLog, { fields: [assetMaintenanceLog.amended_from], references: [assetMaintenanceLog.id] }),
}));

export const assetMaintenanceTeamRelations = relations(assetMaintenanceTeam, ({ one, many }) => ({
  company: one(company, { fields: [assetMaintenanceTeam.company], references: [company.id] }),
  maintenanceTeamMembers: many(maintenanceTeamMember),
}));

export const assetMovementRelations = relations(assetMovement, ({ one, many }) => ({
  company: one(company, { fields: [assetMovement.company], references: [company.id] }),
  amendedFrom: one(assetMovement, { fields: [assetMovement.amended_from], references: [assetMovement.id] }),
  assets: many(assetMovementItem),
}));

export const assetMovementItemRelations = relations(assetMovementItem, ({ one }) => ({
  company: one(company, { fields: [assetMovementItem.company], references: [company.id] }),
  asset: one(asset, { fields: [assetMovementItem.asset], references: [asset.id] }),
  sourceLocation: one(location, { fields: [assetMovementItem.source_location], references: [location.id] }),
  fromEmployee: one(employee, { fields: [assetMovementItem.from_employee], references: [employee.id] }),
  targetLocation: one(location, { fields: [assetMovementItem.target_location], references: [location.id] }),
  toEmployee: one(employee, { fields: [assetMovementItem.to_employee], references: [employee.id] }),
}));

export const assetRepairRelations = relations(assetRepair, ({ one, many }) => ({
  company: one(company, { fields: [assetRepair.company], references: [company.id] }),
  asset: one(asset, { fields: [assetRepair.asset], references: [asset.id] }),
  amendedFrom: one(assetRepair, { fields: [assetRepair.amended_from], references: [assetRepair.id] }),
  costCenter: one(costCenter, { fields: [assetRepair.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [assetRepair.project], references: [project.id] }),
  stockItems: many(assetRepairConsumedItem),
  invoices: many(assetRepairPurchaseInvoice),
}));

export const assetRepairConsumedItemRelations = relations(assetRepairConsumedItem, ({ one }) => ({
  itemCode: one(item, { fields: [assetRepairConsumedItem.item_code], references: [item.id] }),
  warehouse: one(warehouse, { fields: [assetRepairConsumedItem.warehouse], references: [warehouse.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [assetRepairConsumedItem.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
}));

export const assetRepairPurchaseInvoiceRelations = relations(assetRepairPurchaseInvoice, ({ one }) => ({
  purchaseInvoice: one(purchaseInvoice, { fields: [assetRepairPurchaseInvoice.purchase_invoice], references: [purchaseInvoice.id] }),
  expenseAccount: one(account, { fields: [assetRepairPurchaseInvoice.expense_account], references: [account.id] }),
}));

export const assetShiftAllocationRelations = relations(assetShiftAllocation, ({ one, many }) => ({
  asset: one(asset, { fields: [assetShiftAllocation.asset], references: [asset.id] }),
  financeBook: one(financeBook, { fields: [assetShiftAllocation.finance_book], references: [financeBook.id] }),
  amendedFrom: one(assetShiftAllocation, { fields: [assetShiftAllocation.amended_from], references: [assetShiftAllocation.id] }),
  depreciationSchedule: many(depreciationSchedule),
}));

export const assetValueAdjustmentRelations = relations(assetValueAdjustment, ({ one }) => ({
  company: one(company, { fields: [assetValueAdjustment.company], references: [company.id] }),
  asset: one(asset, { fields: [assetValueAdjustment.asset], references: [asset.id] }),
  financeBook: one(financeBook, { fields: [assetValueAdjustment.finance_book], references: [financeBook.id] }),
  amendedFrom: one(assetValueAdjustment, { fields: [assetValueAdjustment.amended_from], references: [assetValueAdjustment.id] }),
  differenceAccount: one(account, { fields: [assetValueAdjustment.difference_account], references: [account.id] }),
  journalEntry: one(journalEntry, { fields: [assetValueAdjustment.journal_entry], references: [journalEntry.id] }),
  costCenter: one(costCenter, { fields: [assetValueAdjustment.cost_center], references: [costCenter.id] }),
}));

export const depreciationScheduleRelations = relations(depreciationSchedule, ({ one }) => ({
  journalEntry: one(journalEntry, { fields: [depreciationSchedule.journal_entry], references: [journalEntry.id] }),
  shift: one(assetShiftFactor, { fields: [depreciationSchedule.shift], references: [assetShiftFactor.id] }),
}));

export const linkedLocationRelations = relations(linkedLocation, ({ one }) => ({
  location: one(location, { fields: [linkedLocation.location], references: [location.id] }),
}));

export const locationRelations = relations(location, ({ one }) => ({
  parentLocation: one(location, { fields: [location.parent_location], references: [location.id] }),
  areaUom: one(uom, { fields: [location.area_uom], references: [uom.id] }),
}));

export const buyingSettingsRelations = relations(buyingSettings, ({ one }) => ({
  supplierGroup: one(supplierGroup, { fields: [buyingSettings.supplier_group], references: [supplierGroup.id] }),
  buyingPriceList: one(priceList, { fields: [buyingSettings.buying_price_list], references: [priceList.id] }),
}));

export const customerNumberAtSupplierRelations = relations(customerNumberAtSupplier, ({ one }) => ({
  company: one(company, { fields: [customerNumberAtSupplier.company], references: [company.id] }),
}));

export const purchaseOrderRelations = relations(purchaseOrder, ({ one, many }) => ({
  supplier: one(supplier, { fields: [purchaseOrder.supplier], references: [supplier.id] }),
  company: one(company, { fields: [purchaseOrder.company], references: [company.id] }),
  supplierWarehouse: one(warehouse, { fields: [purchaseOrder.supplier_warehouse], references: [warehouse.id] }),
  costCenter: one(costCenter, { fields: [purchaseOrder.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [purchaseOrder.project], references: [project.id] }),
  buyingPriceList: one(priceList, { fields: [purchaseOrder.buying_price_list], references: [priceList.id] }),
  setFromWarehouse: one(warehouse, { fields: [purchaseOrder.set_from_warehouse], references: [warehouse.id] }),
  setWarehouse: one(warehouse, { fields: [purchaseOrder.set_warehouse], references: [warehouse.id] }),
  setReserveWarehouse: one(warehouse, { fields: [purchaseOrder.set_reserve_warehouse], references: [warehouse.id] }),
  taxCategory: one(taxCategory, { fields: [purchaseOrder.tax_category], references: [taxCategory.id] }),
  taxesAndCharges: one(purchaseTaxesAndChargesTemplate, { fields: [purchaseOrder.taxes_and_charges], references: [purchaseTaxesAndChargesTemplate.id] }),
  shippingRule: one(shippingRule, { fields: [purchaseOrder.shipping_rule], references: [shippingRule.id] }),
  incoterm: one(incoterm, { fields: [purchaseOrder.incoterm], references: [incoterm.id] }),
  supplierGroup: one(supplierGroup, { fields: [purchaseOrder.supplier_group], references: [supplierGroup.id] }),
  customer: one(customer, { fields: [purchaseOrder.customer], references: [customer.id] }),
  paymentTermsTemplate: one(paymentTermsTemplate, { fields: [purchaseOrder.payment_terms_template], references: [paymentTermsTemplate.id] }),
  tcName: one(termsAndConditions, { fields: [purchaseOrder.tc_name], references: [termsAndConditions.id] }),
  representsCompany: one(company, { fields: [purchaseOrder.represents_company], references: [company.id] }),
  refSq: one(supplierQuotation, { fields: [purchaseOrder.ref_sq], references: [supplierQuotation.id] }),
  amendedFrom: one(purchaseOrder, { fields: [purchaseOrder.amended_from], references: [purchaseOrder.id] }),
  mps: one(masterProductionSchedule, { fields: [purchaseOrder.mps], references: [masterProductionSchedule.id] }),
  interCompanyOrderReference: one(salesOrder, { fields: [purchaseOrder.inter_company_order_reference], references: [salesOrder.id] }),
  items: many(purchaseOrderItem),
  pricingRules: many(pricingRuleDetail),
  suppliedItems: many(purchaseOrderItemSupplied),
  taxes: many(purchaseTaxesAndCharges),
  paymentSchedule: many(paymentSchedule),
  itemWiseTaxDetails: many(itemWiseTaxDetail),
}));

export const purchaseOrderItemRelations = relations(purchaseOrderItem, ({ one }) => ({
  fgItem: one(item, { fields: [purchaseOrderItem.fg_item], references: [item.id] }),
  itemCode: one(item, { fields: [purchaseOrderItem.item_code], references: [item.id] }),
  brand: one(brand, { fields: [purchaseOrderItem.brand], references: [brand.id] }),
  productBundle: one(productBundle, { fields: [purchaseOrderItem.product_bundle], references: [productBundle.id] }),
  itemGroup: one(itemGroup, { fields: [purchaseOrderItem.item_group], references: [itemGroup.id] }),
  stockUom: one(uom, { fields: [purchaseOrderItem.stock_uom], references: [uom.id] }),
  uom: one(uom, { fields: [purchaseOrderItem.uom], references: [uom.id] }),
  itemTaxTemplate: one(itemTaxTemplate, { fields: [purchaseOrderItem.item_tax_template], references: [itemTaxTemplate.id] }),
  fromWarehouse: one(warehouse, { fields: [purchaseOrderItem.from_warehouse], references: [warehouse.id] }),
  warehouse: one(warehouse, { fields: [purchaseOrderItem.warehouse], references: [warehouse.id] }),
  materialRequest: one(materialRequest, { fields: [purchaseOrderItem.material_request], references: [materialRequest.id] }),
  salesOrder: one(salesOrder, { fields: [purchaseOrderItem.sales_order], references: [salesOrder.id] }),
  supplierQuotation: one(supplierQuotation, { fields: [purchaseOrderItem.supplier_quotation], references: [supplierQuotation.id] }),
  supplierQuotationItem: one(supplierQuotationItem, { fields: [purchaseOrderItem.supplier_quotation_item], references: [supplierQuotationItem.id] }),
  blanketOrder: one(blanketOrder, { fields: [purchaseOrderItem.blanket_order], references: [blanketOrder.id] }),
  expenseAccount: one(account, { fields: [purchaseOrderItem.expense_account], references: [account.id] }),
  wipCompositeAsset: one(asset, { fields: [purchaseOrderItem.wip_composite_asset], references: [asset.id] }),
  manufacturer: one(manufacturer, { fields: [purchaseOrderItem.manufacturer], references: [manufacturer.id] }),
  bom: one(bom, { fields: [purchaseOrderItem.bom], references: [bom.id] }),
  weightUom: one(uom, { fields: [purchaseOrderItem.weight_uom], references: [uom.id] }),
  project: one(project, { fields: [purchaseOrderItem.project], references: [project.id] }),
  costCenter: one(costCenter, { fields: [purchaseOrderItem.cost_center], references: [costCenter.id] }),
  productionPlan: one(productionPlan, { fields: [purchaseOrderItem.production_plan], references: [productionPlan.id] }),
  jobCard: one(jobCard, { fields: [purchaseOrderItem.job_card], references: [jobCard.id] }),
}));

export const purchaseOrderItemSuppliedRelations = relations(purchaseOrderItemSupplied, ({ one }) => ({
  mainItemCode: one(item, { fields: [purchaseOrderItemSupplied.main_item_code], references: [item.id] }),
  rmItemCode: one(item, { fields: [purchaseOrderItemSupplied.rm_item_code], references: [item.id] }),
  stockUom: one(uom, { fields: [purchaseOrderItemSupplied.stock_uom], references: [uom.id] }),
  reserveWarehouse: one(warehouse, { fields: [purchaseOrderItemSupplied.reserve_warehouse], references: [warehouse.id] }),
}));

export const purchaseReceiptItemSuppliedRelations = relations(purchaseReceiptItemSupplied, ({ one }) => ({
  mainItemCode: one(item, { fields: [purchaseReceiptItemSupplied.main_item_code], references: [item.id] }),
  rmItemCode: one(item, { fields: [purchaseReceiptItemSupplied.rm_item_code], references: [item.id] }),
  stockUom: one(uom, { fields: [purchaseReceiptItemSupplied.stock_uom], references: [uom.id] }),
  batchNo: one(batch, { fields: [purchaseReceiptItemSupplied.batch_no], references: [batch.id] }),
  purchaseOrder: one(purchaseOrder, { fields: [purchaseReceiptItemSupplied.purchase_order], references: [purchaseOrder.id] }),
}));

export const requestForQuotationRelations = relations(requestForQuotation, ({ one, many }) => ({
  company: one(company, { fields: [requestForQuotation.company], references: [company.id] }),
  vendor: one(supplier, { fields: [requestForQuotation.vendor], references: [supplier.id] }),
  amendedFrom: one(requestForQuotation, { fields: [requestForQuotation.amended_from], references: [requestForQuotation.id] }),
  incoterm: one(incoterm, { fields: [requestForQuotation.incoterm], references: [incoterm.id] }),
  tcName: one(termsAndConditions, { fields: [requestForQuotation.tc_name], references: [termsAndConditions.id] }),
  opportunity: one(opportunity, { fields: [requestForQuotation.opportunity], references: [opportunity.id] }),
  suppliers: many(requestForQuotationSupplier),
  items: many(requestForQuotationItem),
}));

export const requestForQuotationItemRelations = relations(requestForQuotationItem, ({ one }) => ({
  itemCode: one(item, { fields: [requestForQuotationItem.item_code], references: [item.id] }),
  itemGroup: one(itemGroup, { fields: [requestForQuotationItem.item_group], references: [itemGroup.id] }),
  brand: one(brand, { fields: [requestForQuotationItem.brand], references: [brand.id] }),
  stockUom: one(uom, { fields: [requestForQuotationItem.stock_uom], references: [uom.id] }),
  uom: one(uom, { fields: [requestForQuotationItem.uom], references: [uom.id] }),
  warehouse: one(warehouse, { fields: [requestForQuotationItem.warehouse], references: [warehouse.id] }),
  materialRequest: one(materialRequest, { fields: [requestForQuotationItem.material_request], references: [materialRequest.id] }),
  projectName: one(project, { fields: [requestForQuotationItem.project_name], references: [project.id] }),
}));

export const requestForQuotationSupplierRelations = relations(requestForQuotationSupplier, ({ one }) => ({
  supplier: one(supplier, { fields: [requestForQuotationSupplier.supplier], references: [supplier.id] }),
}));

export const supplierRelations = relations(supplier, ({ one, many }) => ({
  supplierGroup: one(supplierGroup, { fields: [supplier.supplier_group], references: [supplierGroup.id] }),
  defaultBankAccount: one(bankAccount, { fields: [supplier.default_bank_account], references: [bankAccount.id] }),
  defaultPriceList: one(priceList, { fields: [supplier.default_price_list], references: [priceList.id] }),
  representsCompany: one(company, { fields: [supplier.represents_company], references: [company.id] }),
  taxCategory: one(taxCategory, { fields: [supplier.tax_category], references: [taxCategory.id] }),
  taxWithholdingCategory: one(taxWithholdingCategory, { fields: [supplier.tax_withholding_category], references: [taxWithholdingCategory.id] }),
  taxWithholdingGroup: one(taxWithholdingGroup, { fields: [supplier.tax_withholding_group], references: [taxWithholdingGroup.id] }),
  paymentTerms: one(paymentTermsTemplate, { fields: [supplier.payment_terms], references: [paymentTermsTemplate.id] }),
  companies: many(allowedToTransactWith),
  accounts: many(partyAccount),
  portalUsers: many(portalUser),
  customerNumbers: many(customerNumberAtSupplier),
}));

export const supplierQuotationRelations = relations(supplierQuotation, ({ one, many }) => ({
  supplier: one(supplier, { fields: [supplierQuotation.supplier], references: [supplier.id] }),
  company: one(company, { fields: [supplierQuotation.company], references: [company.id] }),
  amendedFrom: one(supplierQuotation, { fields: [supplierQuotation.amended_from], references: [supplierQuotation.id] }),
  costCenter: one(costCenter, { fields: [supplierQuotation.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [supplierQuotation.project], references: [project.id] }),
  buyingPriceList: one(priceList, { fields: [supplierQuotation.buying_price_list], references: [priceList.id] }),
  taxCategory: one(taxCategory, { fields: [supplierQuotation.tax_category], references: [taxCategory.id] }),
  taxesAndCharges: one(purchaseTaxesAndChargesTemplate, { fields: [supplierQuotation.taxes_and_charges], references: [purchaseTaxesAndChargesTemplate.id] }),
  shippingRule: one(shippingRule, { fields: [supplierQuotation.shipping_rule], references: [shippingRule.id] }),
  incoterm: one(incoterm, { fields: [supplierQuotation.incoterm], references: [incoterm.id] }),
  tcName: one(termsAndConditions, { fields: [supplierQuotation.tc_name], references: [termsAndConditions.id] }),
  opportunity: one(opportunity, { fields: [supplierQuotation.opportunity], references: [opportunity.id] }),
  items: many(supplierQuotationItem),
  pricingRules: many(pricingRuleDetail),
  taxes: many(purchaseTaxesAndCharges),
  itemWiseTaxDetails: many(itemWiseTaxDetail),
}));

export const supplierQuotationItemRelations = relations(supplierQuotationItem, ({ one }) => ({
  itemCode: one(item, { fields: [supplierQuotationItem.item_code], references: [item.id] }),
  itemGroup: one(itemGroup, { fields: [supplierQuotationItem.item_group], references: [itemGroup.id] }),
  brand: one(brand, { fields: [supplierQuotationItem.brand], references: [brand.id] }),
  stockUom: one(uom, { fields: [supplierQuotationItem.stock_uom], references: [uom.id] }),
  uom: one(uom, { fields: [supplierQuotationItem.uom], references: [uom.id] }),
  itemTaxTemplate: one(itemTaxTemplate, { fields: [supplierQuotationItem.item_tax_template], references: [itemTaxTemplate.id] }),
  weightUom: one(uom, { fields: [supplierQuotationItem.weight_uom], references: [uom.id] }),
  warehouse: one(warehouse, { fields: [supplierQuotationItem.warehouse], references: [warehouse.id] }),
  materialRequest: one(materialRequest, { fields: [supplierQuotationItem.material_request], references: [materialRequest.id] }),
  salesOrder: one(salesOrder, { fields: [supplierQuotationItem.sales_order], references: [salesOrder.id] }),
  requestForQuotation: one(requestForQuotation, { fields: [supplierQuotationItem.request_for_quotation], references: [requestForQuotation.id] }),
  manufacturer: one(manufacturer, { fields: [supplierQuotationItem.manufacturer], references: [manufacturer.id] }),
  costCenter: one(costCenter, { fields: [supplierQuotationItem.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [supplierQuotationItem.project], references: [project.id] }),
}));

export const supplierScorecardRelations = relations(supplierScorecard, ({ one, many }) => ({
  supplier: one(supplier, { fields: [supplierScorecard.supplier], references: [supplier.id] }),
  employee: one(employee, { fields: [supplierScorecard.employee], references: [employee.id] }),
  standings: many(supplierScorecardScoringStanding),
  criteria: many(supplierScorecardScoringCriteria),
}));

export const supplierScorecardPeriodRelations = relations(supplierScorecardPeriod, ({ one, many }) => ({
  supplier: one(supplier, { fields: [supplierScorecardPeriod.supplier], references: [supplier.id] }),
  scorecard: one(supplierScorecard, { fields: [supplierScorecardPeriod.scorecard], references: [supplierScorecard.id] }),
  amendedFrom: one(supplierScorecardPeriod, { fields: [supplierScorecardPeriod.amended_from], references: [supplierScorecardPeriod.id] }),
  criteria: many(supplierScorecardScoringCriteria),
  variables: many(supplierScorecardScoringVariable),
}));

export const supplierScorecardScoringCriteriaRelations = relations(supplierScorecardScoringCriteria, ({ one }) => ({
  criteriaName: one(supplierScorecardCriteria, { fields: [supplierScorecardScoringCriteria.criteria_name], references: [supplierScorecardCriteria.id] }),
}));

export const supplierScorecardScoringStandingRelations = relations(supplierScorecardScoringStanding, ({ one }) => ({
  standingName: one(supplierScorecardStanding, { fields: [supplierScorecardScoringStanding.standing_name], references: [supplierScorecardStanding.id] }),
  employeeLink: one(employee, { fields: [supplierScorecardScoringStanding.employee_link], references: [employee.id] }),
}));

export const supplierScorecardScoringVariableRelations = relations(supplierScorecardScoringVariable, ({ one }) => ({
  variableLabel: one(supplierScorecardVariable, { fields: [supplierScorecardScoringVariable.variable_label], references: [supplierScorecardVariable.id] }),
}));

export const supplierScorecardStandingRelations = relations(supplierScorecardStanding, ({ one }) => ({
  employeeLink: one(employee, { fields: [supplierScorecardStanding.employee_link], references: [employee.id] }),
}));

export const appointmentBookingSettingsRelations = relations(appointmentBookingSettings, ({ one, many }) => ({
  holidayList: one(holidayList, { fields: [appointmentBookingSettings.holiday_list], references: [holidayList.id] }),
  availabilityOfSlots: many(appointmentBookingSlots),
}));

export const campaignRelations = relations(campaign, ({ many }) => ({
  campaignSchedules: many(campaignEmailSchedule),
}));

export const competitorDetailRelations = relations(competitorDetail, ({ one }) => ({
  competitor: one(competitor, { fields: [competitorDetail.competitor], references: [competitor.id] }),
}));

export const contractRelations = relations(contract, ({ one, many }) => ({
  contractTemplate: one(contractTemplate, { fields: [contract.contract_template], references: [contractTemplate.id] }),
  amendedFrom: one(contract, { fields: [contract.amended_from], references: [contract.id] }),
  fulfilmentTerms: many(contractFulfilmentChecklist),
}));

export const contractFulfilmentChecklistRelations = relations(contractFulfilmentChecklist, ({ one }) => ({
  amendedFrom: one(contractFulfilmentChecklist, { fields: [contractFulfilmentChecklist.amended_from], references: [contractFulfilmentChecklist.id] }),
}));

export const contractTemplateRelations = relations(contractTemplate, ({ many }) => ({
  fulfilmentTerms: many(contractTemplateFulfilmentTerms),
}));

export const emailCampaignRelations = relations(emailCampaign, ({ one }) => ({
  campaignName: one(campaign, { fields: [emailCampaign.campaign_name], references: [campaign.id] }),
}));

export const leadRelations = relations(lead, ({ one, many }) => ({
  customer: one(customer, { fields: [lead.customer], references: [customer.id] }),
  industry: one(industryType, { fields: [lead.industry], references: [industryType.id] }),
  marketSegment: one(marketSegment, { fields: [lead.market_segment], references: [marketSegment.id] }),
  territory: one(territory, { fields: [lead.territory], references: [territory.id] }),
  company: one(company, { fields: [lead.company], references: [company.id] }),
  notes: many(crmNote),
}));

export const lostReasonDetailRelations = relations(lostReasonDetail, ({ one }) => ({
  lostReason: one(opportunityLostReason, { fields: [lostReasonDetail.lost_reason], references: [opportunityLostReason.id] }),
}));

export const opportunityRelations = relations(opportunity, ({ one, many }) => ({
  opportunityType: one(opportunityType, { fields: [opportunity.opportunity_type], references: [opportunityType.id] }),
  salesStage: one(salesStage, { fields: [opportunity.sales_stage], references: [salesStage.id] }),
  customerGroup: one(customerGroup, { fields: [opportunity.customer_group], references: [customerGroup.id] }),
  industry: one(industryType, { fields: [opportunity.industry], references: [industryType.id] }),
  marketSegment: one(marketSegment, { fields: [opportunity.market_segment], references: [marketSegment.id] }),
  territory: one(territory, { fields: [opportunity.territory], references: [territory.id] }),
  company: one(company, { fields: [opportunity.company], references: [company.id] }),
  amendedFrom: one(opportunity, { fields: [opportunity.amended_from], references: [opportunity.id] }),
  items: many(opportunityItem),
  lostReasons: many(opportunityLostReasonDetail),
  competitors: many(competitorDetail),
  notes: many(crmNote),
}));

export const opportunityItemRelations = relations(opportunityItem, ({ one }) => ({
  itemCode: one(item, { fields: [opportunityItem.item_code], references: [item.id] }),
  uom: one(uom, { fields: [opportunityItem.uom], references: [uom.id] }),
  brand: one(brand, { fields: [opportunityItem.brand], references: [brand.id] }),
  itemGroup: one(itemGroup, { fields: [opportunityItem.item_group], references: [itemGroup.id] }),
}));

export const opportunityLostReasonDetailRelations = relations(opportunityLostReasonDetail, ({ one }) => ({
  lostReason: one(opportunityLostReason, { fields: [opportunityLostReasonDetail.lost_reason], references: [opportunityLostReason.id] }),
}));

export const prospectRelations = relations(prospect, ({ one, many }) => ({
  customerGroup: one(customerGroup, { fields: [prospect.customer_group], references: [customerGroup.id] }),
  marketSegment: one(marketSegment, { fields: [prospect.market_segment], references: [marketSegment.id] }),
  industry: one(industryType, { fields: [prospect.industry], references: [industryType.id] }),
  territory: one(territory, { fields: [prospect.territory], references: [territory.id] }),
  company: one(company, { fields: [prospect.company], references: [company.id] }),
  opportunities: many(prospectOpportunity),
  leads: many(prospectLead),
  notes: many(crmNote),
}));

export const prospectLeadRelations = relations(prospectLead, ({ one }) => ({
  lead: one(lead, { fields: [prospectLead.lead], references: [lead.id] }),
}));

export const prospectOpportunityRelations = relations(prospectOpportunity, ({ one }) => ({
  opportunity: one(opportunity, { fields: [prospectOpportunity.opportunity], references: [opportunity.id] }),
}));

export const communicationMediumRelations = relations(communicationMedium, ({ one, many }) => ({
  catchAll: one(employeeGroup, { fields: [communicationMedium.catch_all], references: [employeeGroup.id] }),
  provider: one(supplier, { fields: [communicationMedium.provider], references: [supplier.id] }),
  timeslots: many(communicationMediumTimeslot),
}));

export const communicationMediumTimeslotRelations = relations(communicationMediumTimeslot, ({ one }) => ({
  employeeGroup: one(employeeGroup, { fields: [communicationMediumTimeslot.employee_group], references: [employeeGroup.id] }),
}));

export const codeListRelations = relations(codeList, ({ one }) => ({
  defaultCommonCode: one(commonCode, { fields: [codeList.default_common_code], references: [commonCode.id] }),
}));

export const commonCodeRelations = relations(commonCode, ({ one }) => ({
  codeList: one(codeList, { fields: [commonCode.code_list], references: [codeList.id] }),
}));

export const maintenanceScheduleRelations = relations(maintenanceSchedule, ({ one, many }) => ({
  customer: one(customer, { fields: [maintenanceSchedule.customer], references: [customer.id] }),
  territory: one(territory, { fields: [maintenanceSchedule.territory], references: [territory.id] }),
  customerGroup: one(customerGroup, { fields: [maintenanceSchedule.customer_group], references: [customerGroup.id] }),
  company: one(company, { fields: [maintenanceSchedule.company], references: [company.id] }),
  amendedFrom: one(maintenanceSchedule, { fields: [maintenanceSchedule.amended_from], references: [maintenanceSchedule.id] }),
  items: many(maintenanceScheduleItem),
  schedules: many(maintenanceScheduleDetail),
}));

export const maintenanceScheduleDetailRelations = relations(maintenanceScheduleDetail, ({ one }) => ({
  itemCode: one(item, { fields: [maintenanceScheduleDetail.item_code], references: [item.id] }),
  salesPerson: one(salesPerson, { fields: [maintenanceScheduleDetail.sales_person], references: [salesPerson.id] }),
  itemReference: one(maintenanceScheduleItem, { fields: [maintenanceScheduleDetail.item_reference], references: [maintenanceScheduleItem.id] }),
}));

export const maintenanceScheduleItemRelations = relations(maintenanceScheduleItem, ({ one }) => ({
  itemCode: one(item, { fields: [maintenanceScheduleItem.item_code], references: [item.id] }),
  salesPerson: one(salesPerson, { fields: [maintenanceScheduleItem.sales_person], references: [salesPerson.id] }),
  salesOrder: one(salesOrder, { fields: [maintenanceScheduleItem.sales_order], references: [salesOrder.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [maintenanceScheduleItem.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
}));

export const maintenanceVisitRelations = relations(maintenanceVisit, ({ one, many }) => ({
  customer: one(customer, { fields: [maintenanceVisit.customer], references: [customer.id] }),
  maintenanceSchedule: one(maintenanceSchedule, { fields: [maintenanceVisit.maintenance_schedule], references: [maintenanceSchedule.id] }),
  maintenanceScheduleDetail: one(maintenanceScheduleDetail, { fields: [maintenanceVisit.maintenance_schedule_detail], references: [maintenanceScheduleDetail.id] }),
  amendedFrom: one(maintenanceVisit, { fields: [maintenanceVisit.amended_from], references: [maintenanceVisit.id] }),
  company: one(company, { fields: [maintenanceVisit.company], references: [company.id] }),
  territory: one(territory, { fields: [maintenanceVisit.territory], references: [territory.id] }),
  customerGroup: one(customerGroup, { fields: [maintenanceVisit.customer_group], references: [customerGroup.id] }),
  purposes: many(maintenanceVisitPurpose),
}));

export const maintenanceVisitPurposeRelations = relations(maintenanceVisitPurpose, ({ one }) => ({
  itemCode: one(item, { fields: [maintenanceVisitPurpose.item_code], references: [item.id] }),
  servicePerson: one(salesPerson, { fields: [maintenanceVisitPurpose.service_person], references: [salesPerson.id] }),
  serialNo: one(serialNo, { fields: [maintenanceVisitPurpose.serial_no], references: [serialNo.id] }),
}));

export const bomRelations = relations(bom, ({ one, many }) => ({
  item: one(item, { fields: [bom.item], references: [item.id] }),
  company: one(company, { fields: [bom.company], references: [company.id] }),
  uom: one(uom, { fields: [bom.uom], references: [uom.id] }),
  project: one(project, { fields: [bom.project], references: [project.id] }),
  buyingPriceList: one(priceList, { fields: [bom.buying_price_list], references: [priceList.id] }),
  routing: one(routing, { fields: [bom.routing], references: [routing.id] }),
  defaultSourceWarehouse: one(warehouse, { fields: [bom.default_source_warehouse], references: [warehouse.id] }),
  defaultTargetWarehouse: one(warehouse, { fields: [bom.default_target_warehouse], references: [warehouse.id] }),
  qualityInspectionTemplate: one(qualityInspectionTemplate, { fields: [bom.quality_inspection_template], references: [qualityInspectionTemplate.id] }),
  bomCreator: one(bomCreator, { fields: [bom.bom_creator], references: [bomCreator.id] }),
  amendedFrom: one(bom, { fields: [bom.amended_from], references: [bom.id] }),
  operations: many(bomOperation),
  items: many(bomItem),
  scrapItems: many(bomScrapItem),
  explodedItems: many(bomExplosionItem),
}));

export const bomCreatorRelations = relations(bomCreator, ({ one, many }) => ({
  itemCode: one(item, { fields: [bomCreator.item_code], references: [item.id] }),
  itemGroup: one(itemGroup, { fields: [bomCreator.item_group], references: [itemGroup.id] }),
  project: one(project, { fields: [bomCreator.project], references: [project.id] }),
  uom: one(uom, { fields: [bomCreator.uom], references: [uom.id] }),
  routing: one(routing, { fields: [bomCreator.routing], references: [routing.id] }),
  buyingPriceList: one(priceList, { fields: [bomCreator.buying_price_list], references: [priceList.id] }),
  defaultWarehouse: one(warehouse, { fields: [bomCreator.default_warehouse], references: [warehouse.id] }),
  company: one(company, { fields: [bomCreator.company], references: [company.id] }),
  amendedFrom: one(bomCreator, { fields: [bomCreator.amended_from], references: [bomCreator.id] }),
  items: many(bomCreatorItem),
}));

export const bomCreatorItemRelations = relations(bomCreatorItem, ({ one }) => ({
  itemCode: one(item, { fields: [bomCreatorItem.item_code], references: [item.id] }),
  itemGroup: one(itemGroup, { fields: [bomCreatorItem.item_group], references: [itemGroup.id] }),
  fgItem: one(item, { fields: [bomCreatorItem.fg_item], references: [item.id] }),
  operation: one(operation, { fields: [bomCreatorItem.operation], references: [operation.id] }),
  uom: one(uom, { fields: [bomCreatorItem.uom], references: [uom.id] }),
  stockUom: one(uom, { fields: [bomCreatorItem.stock_uom], references: [uom.id] }),
}));

export const bomExplosionItemRelations = relations(bomExplosionItem, ({ one }) => ({
  itemCode: one(item, { fields: [bomExplosionItem.item_code], references: [item.id] }),
  sourceWarehouse: one(warehouse, { fields: [bomExplosionItem.source_warehouse], references: [warehouse.id] }),
  operation: one(operation, { fields: [bomExplosionItem.operation], references: [operation.id] }),
  stockUom: one(uom, { fields: [bomExplosionItem.stock_uom], references: [uom.id] }),
}));

export const bomItemRelations = relations(bomItem, ({ one }) => ({
  itemCode: one(item, { fields: [bomItem.item_code], references: [item.id] }),
  operation: one(operation, { fields: [bomItem.operation], references: [operation.id] }),
  bomNo: one(bom, { fields: [bomItem.bom_no], references: [bom.id] }),
  sourceWarehouse: one(warehouse, { fields: [bomItem.source_warehouse], references: [warehouse.id] }),
  uom: one(uom, { fields: [bomItem.uom], references: [uom.id] }),
  stockUom: one(uom, { fields: [bomItem.stock_uom], references: [uom.id] }),
  originalItem: one(item, { fields: [bomItem.original_item], references: [item.id] }),
}));

export const bomOperationRelations = relations(bomOperation, ({ one }) => ({
  operation: one(operation, { fields: [bomOperation.operation], references: [operation.id] }),
  finishedGood: one(item, { fields: [bomOperation.finished_good], references: [item.id] }),
  bomNo: one(bom, { fields: [bomOperation.bom_no], references: [bom.id] }),
  workstationType: one(workstationType, { fields: [bomOperation.workstation_type], references: [workstationType.id] }),
  workstation: one(workstation, { fields: [bomOperation.workstation], references: [workstation.id] }),
  sourceWarehouse: one(warehouse, { fields: [bomOperation.source_warehouse], references: [warehouse.id] }),
  wipWarehouse: one(warehouse, { fields: [bomOperation.wip_warehouse], references: [warehouse.id] }),
  fgWarehouse: one(warehouse, { fields: [bomOperation.fg_warehouse], references: [warehouse.id] }),
}));

export const bomScrapItemRelations = relations(bomScrapItem, ({ one }) => ({
  itemCode: one(item, { fields: [bomScrapItem.item_code], references: [item.id] }),
  stockUom: one(uom, { fields: [bomScrapItem.stock_uom], references: [uom.id] }),
}));

export const bomUpdateLogRelations = relations(bomUpdateLog, ({ one, many }) => ({
  currentBom: one(bom, { fields: [bomUpdateLog.current_bom], references: [bom.id] }),
  newBom: one(bom, { fields: [bomUpdateLog.new_bom], references: [bom.id] }),
  amendedFrom: one(bomUpdateLog, { fields: [bomUpdateLog.amended_from], references: [bomUpdateLog.id] }),
  bomBatches: many(bomUpdateBatch),
}));

export const bomUpdateToolRelations = relations(bomUpdateTool, ({ one }) => ({
  currentBom: one(bom, { fields: [bomUpdateTool.current_bom], references: [bom.id] }),
  newBom: one(bom, { fields: [bomUpdateTool.new_bom], references: [bom.id] }),
}));

export const bomWebsiteItemRelations = relations(bomWebsiteItem, ({ one }) => ({
  itemCode: one(item, { fields: [bomWebsiteItem.item_code], references: [item.id] }),
}));

export const bomWebsiteOperationRelations = relations(bomWebsiteOperation, ({ one }) => ({
  operation: one(operation, { fields: [bomWebsiteOperation.operation], references: [operation.id] }),
  workstation: one(workstation, { fields: [bomWebsiteOperation.workstation], references: [workstation.id] }),
}));

export const blanketOrderRelations = relations(blanketOrder, ({ one, many }) => ({
  customer: one(customer, { fields: [blanketOrder.customer], references: [customer.id] }),
  supplier: one(supplier, { fields: [blanketOrder.supplier], references: [supplier.id] }),
  company: one(company, { fields: [blanketOrder.company], references: [company.id] }),
  amendedFrom: one(blanketOrder, { fields: [blanketOrder.amended_from], references: [blanketOrder.id] }),
  tcName: one(termsAndConditions, { fields: [blanketOrder.tc_name], references: [termsAndConditions.id] }),
  items: many(blanketOrderItem),
}));

export const blanketOrderItemRelations = relations(blanketOrderItem, ({ one }) => ({
  itemCode: one(item, { fields: [blanketOrderItem.item_code], references: [item.id] }),
}));

export const downtimeEntryRelations = relations(downtimeEntry, ({ one }) => ({
  workstation: one(workstation, { fields: [downtimeEntry.workstation], references: [workstation.id] }),
  operator: one(employee, { fields: [downtimeEntry.operator], references: [employee.id] }),
}));

export const jobCardRelations = relations(jobCard, ({ one, many }) => ({
  workOrder: one(workOrder, { fields: [jobCard.work_order], references: [workOrder.id] }),
  company: one(company, { fields: [jobCard.company], references: [company.id] }),
  project: one(project, { fields: [jobCard.project], references: [project.id] }),
  bomNo: one(bom, { fields: [jobCard.bom_no], references: [bom.id] }),
  finishedGood: one(item, { fields: [jobCard.finished_good], references: [item.id] }),
  productionItem: one(item, { fields: [jobCard.production_item], references: [item.id] }),
  semiFgBom: one(bom, { fields: [jobCard.semi_fg_bom], references: [bom.id] }),
  operation: one(operation, { fields: [jobCard.operation], references: [operation.id] }),
  sourceWarehouse: one(warehouse, { fields: [jobCard.source_warehouse], references: [warehouse.id] }),
  wipWarehouse: one(warehouse, { fields: [jobCard.wip_warehouse], references: [warehouse.id] }),
  workstationType: one(workstationType, { fields: [jobCard.workstation_type], references: [workstationType.id] }),
  workstation: one(workstation, { fields: [jobCard.workstation], references: [workstation.id] }),
  targetWarehouse: one(warehouse, { fields: [jobCard.target_warehouse], references: [warehouse.id] }),
  qualityInspectionTemplate: one(qualityInspectionTemplate, { fields: [jobCard.quality_inspection_template], references: [qualityInspectionTemplate.id] }),
  qualityInspection: one(qualityInspection, { fields: [jobCard.quality_inspection], references: [qualityInspection.id] }),
  forJobCard: one(jobCard, { fields: [jobCard.for_job_card], references: [jobCard.id] }),
  forOperation: one(operation, { fields: [jobCard.for_operation], references: [operation.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [jobCard.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  batchNo: one(batch, { fields: [jobCard.batch_no], references: [batch.id] }),
  amendedFrom: one(jobCard, { fields: [jobCard.amended_from], references: [jobCard.id] }),
  timeLogs: many(jobCardTimeLog),
  items: many(jobCardItem),
  subOperations: many(jobCardOperation),
  employee: many(jobCardTimeLog),
  scrapItems: many(jobCardScrapItem),
  scheduledTimeLogs: many(jobCardScheduledTime),
}));

export const jobCardItemRelations = relations(jobCardItem, ({ one }) => ({
  itemCode: one(item, { fields: [jobCardItem.item_code], references: [item.id] }),
  sourceWarehouse: one(warehouse, { fields: [jobCardItem.source_warehouse], references: [warehouse.id] }),
  uom: one(uom, { fields: [jobCardItem.uom], references: [uom.id] }),
  itemGroup: one(itemGroup, { fields: [jobCardItem.item_group], references: [itemGroup.id] }),
  stockUom: one(uom, { fields: [jobCardItem.stock_uom], references: [uom.id] }),
}));

export const jobCardOperationRelations = relations(jobCardOperation, ({ one }) => ({
  subOperation: one(operation, { fields: [jobCardOperation.sub_operation], references: [operation.id] }),
}));

export const jobCardScrapItemRelations = relations(jobCardScrapItem, ({ one }) => ({
  itemCode: one(item, { fields: [jobCardScrapItem.item_code], references: [item.id] }),
  stockUom: one(uom, { fields: [jobCardScrapItem.stock_uom], references: [uom.id] }),
}));

export const jobCardTimeLogRelations = relations(jobCardTimeLog, ({ one }) => ({
  employee: one(employee, { fields: [jobCardTimeLog.employee], references: [employee.id] }),
  operation: one(operation, { fields: [jobCardTimeLog.operation], references: [operation.id] }),
}));

export const masterProductionScheduleRelations = relations(masterProductionSchedule, ({ one, many }) => ({
  company: one(company, { fields: [masterProductionSchedule.company], references: [company.id] }),
  parentWarehouse: one(warehouse, { fields: [masterProductionSchedule.parent_warehouse], references: [warehouse.id] }),
  salesForecast: one(salesForecast, { fields: [masterProductionSchedule.sales_forecast], references: [salesForecast.id] }),
  amendedFrom: one(masterProductionSchedule, { fields: [masterProductionSchedule.amended_from], references: [masterProductionSchedule.id] }),
  items: many(masterProductionScheduleItem),
  salesOrders: many(productionPlanSalesOrder),
  materialRequests: many(productionPlanMaterialRequest),
  selectItems: many(masterProductionScheduleItem),
}));

export const masterProductionScheduleItemRelations = relations(masterProductionScheduleItem, ({ one }) => ({
  itemCode: one(item, { fields: [masterProductionScheduleItem.item_code], references: [item.id] }),
  warehouse: one(warehouse, { fields: [masterProductionScheduleItem.warehouse], references: [warehouse.id] }),
  bomNo: one(bom, { fields: [masterProductionScheduleItem.bom_no], references: [bom.id] }),
  uom: one(uom, { fields: [masterProductionScheduleItem.uom], references: [uom.id] }),
}));

export const materialRequestPlanItemRelations = relations(materialRequestPlanItem, ({ one }) => ({
  itemCode: one(item, { fields: [materialRequestPlanItem.item_code], references: [item.id] }),
  fromWarehouse: one(warehouse, { fields: [materialRequestPlanItem.from_warehouse], references: [warehouse.id] }),
  warehouse: one(warehouse, { fields: [materialRequestPlanItem.warehouse], references: [warehouse.id] }),
  uom: one(uom, { fields: [materialRequestPlanItem.uom], references: [uom.id] }),
  fromBom: one(bom, { fields: [materialRequestPlanItem.from_bom], references: [bom.id] }),
  mainItemCode: one(item, { fields: [materialRequestPlanItem.main_item_code], references: [item.id] }),
  salesOrder: one(salesOrder, { fields: [materialRequestPlanItem.sales_order], references: [salesOrder.id] }),
}));

export const operationRelations = relations(operation, ({ one, many }) => ({
  workstation: one(workstation, { fields: [operation.workstation], references: [workstation.id] }),
  qualityInspectionTemplate: one(qualityInspectionTemplate, { fields: [operation.quality_inspection_template], references: [qualityInspectionTemplate.id] }),
  subOperations: many(subOperation),
}));

export const plantFloorRelations = relations(plantFloor, ({ one }) => ({
  company: one(company, { fields: [plantFloor.company], references: [company.id] }),
  warehouse: one(warehouse, { fields: [plantFloor.warehouse], references: [warehouse.id] }),
}));

export const productionPlanRelations = relations(productionPlan, ({ one, many }) => ({
  company: one(company, { fields: [productionPlan.company], references: [company.id] }),
  itemCode: one(item, { fields: [productionPlan.item_code], references: [item.id] }),
  customer: one(customer, { fields: [productionPlan.customer], references: [customer.id] }),
  warehouse: one(warehouse, { fields: [productionPlan.warehouse], references: [warehouse.id] }),
  project: one(project, { fields: [productionPlan.project], references: [project.id] }),
  subAssemblyWarehouse: one(warehouse, { fields: [productionPlan.sub_assembly_warehouse], references: [warehouse.id] }),
  forWarehouse: one(warehouse, { fields: [productionPlan.for_warehouse], references: [warehouse.id] }),
  amendedFrom: one(productionPlan, { fields: [productionPlan.amended_from], references: [productionPlan.id] }),
  salesOrders: many(productionPlanSalesOrder),
  materialRequests: many(productionPlanMaterialRequest),
  poItems: many(productionPlanItem),
  mrItems: many(materialRequestPlanItem),
  warehouses: many(productionPlanMaterialRequestWarehouse),
  prodPlanReferences: many(productionPlanItemReference),
  subAssemblyItems: many(productionPlanSubAssemblyItem),
}));

export const productionPlanItemRelations = relations(productionPlanItem, ({ one }) => ({
  itemCode: one(item, { fields: [productionPlanItem.item_code], references: [item.id] }),
  bomNo: one(bom, { fields: [productionPlanItem.bom_no], references: [bom.id] }),
  stockUom: one(uom, { fields: [productionPlanItem.stock_uom], references: [uom.id] }),
  warehouse: one(warehouse, { fields: [productionPlanItem.warehouse], references: [warehouse.id] }),
  salesOrder: one(salesOrder, { fields: [productionPlanItem.sales_order], references: [salesOrder.id] }),
  materialRequest: one(materialRequest, { fields: [productionPlanItem.material_request], references: [materialRequest.id] }),
  productBundleItem: one(item, { fields: [productionPlanItem.product_bundle_item], references: [item.id] }),
}));

export const productionPlanItemReferenceRelations = relations(productionPlanItemReference, ({ one }) => ({
  salesOrder: one(salesOrder, { fields: [productionPlanItemReference.sales_order], references: [salesOrder.id] }),
}));

export const productionPlanMaterialRequestRelations = relations(productionPlanMaterialRequest, ({ one }) => ({
  materialRequest: one(materialRequest, { fields: [productionPlanMaterialRequest.material_request], references: [materialRequest.id] }),
}));

export const productionPlanMaterialRequestWarehouseRelations = relations(productionPlanMaterialRequestWarehouse, ({ one }) => ({
  warehouse: one(warehouse, { fields: [productionPlanMaterialRequestWarehouse.warehouse], references: [warehouse.id] }),
}));

export const productionPlanSalesOrderRelations = relations(productionPlanSalesOrder, ({ one }) => ({
  salesOrder: one(salesOrder, { fields: [productionPlanSalesOrder.sales_order], references: [salesOrder.id] }),
  customer: one(customer, { fields: [productionPlanSalesOrder.customer], references: [customer.id] }),
}));

export const productionPlanSubAssemblyItemRelations = relations(productionPlanSubAssemblyItem, ({ one }) => ({
  productionItem: one(item, { fields: [productionPlanSubAssemblyItem.production_item], references: [item.id] }),
  fgWarehouse: one(warehouse, { fields: [productionPlanSubAssemblyItem.fg_warehouse], references: [warehouse.id] }),
  parentItemCode: one(item, { fields: [productionPlanSubAssemblyItem.parent_item_code], references: [item.id] }),
  bomNo: one(bom, { fields: [productionPlanSubAssemblyItem.bom_no], references: [bom.id] }),
  supplier: one(supplier, { fields: [productionPlanSubAssemblyItem.supplier], references: [supplier.id] }),
  purchaseOrder: one(purchaseOrder, { fields: [productionPlanSubAssemblyItem.purchase_order], references: [purchaseOrder.id] }),
  uom: one(uom, { fields: [productionPlanSubAssemblyItem.uom], references: [uom.id] }),
  stockUom: one(uom, { fields: [productionPlanSubAssemblyItem.stock_uom], references: [uom.id] }),
}));

export const routingRelations = relations(routing, ({ many }) => ({
  operations: many(bomOperation),
}));

export const salesForecastRelations = relations(salesForecast, ({ one, many }) => ({
  company: one(company, { fields: [salesForecast.company], references: [company.id] }),
  parentWarehouse: one(warehouse, { fields: [salesForecast.parent_warehouse], references: [warehouse.id] }),
  amendedFrom: one(salesForecast, { fields: [salesForecast.amended_from], references: [salesForecast.id] }),
  selectedItems: many(salesForecastItem),
  items: many(salesForecastItem),
}));

export const salesForecastItemRelations = relations(salesForecastItem, ({ one }) => ({
  itemCode: one(item, { fields: [salesForecastItem.item_code], references: [item.id] }),
  uom: one(uom, { fields: [salesForecastItem.uom], references: [uom.id] }),
  warehouse: one(warehouse, { fields: [salesForecastItem.warehouse], references: [warehouse.id] }),
}));

export const subOperationRelations = relations(subOperation, ({ one }) => ({
  operation: one(operation, { fields: [subOperation.operation], references: [operation.id] }),
}));

export const workOrderRelations = relations(workOrder, ({ one, many }) => ({
  productionItem: one(item, { fields: [workOrder.production_item], references: [item.id] }),
  bomNo: one(bom, { fields: [workOrder.bom_no], references: [bom.id] }),
  mps: one(masterProductionSchedule, { fields: [workOrder.mps], references: [masterProductionSchedule.id] }),
  subcontractingInwardOrder: one(subcontractingInwardOrder, { fields: [workOrder.subcontracting_inward_order], references: [subcontractingInwardOrder.id] }),
  salesOrder: one(salesOrder, { fields: [workOrder.sales_order], references: [salesOrder.id] }),
  company: one(company, { fields: [workOrder.company], references: [company.id] }),
  project: one(project, { fields: [workOrder.project], references: [project.id] }),
  sourceWarehouse: one(warehouse, { fields: [workOrder.source_warehouse], references: [warehouse.id] }),
  wipWarehouse: one(warehouse, { fields: [workOrder.wip_warehouse], references: [warehouse.id] }),
  fgWarehouse: one(warehouse, { fields: [workOrder.fg_warehouse], references: [warehouse.id] }),
  scrapWarehouse: one(warehouse, { fields: [workOrder.scrap_warehouse], references: [warehouse.id] }),
  stockUom: one(uom, { fields: [workOrder.stock_uom], references: [uom.id] }),
  materialRequest: one(materialRequest, { fields: [workOrder.material_request], references: [materialRequest.id] }),
  productionPlan: one(productionPlan, { fields: [workOrder.production_plan], references: [productionPlan.id] }),
  productBundleItem: one(item, { fields: [workOrder.product_bundle_item], references: [item.id] }),
  amendedFrom: one(workOrder, { fields: [workOrder.amended_from], references: [workOrder.id] }),
  requiredItems: many(workOrderItem),
  operations: many(workOrderOperation),
}));

export const workOrderItemRelations = relations(workOrderItem, ({ one }) => ({
  operation: one(operation, { fields: [workOrderItem.operation], references: [operation.id] }),
  itemCode: one(item, { fields: [workOrderItem.item_code], references: [item.id] }),
  sourceWarehouse: one(warehouse, { fields: [workOrderItem.source_warehouse], references: [warehouse.id] }),
  stockUom: one(uom, { fields: [workOrderItem.stock_uom], references: [uom.id] }),
}));

export const workOrderOperationRelations = relations(workOrderOperation, ({ one }) => ({
  operation: one(operation, { fields: [workOrderOperation.operation], references: [operation.id] }),
  bom: one(bom, { fields: [workOrderOperation.bom], references: [bom.id] }),
  workstationType: one(workstationType, { fields: [workOrderOperation.workstation_type], references: [workstationType.id] }),
  workstation: one(workstation, { fields: [workOrderOperation.workstation], references: [workstation.id] }),
  bomNo: one(bom, { fields: [workOrderOperation.bom_no], references: [bom.id] }),
  finishedGood: one(item, { fields: [workOrderOperation.finished_good], references: [item.id] }),
  sourceWarehouse: one(warehouse, { fields: [workOrderOperation.source_warehouse], references: [warehouse.id] }),
  wipWarehouse: one(warehouse, { fields: [workOrderOperation.wip_warehouse], references: [warehouse.id] }),
  fgWarehouse: one(warehouse, { fields: [workOrderOperation.fg_warehouse], references: [warehouse.id] }),
}));

export const workstationRelations = relations(workstation, ({ one, many }) => ({
  workstationType: one(workstationType, { fields: [workstation.workstation_type], references: [workstationType.id] }),
  plantFloor: one(plantFloor, { fields: [workstation.plant_floor], references: [plantFloor.id] }),
  warehouse: one(warehouse, { fields: [workstation.warehouse], references: [warehouse.id] }),
  holidayList: one(holidayList, { fields: [workstation.holiday_list], references: [holidayList.id] }),
  workingHours: many(workstationWorkingHour),
  workstationCosts: many(workstationCost),
}));

export const workstationCostRelations = relations(workstationCost, ({ one }) => ({
  operatingComponent: one(workstationOperatingComponent, { fields: [workstationCost.operating_component], references: [workstationOperatingComponent.id] }),
}));

export const workstationOperatingComponentRelations = relations(workstationOperatingComponent, ({ many }) => ({
  accounts: many(workstationOperatingComponentAccount),
}));

export const workstationOperatingComponentAccountRelations = relations(workstationOperatingComponentAccount, ({ one }) => ({
  company: one(company, { fields: [workstationOperatingComponentAccount.company], references: [company.id] }),
  expenseAccount: one(account, { fields: [workstationOperatingComponentAccount.expense_account], references: [account.id] }),
}));

export const workstationTypeRelations = relations(workstationType, ({ many }) => ({
  workstationCosts: many(workstationCost),
}));

export const websiteAttributeRelations = relations(websiteAttribute, ({ one }) => ({
  attribute: one(itemAttribute, { fields: [websiteAttribute.attribute], references: [itemAttribute.id] }),
}));

export const activityCostRelations = relations(activityCost, ({ one }) => ({
  activityType: one(activityType, { fields: [activityCost.activity_type], references: [activityType.id] }),
  employee: one(employee, { fields: [activityCost.employee], references: [employee.id] }),
  department: one(department, { fields: [activityCost.department], references: [department.id] }),
}));

export const dependentTaskRelations = relations(dependentTask, ({ one }) => ({
  task: one(task, { fields: [dependentTask.task], references: [task.id] }),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  projectType: one(projectType, { fields: [project.project_type], references: [projectType.id] }),
  projectTemplate: one(projectTemplate, { fields: [project.project_template], references: [projectTemplate.id] }),
  department: one(department, { fields: [project.department], references: [department.id] }),
  customer: one(customer, { fields: [project.customer], references: [customer.id] }),
  salesOrder: one(salesOrder, { fields: [project.sales_order], references: [salesOrder.id] }),
  company: one(company, { fields: [project.company], references: [company.id] }),
  costCenter: one(costCenter, { fields: [project.cost_center], references: [costCenter.id] }),
  holidayList: one(holidayList, { fields: [project.holiday_list], references: [holidayList.id] }),
  users: many(projectUser),
}));

export const projectTemplateRelations = relations(projectTemplate, ({ one, many }) => ({
  projectType: one(projectType, { fields: [projectTemplate.project_type], references: [projectType.id] }),
  tasks: many(projectTemplateTask),
}));

export const projectTemplateTaskRelations = relations(projectTemplateTask, ({ one }) => ({
  task: one(task, { fields: [projectTemplateTask.task], references: [task.id] }),
}));

export const projectUpdateRelations = relations(projectUpdate, ({ one, many }) => ({
  project: one(project, { fields: [projectUpdate.project], references: [project.id] }),
  amendedFrom: one(projectUpdate, { fields: [projectUpdate.amended_from], references: [projectUpdate.id] }),
  users: many(projectUser),
}));

export const taskRelations = relations(task, ({ one, many }) => ({
  project: one(project, { fields: [task.project], references: [project.id] }),
  issue: one(issue, { fields: [task.issue], references: [issue.id] }),
  type: one(taskType, { fields: [task.type], references: [taskType.id] }),
  parentTask: one(task, { fields: [task.parent_task], references: [task.id] }),
  department: one(department, { fields: [task.department], references: [department.id] }),
  company: one(company, { fields: [task.company], references: [company.id] }),
  dependsOn: many(taskDependsOn),
}));

export const taskDependsOnRelations = relations(taskDependsOn, ({ one }) => ({
  task: one(task, { fields: [taskDependsOn.task], references: [task.id] }),
}));

export const timesheetRelations = relations(timesheet, ({ one, many }) => ({
  company: one(company, { fields: [timesheet.company], references: [company.id] }),
  customer: one(customer, { fields: [timesheet.customer], references: [customer.id] }),
  salesInvoice: one(salesInvoice, { fields: [timesheet.sales_invoice], references: [salesInvoice.id] }),
  parentProject: one(project, { fields: [timesheet.parent_project], references: [project.id] }),
  employee: one(employee, { fields: [timesheet.employee], references: [employee.id] }),
  department: one(department, { fields: [timesheet.department], references: [department.id] }),
  amendedFrom: one(timesheet, { fields: [timesheet.amended_from], references: [timesheet.id] }),
  timeLogs: many(timesheetDetail),
}));

export const timesheetDetailRelations = relations(timesheetDetail, ({ one }) => ({
  activityType: one(activityType, { fields: [timesheetDetail.activity_type], references: [activityType.id] }),
  project: one(project, { fields: [timesheetDetail.project], references: [project.id] }),
  task: one(task, { fields: [timesheetDetail.task], references: [task.id] }),
  salesInvoice: one(salesInvoice, { fields: [timesheetDetail.sales_invoice], references: [salesInvoice.id] }),
}));

export const nonConformanceRelations = relations(nonConformance, ({ one }) => ({
  procedure: one(qualityProcedure, { fields: [nonConformance.procedure], references: [qualityProcedure.id] }),
}));

export const qualityActionRelations = relations(qualityAction, ({ one, many }) => ({
  review: one(qualityReview, { fields: [qualityAction.review], references: [qualityReview.id] }),
  feedback: one(qualityFeedback, { fields: [qualityAction.feedback], references: [qualityFeedback.id] }),
  goal: one(qualityGoal, { fields: [qualityAction.goal], references: [qualityGoal.id] }),
  procedure: one(qualityProcedure, { fields: [qualityAction.procedure], references: [qualityProcedure.id] }),
  resolutions: many(qualityActionResolution),
}));

export const qualityFeedbackRelations = relations(qualityFeedback, ({ one, many }) => ({
  template: one(qualityFeedbackTemplate, { fields: [qualityFeedback.template], references: [qualityFeedbackTemplate.id] }),
  parameters: many(qualityFeedbackParameter),
}));

export const qualityFeedbackTemplateRelations = relations(qualityFeedbackTemplate, ({ many }) => ({
  parameters: many(qualityFeedbackTemplateParameter),
}));

export const qualityGoalRelations = relations(qualityGoal, ({ one, many }) => ({
  procedure: one(qualityProcedure, { fields: [qualityGoal.procedure], references: [qualityProcedure.id] }),
  objectives: many(qualityGoalObjective),
}));

export const qualityGoalObjectiveRelations = relations(qualityGoalObjective, ({ one }) => ({
  uom: one(uom, { fields: [qualityGoalObjective.uom], references: [uom.id] }),
}));

export const qualityMeetingRelations = relations(qualityMeeting, ({ many }) => ({
  minutes: many(qualityMeetingMinutes),
  agenda: many(qualityMeetingAgenda),
}));

export const qualityProcedureRelations = relations(qualityProcedure, ({ one, many }) => ({
  parentQualityProcedure: one(qualityProcedure, { fields: [qualityProcedure.parent_quality_procedure], references: [qualityProcedure.id] }),
  processes: many(qualityProcedureProcess),
}));

export const qualityProcedureProcessRelations = relations(qualityProcedureProcess, ({ one }) => ({
  procedure: one(qualityProcedure, { fields: [qualityProcedureProcess.procedure], references: [qualityProcedure.id] }),
}));

export const qualityReviewRelations = relations(qualityReview, ({ one, many }) => ({
  goal: one(qualityGoal, { fields: [qualityReview.goal], references: [qualityGoal.id] }),
  procedure: one(qualityProcedure, { fields: [qualityReview.procedure], references: [qualityProcedure.id] }),
  reviews: many(qualityReviewObjective),
}));

export const qualityReviewObjectiveRelations = relations(qualityReviewObjective, ({ one }) => ({
  uom: one(uom, { fields: [qualityReviewObjective.uom], references: [uom.id] }),
}));

export const importSupplierInvoiceRelations = relations(importSupplierInvoice, ({ one }) => ({
  company: one(company, { fields: [importSupplierInvoice.company], references: [company.id] }),
  itemCode: one(item, { fields: [importSupplierInvoice.item_code], references: [item.id] }),
  supplierGroup: one(supplierGroup, { fields: [importSupplierInvoice.supplier_group], references: [supplierGroup.id] }),
  taxAccount: one(account, { fields: [importSupplierInvoice.tax_account], references: [account.id] }),
  defaultBuyingPriceList: one(priceList, { fields: [importSupplierInvoice.default_buying_price_list], references: [priceList.id] }),
}));

export const lowerDeductionCertificateRelations = relations(lowerDeductionCertificate, ({ one }) => ({
  taxWithholdingCategory: one(taxWithholdingCategory, { fields: [lowerDeductionCertificate.tax_withholding_category], references: [taxWithholdingCategory.id] }),
  fiscalYear: one(fiscalYear, { fields: [lowerDeductionCertificate.fiscal_year], references: [fiscalYear.id] }),
  company: one(company, { fields: [lowerDeductionCertificate.company], references: [company.id] }),
  supplier: one(supplier, { fields: [lowerDeductionCertificate.supplier], references: [supplier.id] }),
}));

export const southAfricaVatSettingsRelations = relations(southAfricaVatSettings, ({ one, many }) => ({
  company: one(company, { fields: [southAfricaVatSettings.company], references: [company.id] }),
  vatAccounts: many(southAfricaVatAccount),
}));

export const uaeVatAccountRelations = relations(uaeVatAccount, ({ one }) => ({
  account: one(account, { fields: [uaeVatAccount.account], references: [account.id] }),
}));

export const uaeVatSettingsRelations = relations(uaeVatSettings, ({ one, many }) => ({
  company: one(company, { fields: [uaeVatSettings.company], references: [company.id] }),
  uaeVatAccounts: many(uaeVatAccount),
}));

export const customerRelations = relations(customer, ({ one, many }) => ({
  customerGroup: one(customerGroup, { fields: [customer.customer_group], references: [customerGroup.id] }),
  territory: one(territory, { fields: [customer.territory], references: [territory.id] }),
  defaultBankAccount: one(bankAccount, { fields: [customer.default_bank_account], references: [bankAccount.id] }),
  defaultPriceList: one(priceList, { fields: [customer.default_price_list], references: [priceList.id] }),
  taxCategory: one(taxCategory, { fields: [customer.tax_category], references: [taxCategory.id] }),
  taxWithholdingCategory: one(taxWithholdingCategory, { fields: [customer.tax_withholding_category], references: [taxWithholdingCategory.id] }),
  taxWithholdingGroup: one(taxWithholdingGroup, { fields: [customer.tax_withholding_group], references: [taxWithholdingGroup.id] }),
  paymentTerms: one(paymentTermsTemplate, { fields: [customer.payment_terms], references: [paymentTermsTemplate.id] }),
  representsCompany: one(company, { fields: [customer.represents_company], references: [company.id] }),
  loyaltyProgram: one(loyaltyProgram, { fields: [customer.loyalty_program], references: [loyaltyProgram.id] }),
  defaultSalesPartner: one(salesPartner, { fields: [customer.default_sales_partner], references: [salesPartner.id] }),
  leadName: one(lead, { fields: [customer.lead_name], references: [lead.id] }),
  opportunityName: one(opportunity, { fields: [customer.opportunity_name], references: [opportunity.id] }),
  prospectName: one(prospect, { fields: [customer.prospect_name], references: [prospect.id] }),
  marketSegment: one(marketSegment, { fields: [customer.market_segment], references: [marketSegment.id] }),
  industry: one(industryType, { fields: [customer.industry], references: [industryType.id] }),
  companies: many(allowedToTransactWith),
  accounts: many(partyAccount),
  salesTeam: many(salesTeam),
  creditLimits: many(customerCreditLimit),
  portalUsers: many(portalUser),
  supplierNumbers: many(supplierNumberAtCustomer),
}));

export const customerCreditLimitRelations = relations(customerCreditLimit, ({ one }) => ({
  company: one(company, { fields: [customerCreditLimit.company], references: [company.id] }),
}));

export const deliveryScheduleItemRelations = relations(deliveryScheduleItem, ({ one }) => ({
  itemCode: one(item, { fields: [deliveryScheduleItem.item_code], references: [item.id] }),
  warehouse: one(warehouse, { fields: [deliveryScheduleItem.warehouse], references: [warehouse.id] }),
  salesOrder: one(salesOrder, { fields: [deliveryScheduleItem.sales_order], references: [salesOrder.id] }),
  uom: one(uom, { fields: [deliveryScheduleItem.uom], references: [uom.id] }),
  stockUom: one(uom, { fields: [deliveryScheduleItem.stock_uom], references: [uom.id] }),
}));

export const installationNoteRelations = relations(installationNote, ({ one, many }) => ({
  customer: one(customer, { fields: [installationNote.customer], references: [customer.id] }),
  territory: one(territory, { fields: [installationNote.territory], references: [territory.id] }),
  customerGroup: one(customerGroup, { fields: [installationNote.customer_group], references: [customerGroup.id] }),
  company: one(company, { fields: [installationNote.company], references: [company.id] }),
  project: one(project, { fields: [installationNote.project], references: [project.id] }),
  amendedFrom: one(installationNote, { fields: [installationNote.amended_from], references: [installationNote.id] }),
  items: many(installationNoteItem),
}));

export const installationNoteItemRelations = relations(installationNoteItem, ({ one }) => ({
  itemCode: one(item, { fields: [installationNoteItem.item_code], references: [item.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [installationNoteItem.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
}));

export const productBundleRelations = relations(productBundle, ({ one, many }) => ({
  newItemCode: one(item, { fields: [productBundle.new_item_code], references: [item.id] }),
  items: many(productBundleItem),
}));

export const productBundleItemRelations = relations(productBundleItem, ({ one }) => ({
  itemCode: one(item, { fields: [productBundleItem.item_code], references: [item.id] }),
  uom: one(uom, { fields: [productBundleItem.uom], references: [uom.id] }),
}));

export const quotationRelations = relations(quotation, ({ one, many }) => ({
  company: one(company, { fields: [quotation.company], references: [company.id] }),
  amendedFrom: one(quotation, { fields: [quotation.amended_from], references: [quotation.id] }),
  sellingPriceList: one(priceList, { fields: [quotation.selling_price_list], references: [priceList.id] }),
  taxCategory: one(taxCategory, { fields: [quotation.tax_category], references: [taxCategory.id] }),
  taxesAndCharges: one(salesTaxesAndChargesTemplate, { fields: [quotation.taxes_and_charges], references: [salesTaxesAndChargesTemplate.id] }),
  shippingRule: one(shippingRule, { fields: [quotation.shipping_rule], references: [shippingRule.id] }),
  incoterm: one(incoterm, { fields: [quotation.incoterm], references: [incoterm.id] }),
  couponCode: one(couponCode, { fields: [quotation.coupon_code], references: [couponCode.id] }),
  referralSalesPartner: one(salesPartner, { fields: [quotation.referral_sales_partner], references: [salesPartner.id] }),
  paymentTermsTemplate: one(paymentTermsTemplate, { fields: [quotation.payment_terms_template], references: [paymentTermsTemplate.id] }),
  tcName: one(termsAndConditions, { fields: [quotation.tc_name], references: [termsAndConditions.id] }),
  customerGroup: one(customerGroup, { fields: [quotation.customer_group], references: [customerGroup.id] }),
  territory: one(territory, { fields: [quotation.territory], references: [territory.id] }),
  opportunity: one(opportunity, { fields: [quotation.opportunity], references: [opportunity.id] }),
  supplierQuotation: one(supplierQuotation, { fields: [quotation.supplier_quotation], references: [supplierQuotation.id] }),
  items: many(quotationItem),
  pricingRules: many(pricingRuleDetail),
  taxes: many(salesTaxesAndCharges),
  paymentSchedule: many(paymentSchedule),
  lostReasons: many(quotationLostReasonDetail),
  packedItems: many(packedItem),
  competitors: many(competitorDetail),
  itemWiseTaxDetails: many(itemWiseTaxDetail),
}));

export const quotationItemRelations = relations(quotationItem, ({ one }) => ({
  itemCode: one(item, { fields: [quotationItem.item_code], references: [item.id] }),
  itemGroup: one(itemGroup, { fields: [quotationItem.item_group], references: [itemGroup.id] }),
  brand: one(brand, { fields: [quotationItem.brand], references: [brand.id] }),
  stockUom: one(uom, { fields: [quotationItem.stock_uom], references: [uom.id] }),
  uom: one(uom, { fields: [quotationItem.uom], references: [uom.id] }),
  itemTaxTemplate: one(itemTaxTemplate, { fields: [quotationItem.item_tax_template], references: [itemTaxTemplate.id] }),
  weightUom: one(uom, { fields: [quotationItem.weight_uom], references: [uom.id] }),
  warehouse: one(warehouse, { fields: [quotationItem.warehouse], references: [warehouse.id] }),
  blanketOrder: one(blanketOrder, { fields: [quotationItem.blanket_order], references: [blanketOrder.id] }),
}));

export const smsCenterRelations = relations(smsCenter, ({ one }) => ({
  customer: one(customer, { fields: [smsCenter.customer], references: [customer.id] }),
  supplier: one(supplier, { fields: [smsCenter.supplier], references: [supplier.id] }),
  salesPartner: one(salesPartner, { fields: [smsCenter.sales_partner], references: [salesPartner.id] }),
  department: one(department, { fields: [smsCenter.department], references: [department.id] }),
  branch: one(branch, { fields: [smsCenter.branch], references: [branch.id] }),
}));

export const salesOrderRelations = relations(salesOrder, ({ one, many }) => ({
  company: one(company, { fields: [salesOrder.company], references: [company.id] }),
  customer: one(customer, { fields: [salesOrder.customer], references: [customer.id] }),
  amendedFrom: one(salesOrder, { fields: [salesOrder.amended_from], references: [salesOrder.id] }),
  costCenter: one(costCenter, { fields: [salesOrder.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [salesOrder.project], references: [project.id] }),
  sellingPriceList: one(priceList, { fields: [salesOrder.selling_price_list], references: [priceList.id] }),
  setWarehouse: one(warehouse, { fields: [salesOrder.set_warehouse], references: [warehouse.id] }),
  taxCategory: one(taxCategory, { fields: [salesOrder.tax_category], references: [taxCategory.id] }),
  taxesAndCharges: one(salesTaxesAndChargesTemplate, { fields: [salesOrder.taxes_and_charges], references: [salesTaxesAndChargesTemplate.id] }),
  shippingRule: one(shippingRule, { fields: [salesOrder.shipping_rule], references: [shippingRule.id] }),
  incoterm: one(incoterm, { fields: [salesOrder.incoterm], references: [incoterm.id] }),
  couponCode: one(couponCode, { fields: [salesOrder.coupon_code], references: [couponCode.id] }),
  customerGroup: one(customerGroup, { fields: [salesOrder.customer_group], references: [customerGroup.id] }),
  territory: one(territory, { fields: [salesOrder.territory], references: [territory.id] }),
  paymentTermsTemplate: one(paymentTermsTemplate, { fields: [salesOrder.payment_terms_template], references: [paymentTermsTemplate.id] }),
  tcName: one(termsAndConditions, { fields: [salesOrder.tc_name], references: [termsAndConditions.id] }),
  salesPartner: one(salesPartner, { fields: [salesOrder.sales_partner], references: [salesPartner.id] }),
  representsCompany: one(company, { fields: [salesOrder.represents_company], references: [company.id] }),
  interCompanyOrderReference: one(purchaseOrder, { fields: [salesOrder.inter_company_order_reference], references: [purchaseOrder.id] }),
  items: many(salesOrderItem),
  pricingRules: many(pricingRuleDetail),
  taxes: many(salesTaxesAndCharges),
  packedItems: many(packedItem),
  paymentSchedule: many(paymentSchedule),
  salesTeam: many(salesTeam),
  itemWiseTaxDetails: many(itemWiseTaxDetail),
}));

export const salesOrderItemRelations = relations(salesOrderItem, ({ one }) => ({
  fgItem: one(item, { fields: [salesOrderItem.fg_item], references: [item.id] }),
  itemCode: one(item, { fields: [salesOrderItem.item_code], references: [item.id] }),
  itemGroup: one(itemGroup, { fields: [salesOrderItem.item_group], references: [itemGroup.id] }),
  brand: one(brand, { fields: [salesOrderItem.brand], references: [brand.id] }),
  stockUom: one(uom, { fields: [salesOrderItem.stock_uom], references: [uom.id] }),
  uom: one(uom, { fields: [salesOrderItem.uom], references: [uom.id] }),
  itemTaxTemplate: one(itemTaxTemplate, { fields: [salesOrderItem.item_tax_template], references: [itemTaxTemplate.id] }),
  supplier: one(supplier, { fields: [salesOrderItem.supplier], references: [supplier.id] }),
  weightUom: one(uom, { fields: [salesOrderItem.weight_uom], references: [uom.id] }),
  warehouse: one(warehouse, { fields: [salesOrderItem.warehouse], references: [warehouse.id] }),
  targetWarehouse: one(warehouse, { fields: [salesOrderItem.target_warehouse], references: [warehouse.id] }),
  prevdocDocname: one(quotation, { fields: [salesOrderItem.prevdoc_docname], references: [quotation.id] }),
  blanketOrder: one(blanketOrder, { fields: [salesOrderItem.blanket_order], references: [blanketOrder.id] }),
  bomNo: one(bom, { fields: [salesOrderItem.bom_no], references: [bom.id] }),
  materialRequest: one(materialRequest, { fields: [salesOrderItem.material_request], references: [materialRequest.id] }),
  purchaseOrder: one(purchaseOrder, { fields: [salesOrderItem.purchase_order], references: [purchaseOrder.id] }),
  costCenter: one(costCenter, { fields: [salesOrderItem.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [salesOrderItem.project], references: [project.id] }),
}));

export const salesTeamRelations = relations(salesTeam, ({ one }) => ({
  salesPerson: one(salesPerson, { fields: [salesTeam.sales_person], references: [salesPerson.id] }),
}));

export const sellingSettingsRelations = relations(sellingSettings, ({ one }) => ({
  customerGroup: one(customerGroup, { fields: [sellingSettings.customer_group], references: [customerGroup.id] }),
  territory: one(territory, { fields: [sellingSettings.territory], references: [territory.id] }),
  sellingPriceList: one(priceList, { fields: [sellingSettings.selling_price_list], references: [priceList.id] }),
}));

export const supplierNumberAtCustomerRelations = relations(supplierNumberAtCustomer, ({ one }) => ({
  company: one(company, { fields: [supplierNumberAtCustomer.company], references: [company.id] }),
}));

export const authorizationRuleRelations = relations(authorizationRule, ({ one }) => ({
  company: one(company, { fields: [authorizationRule.company], references: [company.id] }),
  toEmp: one(employee, { fields: [authorizationRule.to_emp], references: [employee.id] }),
  toDesignation: one(designation, { fields: [authorizationRule.to_designation], references: [designation.id] }),
}));

export const brandRelations = relations(brand, ({ many }) => ({
  brandDefaults: many(itemDefault),
}));

export const companyRelations = relations(company, ({ one }) => ({
  defaultHolidayList: one(holidayList, { fields: [company.default_holiday_list], references: [holidayList.id] }),
  parentCompany: one(company, { fields: [company.parent_company], references: [company.id] }),
  existingCompany: one(company, { fields: [company.existing_company], references: [company.id] }),
  defaultBankAccount: one(account, { fields: [company.default_bank_account], references: [account.id] }),
  defaultCashAccount: one(account, { fields: [company.default_cash_account], references: [account.id] }),
  defaultReceivableAccount: one(account, { fields: [company.default_receivable_account], references: [account.id] }),
  defaultPayableAccount: one(account, { fields: [company.default_payable_account], references: [account.id] }),
  writeOffAccount: one(account, { fields: [company.write_off_account], references: [account.id] }),
  unrealizedProfitLossAccount: one(account, { fields: [company.unrealized_profit_loss_account], references: [account.id] }),
  defaultExpenseAccount: one(account, { fields: [company.default_expense_account], references: [account.id] }),
  defaultIncomeAccount: one(account, { fields: [company.default_income_account], references: [account.id] }),
  defaultDiscountAccount: one(account, { fields: [company.default_discount_account], references: [account.id] }),
  paymentTerms: one(paymentTermsTemplate, { fields: [company.payment_terms], references: [paymentTermsTemplate.id] }),
  costCenter: one(costCenter, { fields: [company.cost_center], references: [costCenter.id] }),
  defaultFinanceBook: one(financeBook, { fields: [company.default_finance_book], references: [financeBook.id] }),
  exchangeGainLossAccount: one(account, { fields: [company.exchange_gain_loss_account], references: [account.id] }),
  unrealizedExchangeGainLossAccount: one(account, { fields: [company.unrealized_exchange_gain_loss_account], references: [account.id] }),
  roundOffAccount: one(account, { fields: [company.round_off_account], references: [account.id] }),
  roundOffCostCenter: one(costCenter, { fields: [company.round_off_cost_center], references: [costCenter.id] }),
  roundOffForOpening: one(account, { fields: [company.round_off_for_opening], references: [account.id] }),
  defaultDeferredRevenueAccount: one(account, { fields: [company.default_deferred_revenue_account], references: [account.id] }),
  defaultDeferredExpenseAccount: one(account, { fields: [company.default_deferred_expense_account], references: [account.id] }),
  defaultAdvanceReceivedAccount: one(account, { fields: [company.default_advance_received_account], references: [account.id] }),
  defaultAdvancePaidAccount: one(account, { fields: [company.default_advance_paid_account], references: [account.id] }),
  accumulatedDepreciationAccount: one(account, { fields: [company.accumulated_depreciation_account], references: [account.id] }),
  depreciationExpenseAccount: one(account, { fields: [company.depreciation_expense_account], references: [account.id] }),
  disposalAccount: one(account, { fields: [company.disposal_account], references: [account.id] }),
  depreciationCostCenter: one(costCenter, { fields: [company.depreciation_cost_center], references: [costCenter.id] }),
  capitalWorkInProgressAccount: one(account, { fields: [company.capital_work_in_progress_account], references: [account.id] }),
  assetReceivedButNotBilled: one(account, { fields: [company.asset_received_but_not_billed], references: [account.id] }),
  defaultBuyingTerms: one(termsAndConditions, { fields: [company.default_buying_terms], references: [termsAndConditions.id] }),
  defaultSellingTerms: one(termsAndConditions, { fields: [company.default_selling_terms], references: [termsAndConditions.id] }),
  defaultWarehouseForSalesReturn: one(warehouse, { fields: [company.default_warehouse_for_sales_return], references: [warehouse.id] }),
  purchaseExpenseAccount: one(account, { fields: [company.purchase_expense_account], references: [account.id] }),
  serviceExpenseAccount: one(account, { fields: [company.service_expense_account], references: [account.id] }),
  purchaseExpenseContraAccount: one(account, { fields: [company.purchase_expense_contra_account], references: [account.id] }),
  defaultInventoryAccount: one(account, { fields: [company.default_inventory_account], references: [account.id] }),
  stockAdjustmentAccount: one(account, { fields: [company.stock_adjustment_account], references: [account.id] }),
  stockReceivedButNotBilled: one(account, { fields: [company.stock_received_but_not_billed], references: [account.id] }),
  defaultProvisionalAccount: one(account, { fields: [company.default_provisional_account], references: [account.id] }),
  defaultInTransitWarehouse: one(warehouse, { fields: [company.default_in_transit_warehouse], references: [warehouse.id] }),
  defaultOperatingCostAccount: one(account, { fields: [company.default_operating_cost_account], references: [account.id] }),
  defaultWipWarehouse: one(warehouse, { fields: [company.default_wip_warehouse], references: [warehouse.id] }),
  defaultFgWarehouse: one(warehouse, { fields: [company.default_fg_warehouse], references: [warehouse.id] }),
  defaultScrapWarehouse: one(warehouse, { fields: [company.default_scrap_warehouse], references: [warehouse.id] }),
}));

export const customerGroupRelations = relations(customerGroup, ({ one, many }) => ({
  parentCustomerGroup: one(customerGroup, { fields: [customerGroup.parent_customer_group], references: [customerGroup.id] }),
  defaultPriceList: one(priceList, { fields: [customerGroup.default_price_list], references: [priceList.id] }),
  paymentTerms: one(paymentTermsTemplate, { fields: [customerGroup.payment_terms], references: [paymentTermsTemplate.id] }),
  oldParent: one(customerGroup, { fields: [customerGroup.old_parent], references: [customerGroup.id] }),
  accounts: many(partyAccount),
  creditLimits: many(customerCreditLimit),
}));

export const departmentRelations = relations(department, ({ one }) => ({
  parentDepartment: one(department, { fields: [department.parent_department], references: [department.id] }),
  company: one(company, { fields: [department.company], references: [company.id] }),
}));

export const driverRelations = relations(driver, ({ one, many }) => ({
  transporter: one(supplier, { fields: [driver.transporter], references: [supplier.id] }),
  employee: one(employee, { fields: [driver.employee], references: [employee.id] }),
  drivingLicenseCategory: many(drivingLicenseCategory),
}));

export const emailDigestRelations = relations(emailDigest, ({ one, many }) => ({
  company: one(company, { fields: [emailDigest.company], references: [company.id] }),
  recipients: many(emailDigestRecipient),
}));

export const employeeRelations = relations(employee, ({ one, many }) => ({
  company: one(company, { fields: [employee.company], references: [company.id] }),
  department: one(department, { fields: [employee.department], references: [department.id] }),
  designation: one(designation, { fields: [employee.designation], references: [designation.id] }),
  reportsTo: one(employee, { fields: [employee.reports_to], references: [employee.id] }),
  branch: one(branch, { fields: [employee.branch], references: [branch.id] }),
  holidayList: one(holidayList, { fields: [employee.holiday_list], references: [holidayList.id] }),
  education: many(employeeEducation),
  externalWorkHistory: many(employeeExternalWorkHistory),
  internalWorkHistory: many(employeeInternalWorkHistory),
}));

export const employeeGroupRelations = relations(employeeGroup, ({ many }) => ({
  employeeList: many(employeeGroupTable),
}));

export const employeeGroupTableRelations = relations(employeeGroupTable, ({ one }) => ({
  employee: one(employee, { fields: [employeeGroupTable.employee], references: [employee.id] }),
}));

export const employeeInternalWorkHistoryRelations = relations(employeeInternalWorkHistory, ({ one }) => ({
  branch: one(branch, { fields: [employeeInternalWorkHistory.branch], references: [branch.id] }),
  department: one(department, { fields: [employeeInternalWorkHistory.department], references: [department.id] }),
  designation: one(designation, { fields: [employeeInternalWorkHistory.designation], references: [designation.id] }),
}));

export const globalDefaultsRelations = relations(globalDefaults, ({ one }) => ({
  defaultCompany: one(company, { fields: [globalDefaults.default_company], references: [company.id] }),
  defaultDistanceUnit: one(uom, { fields: [globalDefaults.default_distance_unit], references: [uom.id] }),
  demoCompany: one(company, { fields: [globalDefaults.demo_company], references: [company.id] }),
}));

export const holidayListRelations = relations(holidayList, ({ many }) => ({
  holidays: many(holiday),
}));

export const itemGroupRelations = relations(itemGroup, ({ one, many }) => ({
  parentItemGroup: one(itemGroup, { fields: [itemGroup.parent_item_group], references: [itemGroup.id] }),
  oldParent: one(itemGroup, { fields: [itemGroup.old_parent], references: [itemGroup.id] }),
  itemGroupDefaults: many(itemDefault),
  taxes: many(itemTax),
}));

export const quotationLostReasonDetailRelations = relations(quotationLostReasonDetail, ({ one }) => ({
  lostReason: one(quotationLostReason, { fields: [quotationLostReasonDetail.lost_reason], references: [quotationLostReason.id] }),
}));

export const salesPartnerRelations = relations(salesPartner, ({ one, many }) => ({
  partnerType: one(salesPartnerType, { fields: [salesPartner.partner_type], references: [salesPartnerType.id] }),
  territory: one(territory, { fields: [salesPartner.territory], references: [territory.id] }),
  targets: many(targetDetail),
}));

export const salesPersonRelations = relations(salesPerson, ({ one, many }) => ({
  parentSalesPerson: one(salesPerson, { fields: [salesPerson.parent_sales_person], references: [salesPerson.id] }),
  employee: one(employee, { fields: [salesPerson.employee], references: [employee.id] }),
  department: one(department, { fields: [salesPerson.department], references: [department.id] }),
  targets: many(targetDetail),
}));

export const supplierGroupRelations = relations(supplierGroup, ({ one, many }) => ({
  parentSupplierGroup: one(supplierGroup, { fields: [supplierGroup.parent_supplier_group], references: [supplierGroup.id] }),
  paymentTerms: one(paymentTermsTemplate, { fields: [supplierGroup.payment_terms], references: [paymentTermsTemplate.id] }),
  oldParent: one(supplierGroup, { fields: [supplierGroup.old_parent], references: [supplierGroup.id] }),
  accounts: many(partyAccount),
}));

export const targetDetailRelations = relations(targetDetail, ({ one }) => ({
  itemGroup: one(itemGroup, { fields: [targetDetail.item_group], references: [itemGroup.id] }),
  fiscalYear: one(fiscalYear, { fields: [targetDetail.fiscal_year], references: [fiscalYear.id] }),
  distributionId: one(monthlyDistribution, { fields: [targetDetail.distribution_id], references: [monthlyDistribution.id] }),
}));

export const territoryRelations = relations(territory, ({ one, many }) => ({
  parentTerritory: one(territory, { fields: [territory.parent_territory], references: [territory.id] }),
  territoryManager: one(salesPerson, { fields: [territory.territory_manager], references: [salesPerson.id] }),
  oldParent: one(territory, { fields: [territory.old_parent], references: [territory.id] }),
  targets: many(targetDetail),
}));

export const transactionDeletionRecordRelations = relations(transactionDeletionRecord, ({ one, many }) => ({
  company: one(company, { fields: [transactionDeletionRecord.company], references: [company.id] }),
  amendedFrom: one(transactionDeletionRecord, { fields: [transactionDeletionRecord.amended_from], references: [transactionDeletionRecord.id] }),
  doctypes: many(transactionDeletionRecordDetails),
  doctypesToDelete: many(transactionDeletionRecordToDelete),
  doctypesToBeIgnored: many(transactionDeletionRecordItem),
}));

export const uomConversionFactorRelations = relations(uomConversionFactor, ({ one }) => ({
  category: one(uomCategory, { fields: [uomConversionFactor.category], references: [uomCategory.id] }),
  fromUom: one(uom, { fields: [uomConversionFactor.from_uom], references: [uom.id] }),
  toUom: one(uom, { fields: [uomConversionFactor.to_uom], references: [uom.id] }),
}));

export const vehicleRelations = relations(vehicle, ({ one }) => ({
  company: one(company, { fields: [vehicle.company], references: [company.id] }),
  employee: one(employee, { fields: [vehicle.employee], references: [employee.id] }),
  uom: one(uom, { fields: [vehicle.uom], references: [uom.id] }),
  amendedFrom: one(vehicle, { fields: [vehicle.amended_from], references: [vehicle.id] }),
}));

export const websiteItemGroupRelations = relations(websiteItemGroup, ({ one }) => ({
  itemGroup: one(itemGroup, { fields: [websiteItemGroup.item_group], references: [itemGroup.id] }),
}));

export const batchRelations = relations(batch, ({ one }) => ({
  item: one(item, { fields: [batch.item], references: [item.id] }),
  parentBatch: one(batch, { fields: [batch.parent_batch], references: [batch.id] }),
  stockUom: one(uom, { fields: [batch.stock_uom], references: [uom.id] }),
  supplier: one(supplier, { fields: [batch.supplier], references: [supplier.id] }),
}));

export const binRelations = relations(bin, ({ one }) => ({
  itemCode: one(item, { fields: [bin.item_code], references: [item.id] }),
  warehouse: one(warehouse, { fields: [bin.warehouse], references: [warehouse.id] }),
  stockUom: one(uom, { fields: [bin.stock_uom], references: [uom.id] }),
  company: one(company, { fields: [bin.company], references: [company.id] }),
}));

export const deliveryNoteRelations = relations(deliveryNote, ({ one, many }) => ({
  customer: one(customer, { fields: [deliveryNote.customer], references: [customer.id] }),
  company: one(company, { fields: [deliveryNote.company], references: [company.id] }),
  amendedFrom: one(deliveryNote, { fields: [deliveryNote.amended_from], references: [deliveryNote.id] }),
  returnAgainst: one(deliveryNote, { fields: [deliveryNote.return_against], references: [deliveryNote.id] }),
  costCenter: one(costCenter, { fields: [deliveryNote.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [deliveryNote.project], references: [project.id] }),
  sellingPriceList: one(priceList, { fields: [deliveryNote.selling_price_list], references: [priceList.id] }),
  setWarehouse: one(warehouse, { fields: [deliveryNote.set_warehouse], references: [warehouse.id] }),
  setTargetWarehouse: one(warehouse, { fields: [deliveryNote.set_target_warehouse], references: [warehouse.id] }),
  taxCategory: one(taxCategory, { fields: [deliveryNote.tax_category], references: [taxCategory.id] }),
  taxesAndCharges: one(salesTaxesAndChargesTemplate, { fields: [deliveryNote.taxes_and_charges], references: [salesTaxesAndChargesTemplate.id] }),
  shippingRule: one(shippingRule, { fields: [deliveryNote.shipping_rule], references: [shippingRule.id] }),
  incoterm: one(incoterm, { fields: [deliveryNote.incoterm], references: [incoterm.id] }),
  tcName: one(termsAndConditions, { fields: [deliveryNote.tc_name], references: [termsAndConditions.id] }),
  transporter: one(supplier, { fields: [deliveryNote.transporter], references: [supplier.id] }),
  deliveryTrip: one(deliveryTrip, { fields: [deliveryNote.delivery_trip], references: [deliveryTrip.id] }),
  driver: one(driver, { fields: [deliveryNote.driver], references: [driver.id] }),
  salesPartner: one(salesPartner, { fields: [deliveryNote.sales_partner], references: [salesPartner.id] }),
  representsCompany: one(company, { fields: [deliveryNote.represents_company], references: [company.id] }),
  interCompanyReference: one(purchaseReceipt, { fields: [deliveryNote.inter_company_reference], references: [purchaseReceipt.id] }),
  customerGroup: one(customerGroup, { fields: [deliveryNote.customer_group], references: [customerGroup.id] }),
  territory: one(territory, { fields: [deliveryNote.territory], references: [territory.id] }),
  items: many(deliveryNoteItem),
  pricingRules: many(pricingRuleDetail),
  packedItems: many(packedItem),
  taxes: many(salesTaxesAndCharges),
  salesTeam: many(salesTeam),
  itemWiseTaxDetails: many(itemWiseTaxDetail),
}));

export const deliveryNoteItemRelations = relations(deliveryNoteItem, ({ one }) => ({
  itemCode: one(item, { fields: [deliveryNoteItem.item_code], references: [item.id] }),
  brand: one(brand, { fields: [deliveryNoteItem.brand], references: [brand.id] }),
  itemGroup: one(itemGroup, { fields: [deliveryNoteItem.item_group], references: [itemGroup.id] }),
  stockUom: one(uom, { fields: [deliveryNoteItem.stock_uom], references: [uom.id] }),
  uom: one(uom, { fields: [deliveryNoteItem.uom], references: [uom.id] }),
  itemTaxTemplate: one(itemTaxTemplate, { fields: [deliveryNoteItem.item_tax_template], references: [itemTaxTemplate.id] }),
  weightUom: one(uom, { fields: [deliveryNoteItem.weight_uom], references: [uom.id] }),
  warehouse: one(warehouse, { fields: [deliveryNoteItem.warehouse], references: [warehouse.id] }),
  targetWarehouse: one(warehouse, { fields: [deliveryNoteItem.target_warehouse], references: [warehouse.id] }),
  qualityInspection: one(qualityInspection, { fields: [deliveryNoteItem.quality_inspection], references: [qualityInspection.id] }),
  againstSalesOrder: one(salesOrder, { fields: [deliveryNoteItem.against_sales_order], references: [salesOrder.id] }),
  againstSalesInvoice: one(salesInvoice, { fields: [deliveryNoteItem.against_sales_invoice], references: [salesInvoice.id] }),
  againstPickList: one(pickList, { fields: [deliveryNoteItem.against_pick_list], references: [pickList.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [deliveryNoteItem.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  batchNo: one(batch, { fields: [deliveryNoteItem.batch_no], references: [batch.id] }),
  expenseAccount: one(account, { fields: [deliveryNoteItem.expense_account], references: [account.id] }),
  materialRequest: one(materialRequest, { fields: [deliveryNoteItem.material_request], references: [materialRequest.id] }),
  purchaseOrder: one(purchaseOrder, { fields: [deliveryNoteItem.purchase_order], references: [purchaseOrder.id] }),
  costCenter: one(costCenter, { fields: [deliveryNoteItem.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [deliveryNoteItem.project], references: [project.id] }),
}));

export const deliveryStopRelations = relations(deliveryStop, ({ one }) => ({
  customer: one(customer, { fields: [deliveryStop.customer], references: [customer.id] }),
  deliveryNote: one(deliveryNote, { fields: [deliveryStop.delivery_note], references: [deliveryNote.id] }),
  uom: one(uom, { fields: [deliveryStop.uom], references: [uom.id] }),
}));

export const deliveryTripRelations = relations(deliveryTrip, ({ one, many }) => ({
  company: one(company, { fields: [deliveryTrip.company], references: [company.id] }),
  driver: one(driver, { fields: [deliveryTrip.driver], references: [driver.id] }),
  uom: one(uom, { fields: [deliveryTrip.uom], references: [uom.id] }),
  vehicle: one(vehicle, { fields: [deliveryTrip.vehicle], references: [vehicle.id] }),
  employee: one(employee, { fields: [deliveryTrip.employee], references: [employee.id] }),
  amendedFrom: one(deliveryTrip, { fields: [deliveryTrip.amended_from], references: [deliveryTrip.id] }),
  deliveryStops: many(deliveryStop),
}));

export const itemRelations = relations(item, ({ one, many }) => ({
  itemGroup: one(itemGroup, { fields: [item.item_group], references: [itemGroup.id] }),
  stockUom: one(uom, { fields: [item.stock_uom], references: [uom.id] }),
  assetCategory: one(assetCategory, { fields: [item.asset_category], references: [assetCategory.id] }),
  brand: one(brand, { fields: [item.brand], references: [brand.id] }),
  weightUom: one(uom, { fields: [item.weight_uom], references: [uom.id] }),
  variantOf: one(item, { fields: [item.variant_of], references: [item.id] }),
  purchaseUom: one(uom, { fields: [item.purchase_uom], references: [uom.id] }),
  customer: one(customer, { fields: [item.customer], references: [customer.id] }),
  customsTariffNumber: one(customsTariffNumber, { fields: [item.customs_tariff_number], references: [customsTariffNumber.id] }),
  salesUom: one(uom, { fields: [item.sales_uom], references: [uom.id] }),
  purchaseTaxWithholdingCategory: one(taxWithholdingCategory, { fields: [item.purchase_tax_withholding_category], references: [taxWithholdingCategory.id] }),
  salesTaxWithholdingCategory: one(taxWithholdingCategory, { fields: [item.sales_tax_withholding_category], references: [taxWithholdingCategory.id] }),
  qualityInspectionTemplate: one(qualityInspectionTemplate, { fields: [item.quality_inspection_template], references: [qualityInspectionTemplate.id] }),
  defaultBom: one(bom, { fields: [item.default_bom], references: [bom.id] }),
  defaultItemManufacturer: one(manufacturer, { fields: [item.default_item_manufacturer], references: [manufacturer.id] }),
  barcodes: many(itemBarcode),
  reorderLevels: many(itemReorder),
  uoms: many(uomConversionDetail),
  attributes: many(itemVariantAttribute),
  itemDefaults: many(itemDefault),
  supplierItems: many(itemSupplier),
  customerItems: many(itemCustomerDetail),
  taxes: many(itemTax),
}));

export const itemAlternativeRelations = relations(itemAlternative, ({ one }) => ({
  itemCode: one(item, { fields: [itemAlternative.item_code], references: [item.id] }),
  alternativeItemCode: one(item, { fields: [itemAlternative.alternative_item_code], references: [item.id] }),
}));

export const itemAttributeRelations = relations(itemAttribute, ({ many }) => ({
  itemAttributeValues: many(itemAttributeValue),
}));

export const itemBarcodeRelations = relations(itemBarcode, ({ one }) => ({
  uom: one(uom, { fields: [itemBarcode.uom], references: [uom.id] }),
}));

export const itemCustomerDetailRelations = relations(itemCustomerDetail, ({ one }) => ({
  customerName: one(customer, { fields: [itemCustomerDetail.customer_name], references: [customer.id] }),
  customerGroup: one(customerGroup, { fields: [itemCustomerDetail.customer_group], references: [customerGroup.id] }),
}));

export const itemDefaultRelations = relations(itemDefault, ({ one }) => ({
  company: one(company, { fields: [itemDefault.company], references: [company.id] }),
  defaultWarehouse: one(warehouse, { fields: [itemDefault.default_warehouse], references: [warehouse.id] }),
  defaultPriceList: one(priceList, { fields: [itemDefault.default_price_list], references: [priceList.id] }),
  defaultDiscountAccount: one(account, { fields: [itemDefault.default_discount_account], references: [account.id] }),
  defaultInventoryAccount: one(account, { fields: [itemDefault.default_inventory_account], references: [account.id] }),
  buyingCostCenter: one(costCenter, { fields: [itemDefault.buying_cost_center], references: [costCenter.id] }),
  defaultSupplier: one(supplier, { fields: [itemDefault.default_supplier], references: [supplier.id] }),
  expenseAccount: one(account, { fields: [itemDefault.expense_account], references: [account.id] }),
  defaultProvisionalAccount: one(account, { fields: [itemDefault.default_provisional_account], references: [account.id] }),
  purchaseExpenseAccount: one(account, { fields: [itemDefault.purchase_expense_account], references: [account.id] }),
  purchaseExpenseContraAccount: one(account, { fields: [itemDefault.purchase_expense_contra_account], references: [account.id] }),
  sellingCostCenter: one(costCenter, { fields: [itemDefault.selling_cost_center], references: [costCenter.id] }),
  incomeAccount: one(account, { fields: [itemDefault.income_account], references: [account.id] }),
  defaultCogsAccount: one(account, { fields: [itemDefault.default_cogs_account], references: [account.id] }),
  deferredExpenseAccount: one(account, { fields: [itemDefault.deferred_expense_account], references: [account.id] }),
  deferredRevenueAccount: one(account, { fields: [itemDefault.deferred_revenue_account], references: [account.id] }),
}));

export const itemLeadTimeRelations = relations(itemLeadTime, ({ one }) => ({
  itemCode: one(item, { fields: [itemLeadTime.item_code], references: [item.id] }),
  stockUom: one(uom, { fields: [itemLeadTime.stock_uom], references: [uom.id] }),
}));

export const itemManufacturerRelations = relations(itemManufacturer, ({ one }) => ({
  itemCode: one(item, { fields: [itemManufacturer.item_code], references: [item.id] }),
  manufacturer: one(manufacturer, { fields: [itemManufacturer.manufacturer], references: [manufacturer.id] }),
}));

export const itemPriceRelations = relations(itemPrice, ({ one }) => ({
  itemCode: one(item, { fields: [itemPrice.item_code], references: [item.id] }),
  uom: one(uom, { fields: [itemPrice.uom], references: [uom.id] }),
  brand: one(brand, { fields: [itemPrice.brand], references: [brand.id] }),
  priceList: one(priceList, { fields: [itemPrice.price_list], references: [priceList.id] }),
  customer: one(customer, { fields: [itemPrice.customer], references: [customer.id] }),
  supplier: one(supplier, { fields: [itemPrice.supplier], references: [supplier.id] }),
  batchNo: one(batch, { fields: [itemPrice.batch_no], references: [batch.id] }),
}));

export const itemQualityInspectionParameterRelations = relations(itemQualityInspectionParameter, ({ one }) => ({
  specification: one(qualityInspectionParameter, { fields: [itemQualityInspectionParameter.specification], references: [qualityInspectionParameter.id] }),
  parameterGroup: one(qualityInspectionParameterGroup, { fields: [itemQualityInspectionParameter.parameter_group], references: [qualityInspectionParameterGroup.id] }),
}));

export const itemReorderRelations = relations(itemReorder, ({ one }) => ({
  warehouse: one(warehouse, { fields: [itemReorder.warehouse], references: [warehouse.id] }),
  warehouseGroup: one(warehouse, { fields: [itemReorder.warehouse_group], references: [warehouse.id] }),
}));

export const itemSupplierRelations = relations(itemSupplier, ({ one }) => ({
  supplier: one(supplier, { fields: [itemSupplier.supplier], references: [supplier.id] }),
}));

export const itemTaxRelations = relations(itemTax, ({ one }) => ({
  itemTaxTemplate: one(itemTaxTemplate, { fields: [itemTax.item_tax_template], references: [itemTaxTemplate.id] }),
  taxCategory: one(taxCategory, { fields: [itemTax.tax_category], references: [taxCategory.id] }),
}));

export const itemVariantRelations = relations(itemVariant, ({ one }) => ({
  itemAttribute: one(itemAttribute, { fields: [itemVariant.item_attribute], references: [itemAttribute.id] }),
}));

export const itemVariantAttributeRelations = relations(itemVariantAttribute, ({ one }) => ({
  variantOf: one(item, { fields: [itemVariantAttribute.variant_of], references: [item.id] }),
  attribute: one(itemAttribute, { fields: [itemVariantAttribute.attribute], references: [itemAttribute.id] }),
}));

export const itemVariantSettingsRelations = relations(itemVariantSettings, ({ many }) => ({
  fields: many(variantField),
}));

export const landedCostItemRelations = relations(landedCostItem, ({ one }) => ({
  itemCode: one(item, { fields: [landedCostItem.item_code], references: [item.id] }),
  costCenter: one(costCenter, { fields: [landedCostItem.cost_center], references: [costCenter.id] }),
}));

export const landedCostPurchaseReceiptRelations = relations(landedCostPurchaseReceipt, ({ one }) => ({
  supplier: one(supplier, { fields: [landedCostPurchaseReceipt.supplier], references: [supplier.id] }),
}));

export const landedCostTaxesAndChargesRelations = relations(landedCostTaxesAndCharges, ({ one }) => ({
  expenseAccount: one(account, { fields: [landedCostTaxesAndCharges.expense_account], references: [account.id] }),
}));

export const landedCostVendorInvoiceRelations = relations(landedCostVendorInvoice, ({ one }) => ({
  vendorInvoice: one(purchaseInvoice, { fields: [landedCostVendorInvoice.vendor_invoice], references: [purchaseInvoice.id] }),
}));

export const landedCostVoucherRelations = relations(landedCostVoucher, ({ one, many }) => ({
  company: one(company, { fields: [landedCostVoucher.company], references: [company.id] }),
  amendedFrom: one(landedCostVoucher, { fields: [landedCostVoucher.amended_from], references: [landedCostVoucher.id] }),
  purchaseReceipts: many(landedCostPurchaseReceipt),
  items: many(landedCostItem),
  taxes: many(landedCostTaxesAndCharges),
  vendorInvoices: many(landedCostVendorInvoice),
}));

export const materialRequestRelations = relations(materialRequest, ({ one, many }) => ({
  customer: one(customer, { fields: [materialRequest.customer], references: [customer.id] }),
  company: one(company, { fields: [materialRequest.company], references: [company.id] }),
  buyingPriceList: one(priceList, { fields: [materialRequest.buying_price_list], references: [priceList.id] }),
  amendedFrom: one(materialRequest, { fields: [materialRequest.amended_from], references: [materialRequest.id] }),
  setFromWarehouse: one(warehouse, { fields: [materialRequest.set_from_warehouse], references: [warehouse.id] }),
  setWarehouse: one(warehouse, { fields: [materialRequest.set_warehouse], references: [warehouse.id] }),
  tcName: one(termsAndConditions, { fields: [materialRequest.tc_name], references: [termsAndConditions.id] }),
  jobCard: one(jobCard, { fields: [materialRequest.job_card], references: [jobCard.id] }),
  workOrder: one(workOrder, { fields: [materialRequest.work_order], references: [workOrder.id] }),
  items: many(materialRequestItem),
}));

export const materialRequestItemRelations = relations(materialRequestItem, ({ one }) => ({
  itemCode: one(item, { fields: [materialRequestItem.item_code], references: [item.id] }),
  itemGroup: one(itemGroup, { fields: [materialRequestItem.item_group], references: [itemGroup.id] }),
  brand: one(brand, { fields: [materialRequestItem.brand], references: [brand.id] }),
  stockUom: one(uom, { fields: [materialRequestItem.stock_uom], references: [uom.id] }),
  fromWarehouse: one(warehouse, { fields: [materialRequestItem.from_warehouse], references: [warehouse.id] }),
  warehouse: one(warehouse, { fields: [materialRequestItem.warehouse], references: [warehouse.id] }),
  uom: one(uom, { fields: [materialRequestItem.uom], references: [uom.id] }),
  expenseAccount: one(account, { fields: [materialRequestItem.expense_account], references: [account.id] }),
  wipCompositeAsset: one(asset, { fields: [materialRequestItem.wip_composite_asset], references: [asset.id] }),
  manufacturer: one(manufacturer, { fields: [materialRequestItem.manufacturer], references: [manufacturer.id] }),
  bomNo: one(bom, { fields: [materialRequestItem.bom_no], references: [bom.id] }),
  project: one(project, { fields: [materialRequestItem.project], references: [project.id] }),
  costCenter: one(costCenter, { fields: [materialRequestItem.cost_center], references: [costCenter.id] }),
  salesOrder: one(salesOrder, { fields: [materialRequestItem.sales_order], references: [salesOrder.id] }),
  productionPlan: one(productionPlan, { fields: [materialRequestItem.production_plan], references: [productionPlan.id] }),
}));

export const packedItemRelations = relations(packedItem, ({ one }) => ({
  parentItem: one(item, { fields: [packedItem.parent_item], references: [item.id] }),
  itemCode: one(item, { fields: [packedItem.item_code], references: [item.id] }),
  warehouse: one(warehouse, { fields: [packedItem.warehouse], references: [warehouse.id] }),
  targetWarehouse: one(warehouse, { fields: [packedItem.target_warehouse], references: [warehouse.id] }),
  uom: one(uom, { fields: [packedItem.uom], references: [uom.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [packedItem.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  batchNo: one(batch, { fields: [packedItem.batch_no], references: [batch.id] }),
}));

export const packingSlipRelations = relations(packingSlip, ({ one, many }) => ({
  deliveryNote: one(deliveryNote, { fields: [packingSlip.delivery_note], references: [deliveryNote.id] }),
  netWeightUom: one(uom, { fields: [packingSlip.net_weight_uom], references: [uom.id] }),
  grossWeightUom: one(uom, { fields: [packingSlip.gross_weight_uom], references: [uom.id] }),
  amendedFrom: one(packingSlip, { fields: [packingSlip.amended_from], references: [packingSlip.id] }),
  items: many(packingSlipItem),
}));

export const packingSlipItemRelations = relations(packingSlipItem, ({ one }) => ({
  itemCode: one(item, { fields: [packingSlipItem.item_code], references: [item.id] }),
  batchNo: one(batch, { fields: [packingSlipItem.batch_no], references: [batch.id] }),
  stockUom: one(uom, { fields: [packingSlipItem.stock_uom], references: [uom.id] }),
  weightUom: one(uom, { fields: [packingSlipItem.weight_uom], references: [uom.id] }),
}));

export const pickListRelations = relations(pickList, ({ one, many }) => ({
  company: one(company, { fields: [pickList.company], references: [company.id] }),
  customer: one(customer, { fields: [pickList.customer], references: [customer.id] }),
  workOrder: one(workOrder, { fields: [pickList.work_order], references: [workOrder.id] }),
  materialRequest: one(materialRequest, { fields: [pickList.material_request], references: [materialRequest.id] }),
  parentWarehouse: one(warehouse, { fields: [pickList.parent_warehouse], references: [warehouse.id] }),
  amendedFrom: one(pickList, { fields: [pickList.amended_from], references: [pickList.id] }),
  locations: many(pickListItem),
}));

export const pickListItemRelations = relations(pickListItem, ({ one }) => ({
  itemCode: one(item, { fields: [pickListItem.item_code], references: [item.id] }),
  warehouse: one(warehouse, { fields: [pickListItem.warehouse], references: [warehouse.id] }),
  uom: one(uom, { fields: [pickListItem.uom], references: [uom.id] }),
  stockUom: one(uom, { fields: [pickListItem.stock_uom], references: [uom.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [pickListItem.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  batchNo: one(batch, { fields: [pickListItem.batch_no], references: [batch.id] }),
  salesOrder: one(salesOrder, { fields: [pickListItem.sales_order], references: [salesOrder.id] }),
  materialRequest: one(materialRequest, { fields: [pickListItem.material_request], references: [materialRequest.id] }),
}));

export const priceListRelations = relations(priceList, ({ many }) => ({
  countries: many(priceListCountry),
}));

export const purchaseReceiptRelations = relations(purchaseReceipt, ({ one, many }) => ({
  supplier: one(supplier, { fields: [purchaseReceipt.supplier], references: [supplier.id] }),
  subcontractingReceipt: one(subcontractingReceipt, { fields: [purchaseReceipt.subcontracting_receipt], references: [subcontractingReceipt.id] }),
  company: one(company, { fields: [purchaseReceipt.company], references: [company.id] }),
  returnAgainst: one(purchaseReceipt, { fields: [purchaseReceipt.return_against], references: [purchaseReceipt.id] }),
  costCenter: one(costCenter, { fields: [purchaseReceipt.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [purchaseReceipt.project], references: [project.id] }),
  buyingPriceList: one(priceList, { fields: [purchaseReceipt.buying_price_list], references: [priceList.id] }),
  setWarehouse: one(warehouse, { fields: [purchaseReceipt.set_warehouse], references: [warehouse.id] }),
  setFromWarehouse: one(warehouse, { fields: [purchaseReceipt.set_from_warehouse], references: [warehouse.id] }),
  rejectedWarehouse: one(warehouse, { fields: [purchaseReceipt.rejected_warehouse], references: [warehouse.id] }),
  supplierWarehouse: one(warehouse, { fields: [purchaseReceipt.supplier_warehouse], references: [warehouse.id] }),
  taxCategory: one(taxCategory, { fields: [purchaseReceipt.tax_category], references: [taxCategory.id] }),
  taxesAndCharges: one(purchaseTaxesAndChargesTemplate, { fields: [purchaseReceipt.taxes_and_charges], references: [purchaseTaxesAndChargesTemplate.id] }),
  shippingRule: one(shippingRule, { fields: [purchaseReceipt.shipping_rule], references: [shippingRule.id] }),
  incoterm: one(incoterm, { fields: [purchaseReceipt.incoterm], references: [incoterm.id] }),
  tcName: one(termsAndConditions, { fields: [purchaseReceipt.tc_name], references: [termsAndConditions.id] }),
  representsCompany: one(company, { fields: [purchaseReceipt.represents_company], references: [company.id] }),
  interCompanyReference: one(deliveryNote, { fields: [purchaseReceipt.inter_company_reference], references: [deliveryNote.id] }),
  amendedFrom: one(purchaseReceipt, { fields: [purchaseReceipt.amended_from], references: [purchaseReceipt.id] }),
  items: many(purchaseReceiptItem),
  pricingRules: many(pricingRuleDetail),
  suppliedItems: many(purchaseReceiptItemSupplied),
  taxes: many(purchaseTaxesAndCharges),
  itemWiseTaxDetails: many(itemWiseTaxDetail),
}));

export const purchaseReceiptItemRelations = relations(purchaseReceiptItem, ({ one }) => ({
  itemCode: one(item, { fields: [purchaseReceiptItem.item_code], references: [item.id] }),
  productBundle: one(productBundle, { fields: [purchaseReceiptItem.product_bundle], references: [productBundle.id] }),
  brand: one(brand, { fields: [purchaseReceiptItem.brand], references: [brand.id] }),
  itemGroup: one(itemGroup, { fields: [purchaseReceiptItem.item_group], references: [itemGroup.id] }),
  uom: one(uom, { fields: [purchaseReceiptItem.uom], references: [uom.id] }),
  stockUom: one(uom, { fields: [purchaseReceiptItem.stock_uom], references: [uom.id] }),
  itemTaxTemplate: one(itemTaxTemplate, { fields: [purchaseReceiptItem.item_tax_template], references: [itemTaxTemplate.id] }),
  warehouse: one(warehouse, { fields: [purchaseReceiptItem.warehouse], references: [warehouse.id] }),
  rejectedWarehouse: one(warehouse, { fields: [purchaseReceiptItem.rejected_warehouse], references: [warehouse.id] }),
  fromWarehouse: one(warehouse, { fields: [purchaseReceiptItem.from_warehouse], references: [warehouse.id] }),
  materialRequest: one(materialRequest, { fields: [purchaseReceiptItem.material_request], references: [materialRequest.id] }),
  purchaseOrder: one(purchaseOrder, { fields: [purchaseReceiptItem.purchase_order], references: [purchaseOrder.id] }),
  purchaseInvoice: one(purchaseInvoice, { fields: [purchaseReceiptItem.purchase_invoice], references: [purchaseInvoice.id] }),
  assetLocation: one(location, { fields: [purchaseReceiptItem.asset_location], references: [location.id] }),
  assetCategory: one(assetCategory, { fields: [purchaseReceiptItem.asset_category], references: [assetCategory.id] }),
  qualityInspection: one(qualityInspection, { fields: [purchaseReceiptItem.quality_inspection], references: [qualityInspection.id] }),
  putawayRule: one(putawayRule, { fields: [purchaseReceiptItem.putaway_rule], references: [putawayRule.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [purchaseReceiptItem.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  rejectedSerialAndBatchBundle: one(serialAndBatchBundle, { fields: [purchaseReceiptItem.rejected_serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  batchNo: one(batch, { fields: [purchaseReceiptItem.batch_no], references: [batch.id] }),
  bom: one(bom, { fields: [purchaseReceiptItem.bom], references: [bom.id] }),
  weightUom: one(uom, { fields: [purchaseReceiptItem.weight_uom], references: [uom.id] }),
  manufacturer: one(manufacturer, { fields: [purchaseReceiptItem.manufacturer], references: [manufacturer.id] }),
  expenseAccount: one(account, { fields: [purchaseReceiptItem.expense_account], references: [account.id] }),
  wipCompositeAsset: one(asset, { fields: [purchaseReceiptItem.wip_composite_asset], references: [asset.id] }),
  provisionalExpenseAccount: one(account, { fields: [purchaseReceiptItem.provisional_expense_account], references: [account.id] }),
  project: one(project, { fields: [purchaseReceiptItem.project], references: [project.id] }),
  costCenter: one(costCenter, { fields: [purchaseReceiptItem.cost_center], references: [costCenter.id] }),
  salesOrder: one(salesOrder, { fields: [purchaseReceiptItem.sales_order], references: [salesOrder.id] }),
}));

export const putawayRuleRelations = relations(putawayRule, ({ one }) => ({
  itemCode: one(item, { fields: [putawayRule.item_code], references: [item.id] }),
  warehouse: one(warehouse, { fields: [putawayRule.warehouse], references: [warehouse.id] }),
  company: one(company, { fields: [putawayRule.company], references: [company.id] }),
  uom: one(uom, { fields: [putawayRule.uom], references: [uom.id] }),
  stockUom: one(uom, { fields: [putawayRule.stock_uom], references: [uom.id] }),
}));

export const qualityInspectionRelations = relations(qualityInspection, ({ one, many }) => ({
  company: one(company, { fields: [qualityInspection.company], references: [company.id] }),
  itemCode: one(item, { fields: [qualityInspection.item_code], references: [item.id] }),
  itemSerialNo: one(serialNo, { fields: [qualityInspection.item_serial_no], references: [serialNo.id] }),
  batchNo: one(batch, { fields: [qualityInspection.batch_no], references: [batch.id] }),
  bomNo: one(bom, { fields: [qualityInspection.bom_no], references: [bom.id] }),
  qualityInspectionTemplate: one(qualityInspectionTemplate, { fields: [qualityInspection.quality_inspection_template], references: [qualityInspectionTemplate.id] }),
  amendedFrom: one(qualityInspection, { fields: [qualityInspection.amended_from], references: [qualityInspection.id] }),
  readings: many(qualityInspectionReading),
}));

export const qualityInspectionParameterRelations = relations(qualityInspectionParameter, ({ one }) => ({
  parameterGroup: one(qualityInspectionParameterGroup, { fields: [qualityInspectionParameter.parameter_group], references: [qualityInspectionParameterGroup.id] }),
}));

export const qualityInspectionReadingRelations = relations(qualityInspectionReading, ({ one }) => ({
  specification: one(qualityInspectionParameter, { fields: [qualityInspectionReading.specification], references: [qualityInspectionParameter.id] }),
  parameterGroup: one(qualityInspectionParameterGroup, { fields: [qualityInspectionReading.parameter_group], references: [qualityInspectionParameterGroup.id] }),
}));

export const qualityInspectionTemplateRelations = relations(qualityInspectionTemplate, ({ many }) => ({
  itemQualityInspectionParameter: many(itemQualityInspectionParameter),
}));

export const quickStockBalanceRelations = relations(quickStockBalance, ({ one }) => ({
  warehouse: one(warehouse, { fields: [quickStockBalance.warehouse], references: [warehouse.id] }),
  item: one(item, { fields: [quickStockBalance.item], references: [item.id] }),
}));

export const repostItemValuationRelations = relations(repostItemValuation, ({ one }) => ({
  itemCode: one(item, { fields: [repostItemValuation.item_code], references: [item.id] }),
  warehouse: one(warehouse, { fields: [repostItemValuation.warehouse], references: [warehouse.id] }),
  company: one(company, { fields: [repostItemValuation.company], references: [company.id] }),
  amendedFrom: one(repostItemValuation, { fields: [repostItemValuation.amended_from], references: [repostItemValuation.id] }),
}));

export const serialNoRelations = relations(serialNo, ({ one }) => ({
  itemCode: one(item, { fields: [serialNo.item_code], references: [item.id] }),
  batchNo: one(batch, { fields: [serialNo.batch_no], references: [batch.id] }),
  warehouse: one(warehouse, { fields: [serialNo.warehouse], references: [warehouse.id] }),
  customer: one(customer, { fields: [serialNo.customer], references: [customer.id] }),
  itemGroup: one(itemGroup, { fields: [serialNo.item_group], references: [itemGroup.id] }),
  brand: one(brand, { fields: [serialNo.brand], references: [brand.id] }),
  asset: one(asset, { fields: [serialNo.asset], references: [asset.id] }),
  location: one(location, { fields: [serialNo.location], references: [location.id] }),
  employee: one(employee, { fields: [serialNo.employee], references: [employee.id] }),
  company: one(company, { fields: [serialNo.company], references: [company.id] }),
  workOrder: one(workOrder, { fields: [serialNo.work_order], references: [workOrder.id] }),
}));

export const serialAndBatchBundleRelations = relations(serialAndBatchBundle, ({ one, many }) => ({
  company: one(company, { fields: [serialAndBatchBundle.company], references: [company.id] }),
  itemCode: one(item, { fields: [serialAndBatchBundle.item_code], references: [item.id] }),
  warehouse: one(warehouse, { fields: [serialAndBatchBundle.warehouse], references: [warehouse.id] }),
  itemGroup: one(itemGroup, { fields: [serialAndBatchBundle.item_group], references: [itemGroup.id] }),
  amendedFrom: one(serialAndBatchBundle, { fields: [serialAndBatchBundle.amended_from], references: [serialAndBatchBundle.id] }),
  entries: many(serialAndBatchEntry),
}));

export const serialAndBatchEntryRelations = relations(serialAndBatchEntry, ({ one }) => ({
  serialNo: one(serialNo, { fields: [serialAndBatchEntry.serial_no], references: [serialNo.id] }),
  batchNo: one(batch, { fields: [serialAndBatchEntry.batch_no], references: [batch.id] }),
  itemCode: one(item, { fields: [serialAndBatchEntry.item_code], references: [item.id] }),
  warehouse: one(warehouse, { fields: [serialAndBatchEntry.warehouse], references: [warehouse.id] }),
}));

export const shipmentRelations = relations(shipment, ({ one, many }) => ({
  pickupCompany: one(company, { fields: [shipment.pickup_company], references: [company.id] }),
  pickupCustomer: one(customer, { fields: [shipment.pickup_customer], references: [customer.id] }),
  pickupSupplier: one(supplier, { fields: [shipment.pickup_supplier], references: [supplier.id] }),
  deliveryCompany: one(company, { fields: [shipment.delivery_company], references: [company.id] }),
  deliveryCustomer: one(customer, { fields: [shipment.delivery_customer], references: [customer.id] }),
  deliverySupplier: one(supplier, { fields: [shipment.delivery_supplier], references: [supplier.id] }),
  parcelTemplate: one(shipmentParcelTemplate, { fields: [shipment.parcel_template], references: [shipmentParcelTemplate.id] }),
  incoterm: one(incoterm, { fields: [shipment.incoterm], references: [incoterm.id] }),
  amendedFrom: one(shipment, { fields: [shipment.amended_from], references: [shipment.id] }),
  shipmentParcel: many(shipmentParcel),
  shipmentDeliveryNote: many(shipmentDeliveryNote),
}));

export const shipmentDeliveryNoteRelations = relations(shipmentDeliveryNote, ({ one }) => ({
  deliveryNote: one(deliveryNote, { fields: [shipmentDeliveryNote.delivery_note], references: [deliveryNote.id] }),
}));

export const stockClosingBalanceRelations = relations(stockClosingBalance, ({ one }) => ({
  itemCode: one(item, { fields: [stockClosingBalance.item_code], references: [item.id] }),
  warehouse: one(warehouse, { fields: [stockClosingBalance.warehouse], references: [warehouse.id] }),
  batchNo: one(batch, { fields: [stockClosingBalance.batch_no], references: [batch.id] }),
  company: one(company, { fields: [stockClosingBalance.company], references: [company.id] }),
  stockClosingEntry: one(stockClosingEntry, { fields: [stockClosingBalance.stock_closing_entry], references: [stockClosingEntry.id] }),
  itemGroup: one(itemGroup, { fields: [stockClosingBalance.item_group], references: [itemGroup.id] }),
  stockUom: one(uom, { fields: [stockClosingBalance.stock_uom], references: [uom.id] }),
}));

export const stockClosingEntryRelations = relations(stockClosingEntry, ({ one }) => ({
  company: one(company, { fields: [stockClosingEntry.company], references: [company.id] }),
  amendedFrom: one(stockClosingEntry, { fields: [stockClosingEntry.amended_from], references: [stockClosingEntry.id] }),
}));

export const stockEntryRelations = relations(stockEntry, ({ one, many }) => ({
  stockEntryType: one(stockEntryType, { fields: [stockEntry.stock_entry_type], references: [stockEntryType.id] }),
  outgoingStockEntry: one(stockEntry, { fields: [stockEntry.outgoing_stock_entry], references: [stockEntry.id] }),
  workOrder: one(workOrder, { fields: [stockEntry.work_order], references: [workOrder.id] }),
  jobCard: one(jobCard, { fields: [stockEntry.job_card], references: [jobCard.id] }),
  purchaseOrder: one(purchaseOrder, { fields: [stockEntry.purchase_order], references: [purchaseOrder.id] }),
  subcontractingOrder: one(subcontractingOrder, { fields: [stockEntry.subcontracting_order], references: [subcontractingOrder.id] }),
  subcontractingInwardOrder: one(subcontractingInwardOrder, { fields: [stockEntry.subcontracting_inward_order], references: [subcontractingInwardOrder.id] }),
  deliveryNoteNo: one(deliveryNote, { fields: [stockEntry.delivery_note_no], references: [deliveryNote.id] }),
  salesInvoiceNo: one(salesInvoice, { fields: [stockEntry.sales_invoice_no], references: [salesInvoice.id] }),
  pickList: one(pickList, { fields: [stockEntry.pick_list], references: [pickList.id] }),
  purchaseReceiptNo: one(purchaseReceipt, { fields: [stockEntry.purchase_receipt_no], references: [purchaseReceipt.id] }),
  assetRepair: one(assetRepair, { fields: [stockEntry.asset_repair], references: [assetRepair.id] }),
  company: one(company, { fields: [stockEntry.company], references: [company.id] }),
  bomNo: one(bom, { fields: [stockEntry.bom_no], references: [bom.id] }),
  fromWarehouse: one(warehouse, { fields: [stockEntry.from_warehouse], references: [warehouse.id] }),
  toWarehouse: one(warehouse, { fields: [stockEntry.to_warehouse], references: [warehouse.id] }),
  supplier: one(supplier, { fields: [stockEntry.supplier], references: [supplier.id] }),
  project: one(project, { fields: [stockEntry.project], references: [project.id] }),
  amendedFrom: one(stockEntry, { fields: [stockEntry.amended_from], references: [stockEntry.id] }),
  creditNote: one(journalEntry, { fields: [stockEntry.credit_note], references: [journalEntry.id] }),
  items: many(stockEntryDetail),
  additionalCosts: many(landedCostTaxesAndCharges),
}));

export const stockEntryDetailRelations = relations(stockEntryDetail, ({ one }) => ({
  sWarehouse: one(warehouse, { fields: [stockEntryDetail.s_warehouse], references: [warehouse.id] }),
  tWarehouse: one(warehouse, { fields: [stockEntryDetail.t_warehouse], references: [warehouse.id] }),
  itemCode: one(item, { fields: [stockEntryDetail.item_code], references: [item.id] }),
  qualityInspection: one(qualityInspection, { fields: [stockEntryDetail.quality_inspection], references: [qualityInspection.id] }),
  subcontractedItem: one(item, { fields: [stockEntryDetail.subcontracted_item], references: [item.id] }),
  againstFg: one(subcontractingInwardOrderItem, { fields: [stockEntryDetail.against_fg], references: [subcontractingInwardOrderItem.id] }),
  uom: one(uom, { fields: [stockEntryDetail.uom], references: [uom.id] }),
  stockUom: one(uom, { fields: [stockEntryDetail.stock_uom], references: [uom.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [stockEntryDetail.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  batchNo: one(batch, { fields: [stockEntryDetail.batch_no], references: [batch.id] }),
  expenseAccount: one(account, { fields: [stockEntryDetail.expense_account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [stockEntryDetail.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [stockEntryDetail.project], references: [project.id] }),
  bomNo: one(bom, { fields: [stockEntryDetail.bom_no], references: [bom.id] }),
  materialRequest: one(materialRequest, { fields: [stockEntryDetail.material_request], references: [materialRequest.id] }),
  materialRequestItem: one(materialRequestItem, { fields: [stockEntryDetail.material_request_item], references: [materialRequestItem.id] }),
  originalItem: one(item, { fields: [stockEntryDetail.original_item], references: [item.id] }),
  againstStockEntry: one(stockEntry, { fields: [stockEntryDetail.against_stock_entry], references: [stockEntry.id] }),
  putawayRule: one(putawayRule, { fields: [stockEntryDetail.putaway_rule], references: [putawayRule.id] }),
  referencePurchaseReceipt: one(purchaseReceipt, { fields: [stockEntryDetail.reference_purchase_receipt], references: [purchaseReceipt.id] }),
}));

export const stockLedgerEntryRelations = relations(stockLedgerEntry, ({ one }) => ({
  itemCode: one(item, { fields: [stockLedgerEntry.item_code], references: [item.id] }),
  warehouse: one(warehouse, { fields: [stockLedgerEntry.warehouse], references: [warehouse.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [stockLedgerEntry.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  company: one(company, { fields: [stockLedgerEntry.company], references: [company.id] }),
  stockUom: one(uom, { fields: [stockLedgerEntry.stock_uom], references: [uom.id] }),
  project: one(project, { fields: [stockLedgerEntry.project], references: [project.id] }),
}));

export const stockReconciliationRelations = relations(stockReconciliation, ({ one, many }) => ({
  company: one(company, { fields: [stockReconciliation.company], references: [company.id] }),
  setWarehouse: one(warehouse, { fields: [stockReconciliation.set_warehouse], references: [warehouse.id] }),
  expenseAccount: one(account, { fields: [stockReconciliation.expense_account], references: [account.id] }),
  amendedFrom: one(stockReconciliation, { fields: [stockReconciliation.amended_from], references: [stockReconciliation.id] }),
  costCenter: one(costCenter, { fields: [stockReconciliation.cost_center], references: [costCenter.id] }),
  items: many(stockReconciliationItem),
}));

export const stockReconciliationItemRelations = relations(stockReconciliationItem, ({ one }) => ({
  itemCode: one(item, { fields: [stockReconciliationItem.item_code], references: [item.id] }),
  itemGroup: one(itemGroup, { fields: [stockReconciliationItem.item_group], references: [itemGroup.id] }),
  warehouse: one(warehouse, { fields: [stockReconciliationItem.warehouse], references: [warehouse.id] }),
  stockUom: one(uom, { fields: [stockReconciliationItem.stock_uom], references: [uom.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [stockReconciliationItem.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  currentSerialAndBatchBundle: one(serialAndBatchBundle, { fields: [stockReconciliationItem.current_serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  batchNo: one(batch, { fields: [stockReconciliationItem.batch_no], references: [batch.id] }),
}));

export const stockReservationEntryRelations = relations(stockReservationEntry, ({ one, many }) => ({
  itemCode: one(item, { fields: [stockReservationEntry.item_code], references: [item.id] }),
  warehouse: one(warehouse, { fields: [stockReservationEntry.warehouse], references: [warehouse.id] }),
  stockUom: one(uom, { fields: [stockReservationEntry.stock_uom], references: [uom.id] }),
  company: one(company, { fields: [stockReservationEntry.company], references: [company.id] }),
  project: one(project, { fields: [stockReservationEntry.project], references: [project.id] }),
  amendedFrom: one(stockReservationEntry, { fields: [stockReservationEntry.amended_from], references: [stockReservationEntry.id] }),
  sbEntries: many(serialAndBatchEntry),
}));

export const stockSettingsRelations = relations(stockSettings, ({ one }) => ({
  itemGroup: one(itemGroup, { fields: [stockSettings.item_group], references: [itemGroup.id] }),
  defaultWarehouse: one(warehouse, { fields: [stockSettings.default_warehouse], references: [warehouse.id] }),
  sampleRetentionWarehouse: one(warehouse, { fields: [stockSettings.sample_retention_warehouse], references: [warehouse.id] }),
  stockUom: one(uom, { fields: [stockSettings.stock_uom], references: [uom.id] }),
}));

export const uomConversionDetailRelations = relations(uomConversionDetail, ({ one }) => ({
  uom: one(uom, { fields: [uomConversionDetail.uom], references: [uom.id] }),
}));

export const warehouseRelations = relations(warehouse, ({ one }) => ({
  company: one(company, { fields: [warehouse.company], references: [company.id] }),
  account: one(account, { fields: [warehouse.account], references: [account.id] }),
  parentWarehouse: one(warehouse, { fields: [warehouse.parent_warehouse], references: [warehouse.id] }),
  customer: one(customer, { fields: [warehouse.customer], references: [customer.id] }),
  warehouseType: one(warehouseType, { fields: [warehouse.warehouse_type], references: [warehouseType.id] }),
  defaultInTransitWarehouse: one(warehouse, { fields: [warehouse.default_in_transit_warehouse], references: [warehouse.id] }),
  oldParent: one(warehouse, { fields: [warehouse.old_parent], references: [warehouse.id] }),
}));

export const subcontractingBomRelations = relations(subcontractingBom, ({ one }) => ({
  finishedGood: one(item, { fields: [subcontractingBom.finished_good], references: [item.id] }),
  finishedGoodUom: one(uom, { fields: [subcontractingBom.finished_good_uom], references: [uom.id] }),
  finishedGoodBom: one(bom, { fields: [subcontractingBom.finished_good_bom], references: [bom.id] }),
  serviceItem: one(item, { fields: [subcontractingBom.service_item], references: [item.id] }),
  serviceItemUom: one(uom, { fields: [subcontractingBom.service_item_uom], references: [uom.id] }),
}));

export const subcontractingInwardOrderRelations = relations(subcontractingInwardOrder, ({ one, many }) => ({
  salesOrder: one(salesOrder, { fields: [subcontractingInwardOrder.sales_order], references: [salesOrder.id] }),
  customer: one(customer, { fields: [subcontractingInwardOrder.customer], references: [customer.id] }),
  company: one(company, { fields: [subcontractingInwardOrder.company], references: [company.id] }),
  customerWarehouse: one(warehouse, { fields: [subcontractingInwardOrder.customer_warehouse], references: [warehouse.id] }),
  amendedFrom: one(subcontractingInwardOrder, { fields: [subcontractingInwardOrder.amended_from], references: [subcontractingInwardOrder.id] }),
  setDeliveryWarehouse: one(warehouse, { fields: [subcontractingInwardOrder.set_delivery_warehouse], references: [warehouse.id] }),
  items: many(subcontractingInwardOrderItem),
  serviceItems: many(subcontractingInwardOrderServiceItem),
  receivedItems: many(subcontractingInwardOrderReceivedItem),
  scrapItems: many(subcontractingInwardOrderScrapItem),
}));

export const subcontractingInwardOrderItemRelations = relations(subcontractingInwardOrderItem, ({ one }) => ({
  itemCode: one(item, { fields: [subcontractingInwardOrderItem.item_code], references: [item.id] }),
  bom: one(bom, { fields: [subcontractingInwardOrderItem.bom], references: [bom.id] }),
  deliveryWarehouse: one(warehouse, { fields: [subcontractingInwardOrderItem.delivery_warehouse], references: [warehouse.id] }),
  stockUom: one(uom, { fields: [subcontractingInwardOrderItem.stock_uom], references: [uom.id] }),
}));

export const subcontractingInwardOrderReceivedItemRelations = relations(subcontractingInwardOrderReceivedItem, ({ one }) => ({
  mainItemCode: one(item, { fields: [subcontractingInwardOrderReceivedItem.main_item_code], references: [item.id] }),
  rmItemCode: one(item, { fields: [subcontractingInwardOrderReceivedItem.rm_item_code], references: [item.id] }),
  stockUom: one(uom, { fields: [subcontractingInwardOrderReceivedItem.stock_uom], references: [uom.id] }),
  warehouse: one(warehouse, { fields: [subcontractingInwardOrderReceivedItem.warehouse], references: [warehouse.id] }),
}));

export const subcontractingInwardOrderScrapItemRelations = relations(subcontractingInwardOrderScrapItem, ({ one }) => ({
  itemCode: one(item, { fields: [subcontractingInwardOrderScrapItem.item_code], references: [item.id] }),
  fgItemCode: one(item, { fields: [subcontractingInwardOrderScrapItem.fg_item_code], references: [item.id] }),
  stockUom: one(uom, { fields: [subcontractingInwardOrderScrapItem.stock_uom], references: [uom.id] }),
  warehouse: one(warehouse, { fields: [subcontractingInwardOrderScrapItem.warehouse], references: [warehouse.id] }),
}));

export const subcontractingInwardOrderServiceItemRelations = relations(subcontractingInwardOrderServiceItem, ({ one }) => ({
  itemCode: one(item, { fields: [subcontractingInwardOrderServiceItem.item_code], references: [item.id] }),
  uom: one(uom, { fields: [subcontractingInwardOrderServiceItem.uom], references: [uom.id] }),
  fgItem: one(item, { fields: [subcontractingInwardOrderServiceItem.fg_item], references: [item.id] }),
}));

export const subcontractingOrderRelations = relations(subcontractingOrder, ({ one, many }) => ({
  purchaseOrder: one(purchaseOrder, { fields: [subcontractingOrder.purchase_order], references: [purchaseOrder.id] }),
  supplier: one(supplier, { fields: [subcontractingOrder.supplier], references: [supplier.id] }),
  supplierWarehouse: one(warehouse, { fields: [subcontractingOrder.supplier_warehouse], references: [warehouse.id] }),
  company: one(company, { fields: [subcontractingOrder.company], references: [company.id] }),
  amendedFrom: one(subcontractingOrder, { fields: [subcontractingOrder.amended_from], references: [subcontractingOrder.id] }),
  costCenter: one(costCenter, { fields: [subcontractingOrder.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [subcontractingOrder.project], references: [project.id] }),
  setWarehouse: one(warehouse, { fields: [subcontractingOrder.set_warehouse], references: [warehouse.id] }),
  setReserveWarehouse: one(warehouse, { fields: [subcontractingOrder.set_reserve_warehouse], references: [warehouse.id] }),
  items: many(subcontractingOrderItem),
  serviceItems: many(subcontractingOrderServiceItem),
  suppliedItems: many(subcontractingOrderSuppliedItem),
  additionalCosts: many(landedCostTaxesAndCharges),
}));

export const subcontractingOrderItemRelations = relations(subcontractingOrderItem, ({ one }) => ({
  itemCode: one(item, { fields: [subcontractingOrderItem.item_code], references: [item.id] }),
  bom: one(bom, { fields: [subcontractingOrderItem.bom], references: [bom.id] }),
  stockUom: one(uom, { fields: [subcontractingOrderItem.stock_uom], references: [uom.id] }),
  warehouse: one(warehouse, { fields: [subcontractingOrderItem.warehouse], references: [warehouse.id] }),
  expenseAccount: one(account, { fields: [subcontractingOrderItem.expense_account], references: [account.id] }),
  manufacturer: one(manufacturer, { fields: [subcontractingOrderItem.manufacturer], references: [manufacturer.id] }),
  materialRequest: one(materialRequest, { fields: [subcontractingOrderItem.material_request], references: [materialRequest.id] }),
  costCenter: one(costCenter, { fields: [subcontractingOrderItem.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [subcontractingOrderItem.project], references: [project.id] }),
  jobCard: one(jobCard, { fields: [subcontractingOrderItem.job_card], references: [jobCard.id] }),
}));

export const subcontractingOrderServiceItemRelations = relations(subcontractingOrderServiceItem, ({ one }) => ({
  itemCode: one(item, { fields: [subcontractingOrderServiceItem.item_code], references: [item.id] }),
  fgItem: one(item, { fields: [subcontractingOrderServiceItem.fg_item], references: [item.id] }),
  materialRequest: one(materialRequest, { fields: [subcontractingOrderServiceItem.material_request], references: [materialRequest.id] }),
}));

export const subcontractingOrderSuppliedItemRelations = relations(subcontractingOrderSuppliedItem, ({ one }) => ({
  mainItemCode: one(item, { fields: [subcontractingOrderSuppliedItem.main_item_code], references: [item.id] }),
  rmItemCode: one(item, { fields: [subcontractingOrderSuppliedItem.rm_item_code], references: [item.id] }),
  stockUom: one(uom, { fields: [subcontractingOrderSuppliedItem.stock_uom], references: [uom.id] }),
  reserveWarehouse: one(warehouse, { fields: [subcontractingOrderSuppliedItem.reserve_warehouse], references: [warehouse.id] }),
}));

export const subcontractingReceiptRelations = relations(subcontractingReceipt, ({ one, many }) => ({
  supplier: one(supplier, { fields: [subcontractingReceipt.supplier], references: [supplier.id] }),
  company: one(company, { fields: [subcontractingReceipt.company], references: [company.id] }),
  returnAgainst: one(subcontractingReceipt, { fields: [subcontractingReceipt.return_against], references: [subcontractingReceipt.id] }),
  costCenter: one(costCenter, { fields: [subcontractingReceipt.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [subcontractingReceipt.project], references: [project.id] }),
  setWarehouse: one(warehouse, { fields: [subcontractingReceipt.set_warehouse], references: [warehouse.id] }),
  rejectedWarehouse: one(warehouse, { fields: [subcontractingReceipt.rejected_warehouse], references: [warehouse.id] }),
  supplierWarehouse: one(warehouse, { fields: [subcontractingReceipt.supplier_warehouse], references: [warehouse.id] }),
  amendedFrom: one(subcontractingReceipt, { fields: [subcontractingReceipt.amended_from], references: [subcontractingReceipt.id] }),
  representsCompany: one(company, { fields: [subcontractingReceipt.represents_company], references: [company.id] }),
  items: many(subcontractingReceiptItem),
  suppliedItems: many(subcontractingReceiptSuppliedItem),
  additionalCosts: many(landedCostTaxesAndCharges),
}));

export const subcontractingReceiptItemRelations = relations(subcontractingReceiptItem, ({ one }) => ({
  itemCode: one(item, { fields: [subcontractingReceiptItem.item_code], references: [item.id] }),
  brand: one(brand, { fields: [subcontractingReceiptItem.brand], references: [brand.id] }),
  stockUom: one(uom, { fields: [subcontractingReceiptItem.stock_uom], references: [uom.id] }),
  warehouse: one(warehouse, { fields: [subcontractingReceiptItem.warehouse], references: [warehouse.id] }),
  subcontractingOrder: one(subcontractingOrder, { fields: [subcontractingReceiptItem.subcontracting_order], references: [subcontractingOrder.id] }),
  jobCard: one(jobCard, { fields: [subcontractingReceiptItem.job_card], references: [jobCard.id] }),
  rejectedWarehouse: one(warehouse, { fields: [subcontractingReceiptItem.rejected_warehouse], references: [warehouse.id] }),
  bom: one(bom, { fields: [subcontractingReceiptItem.bom], references: [bom.id] }),
  qualityInspection: one(qualityInspection, { fields: [subcontractingReceiptItem.quality_inspection], references: [qualityInspection.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [subcontractingReceiptItem.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  rejectedSerialAndBatchBundle: one(serialAndBatchBundle, { fields: [subcontractingReceiptItem.rejected_serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  batchNo: one(batch, { fields: [subcontractingReceiptItem.batch_no], references: [batch.id] }),
  manufacturer: one(manufacturer, { fields: [subcontractingReceiptItem.manufacturer], references: [manufacturer.id] }),
  expenseAccount: one(account, { fields: [subcontractingReceiptItem.expense_account], references: [account.id] }),
  serviceExpenseAccount: one(account, { fields: [subcontractingReceiptItem.service_expense_account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [subcontractingReceiptItem.cost_center], references: [costCenter.id] }),
  project: one(project, { fields: [subcontractingReceiptItem.project], references: [project.id] }),
  purchaseOrder: one(purchaseOrder, { fields: [subcontractingReceiptItem.purchase_order], references: [purchaseOrder.id] }),
}));

export const subcontractingReceiptSuppliedItemRelations = relations(subcontractingReceiptSuppliedItem, ({ one }) => ({
  mainItemCode: one(item, { fields: [subcontractingReceiptSuppliedItem.main_item_code], references: [item.id] }),
  rmItemCode: one(item, { fields: [subcontractingReceiptSuppliedItem.rm_item_code], references: [item.id] }),
  stockUom: one(uom, { fields: [subcontractingReceiptSuppliedItem.stock_uom], references: [uom.id] }),
  serialAndBatchBundle: one(serialAndBatchBundle, { fields: [subcontractingReceiptSuppliedItem.serial_and_batch_bundle], references: [serialAndBatchBundle.id] }),
  subcontractingOrder: one(subcontractingOrder, { fields: [subcontractingReceiptSuppliedItem.subcontracting_order], references: [subcontractingOrder.id] }),
  batchNo: one(batch, { fields: [subcontractingReceiptSuppliedItem.batch_no], references: [batch.id] }),
  expenseAccount: one(account, { fields: [subcontractingReceiptSuppliedItem.expense_account], references: [account.id] }),
  costCenter: one(costCenter, { fields: [subcontractingReceiptSuppliedItem.cost_center], references: [costCenter.id] }),
}));

export const issueRelations = relations(issue, ({ one }) => ({
  customer: one(customer, { fields: [issue.customer], references: [customer.id] }),
  priority: one(issuePriority, { fields: [issue.priority], references: [issuePriority.id] }),
  issueType: one(issueType, { fields: [issue.issue_type], references: [issueType.id] }),
  issueSplitFrom: one(issue, { fields: [issue.issue_split_from], references: [issue.id] }),
  serviceLevelAgreement: one(serviceLevelAgreement, { fields: [issue.service_level_agreement], references: [serviceLevelAgreement.id] }),
  lead: one(lead, { fields: [issue.lead], references: [lead.id] }),
  project: one(project, { fields: [issue.project], references: [project.id] }),
  company: one(company, { fields: [issue.company], references: [company.id] }),
}));

export const serviceLevelAgreementRelations = relations(serviceLevelAgreement, ({ one, many }) => ({
  defaultPriority: one(issuePriority, { fields: [serviceLevelAgreement.default_priority], references: [issuePriority.id] }),
  holidayList: one(holidayList, { fields: [serviceLevelAgreement.holiday_list], references: [holidayList.id] }),
  supportAndResolution: many(serviceDay),
  priorities: many(serviceLevelPriority),
  pauseSlaOn: many(pauseSlaOnStatus),
  slaFulfilledOn: many(slaFulfilledOnStatus),
}));

export const serviceLevelPriorityRelations = relations(serviceLevelPriority, ({ one }) => ({
  priority: one(issuePriority, { fields: [serviceLevelPriority.priority], references: [issuePriority.id] }),
}));

export const supportSettingsRelations = relations(supportSettings, ({ many }) => ({
  searchApis: many(supportSearchSource),
}));

export const warrantyClaimRelations = relations(warrantyClaim, ({ one }) => ({
  customer: one(customer, { fields: [warrantyClaim.customer], references: [customer.id] }),
  serialNo: one(serialNo, { fields: [warrantyClaim.serial_no], references: [serialNo.id] }),
  itemCode: one(item, { fields: [warrantyClaim.item_code], references: [item.id] }),
  territory: one(territory, { fields: [warrantyClaim.territory], references: [territory.id] }),
  customerGroup: one(customerGroup, { fields: [warrantyClaim.customer_group], references: [customerGroup.id] }),
  company: one(company, { fields: [warrantyClaim.company], references: [company.id] }),
  amendedFrom: one(warrantyClaim, { fields: [warrantyClaim.amended_from], references: [warrantyClaim.id] }),
}));

export const callLogRelations = relations(callLog, ({ one }) => ({
  callReceivedBy: one(employee, { fields: [callLog.call_received_by], references: [employee.id] }),
  customer: one(customer, { fields: [callLog.customer], references: [customer.id] }),
  typeOfCall: one(telephonyCallType, { fields: [callLog.type_of_call], references: [telephonyCallType.id] }),
}));

export const incomingCallHandlingScheduleRelations = relations(incomingCallHandlingSchedule, ({ one }) => ({
  agentGroup: one(employeeGroup, { fields: [incomingCallHandlingSchedule.agent_group], references: [employeeGroup.id] }),
}));

export const incomingCallSettingsRelations = relations(incomingCallSettings, ({ many }) => ({
  callHandlingSchedule: many(incomingCallHandlingSchedule),
}));

export const telephonyCallTypeRelations = relations(telephonyCallType, ({ one }) => ({
  amendedFrom: one(telephonyCallType, { fields: [telephonyCallType.amended_from], references: [telephonyCallType.id] }),
}));
