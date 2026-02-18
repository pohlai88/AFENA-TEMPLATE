/**
 * Intercompany Governance Package
 *
 * IC service catalogs, invoicing, netting, dispute workflows, elimination preparation,
 * and reconciliation SLA monitoring for multinational IC compliance.
 */

// Service Catalog
export {
    createServiceAgreement, createServiceAgreementSchema, createServiceCatalog, createServiceCatalogSchema, type CreateServiceAgreementInput, type CreateServiceCatalogInput, type ICServiceAgreement, type ICServiceCatalog
} from './services/service-catalog';

// IC Invoicing
export {
    approveICInvoice, approveICInvoiceSchema, generateICInvoice, generateICInvoiceSchema, type ApproveICInvoiceInput, type GenerateICInvoiceInput, type ICInvoice
} from './services/ic-invoicing';

// Settlement Netting
export {
    calculateNetting, calculateNettingSchema, createNettingGroup, createNettingGroupSchema, type CalculateNettingInput,
    type CreateNettingGroupInput,
    type NettingCalculation,
    type NettingGroup
} from './services/settlement-netting';

// Dispute Workflow
export {
    createDispute, createDisputeSchema, resolveDispute, resolveDisputeSchema, type CreateDisputeInput, type ICDispute, type ResolveDisputeInput
} from './services/dispute-workflow';

// Elimination Preparation
export {
    prepareEliminations, prepareEliminationsSchema, validateElimination, validateEliminationSchema, type EliminationEntry,
    type EliminationValidation, type PrepareEliminationsInput,
    type ValidateEliminationInput
} from './services/elimination-prep';

// Reconciliation SLA Monitor
export {
    escalateOverdueSLA, escalateOverdueSLASchema, trackReconciliationSLA, trackReconciliationSLASchema, type EscalateOverdueSLAInput,
    type ReconciliationSLA,
    type SLAMetrics, type TrackReconciliationSLAInput
} from './services/recon-sla-monitor';

