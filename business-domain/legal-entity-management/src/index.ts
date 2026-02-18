/**
 * Legal Entity Management Package
 *
 * Control plane for consolidation, statutory reporting, and tax compliance
 * through entity hierarchy management and corporate governance.
 */

// Entity Registry
export { registerDirectorSchema, registerEntitySchema, updateEntityIdentifiersSchema } from './services/entity-registry.js';
export type { LegalEntity, RegisterDirectorInput, RegisterEntityInput, UpdateEntityIdentifiersInput } from './services/entity-registry.js';
// Note: Add exports for registerEntity, updateEntityIdentifiers, registerDirector functions when implemented

// Ownership Structure
export { calculateEffectiveOwnership, calculateEffectiveOwnershipSchema, createOwnership, createOwnershipSchema } from './services/ownership-structure.js';
export type { CalculateEffectiveOwnershipInput, CreateOwnershipInput, EffectiveOwnership, OwnershipRelationship } from './services/ownership-structure.js';

// Delegation of Authority
export { checkApprovalAuthority, checkApprovalAuthoritySchema, createAuthorityMatrix, createAuthorityMatrixSchema } from './services/delegation-authority.js';
export type { ApprovalAuthorityCheck, AuthorityMatrix, CheckApprovalAuthorityInput, CreateAuthorityMatrixInput } from './services/delegation-authority.js';

// Corporate Secretarial
export { createResolution, createResolutionSchema, recordFiling, recordFilingSchema, updateShareRegister, updateShareRegisterSchema } from './services/corporate-secretarial.js';
export type { BoardResolution, CreateResolutionInput, GovernmentFiling, RecordFilingInput, ShareRegisterEntry, UpdateShareRegisterInput } from './services/corporate-secretarial.js';

// Entity Lifecycle
export { initiateDissolution, initiateDissolutionSchema, initiateIncorporation, initiateIncorporationSchema, processRestructuring, processRestructuringSchema } from './services/entity-lifecycle.js';
export type { DissolutionWorkflow, IncorporationWorkflow, InitiateDissolutionInput, InitiateIncorporationInput, ProcessRestructuringInput, RestructuringWorkflow } from './services/entity-lifecycle.js';

