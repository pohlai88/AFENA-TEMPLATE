/**
 * @afenda/statutory-reporting
 *
 * Multi-GAAP statutory financial reporting with country-specific formats.
 */

export {
    generateStatutoryFinancials, type ReportingStandard, type StatutoryFinancials
} from './services/statutory-financials.js';

export {
    mapToLocalGAAP, type AdjustmentType, type GAAPMapping
} from './services/gaap-mapping.js';

export {
    generateXBRL, type TaxonomyVersion, type XBRLDocument
} from './services/xbrl-generator.js';

export {
    generateSAFT,
    type SAFTDocument,
    type SAFTVersion
} from './services/saft-generator.js';

export {
    formatForCountry,
    type CountryCode,
    type FinancialStatementFormat
} from './services/country-formats.js';

export {
    submitEFiling,
    type EFilingSubmission,
    type FilingStatus
} from './services/efiling-integration.js';

