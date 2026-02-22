import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see AP-04 — Payment run: batch payment file generation
 * @see AP-06 — ISO 20022 pain.001 payment file generation
 * @see AP-08 — Payment approval workflow (multi-level)
 *
 * ISO 20022 pain.001 — Customer Credit Transfer Initiation
 *
 * Generates an XML document conforming to pain.001.001.03 for SEPA/cross-border
 * payment file submission to banks. Pure function — no I/O.
 *
 * Reference: ISO 20022 Message Definition Report — pain.001.001.03
 */

export type Pain001Creditor = {
  name: string;
  iban: string;
  bic?: string;
  currency: string;
  amountMinor: number;
  invoiceRef: string;
  endToEndId: string;
};

export type Pain001Header = {
  messageId: string;
  creationDateTime: string;
  initiatingPartyName: string;
  debtorName: string;
  debtorIban: string;
  debtorBic: string;
  paymentInfoId: string;
  requestedExecutionDate: string;
};

export type Pain001Result = {
  xml: string;
  numberOfTransactions: number;
  controlSumMinor: number;
};

/**
 * Build a pain.001.001.03 XML payment initiation message.
 *
 * @param header  - Debtor and message metadata
 * @param credits - List of creditor payment instructions
 * @returns CalculatorResult containing the XML string
 */
export function generatePain001(
  header: Pain001Header,
  credits: Pain001Creditor[],
): CalculatorResult<Pain001Result> {
  if (credits.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'pain.001 requires at least one credit transfer');
  }

  for (const c of credits) {
    if (!c.iban || c.iban.length < 15) {
      throw new DomainError('VALIDATION_FAILED', `Invalid IBAN for creditor ${c.name}: ${c.iban}`);
    }
    if (c.amountMinor <= 0) {
      throw new DomainError('VALIDATION_FAILED', `Amount must be positive for ${c.endToEndId}`);
    }
  }

  const controlSumMinor = credits.reduce((sum, c) => sum + c.amountMinor, 0);
  const controlSum = (controlSumMinor / 100).toFixed(2);

  const txLines = credits
    .map(
      (c) => `      <CdtTrfTxInf>
        <PmtId>
          <EndToEndId>${escapeXml(c.endToEndId)}</EndToEndId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="${escapeXml(c.currency)}">${(c.amountMinor / 100).toFixed(2)}</InstdAmt>
        </Amt>${c.bic ? `\n        <CdtrAgt><FinInstnId><BIC>${escapeXml(c.bic)}</BIC></FinInstnId></CdtrAgt>` : ''}
        <Cdtr><Nm>${escapeXml(c.name)}</Nm></Cdtr>
        <CdtrAcct><Id><IBAN>${escapeXml(c.iban)}</IBAN></Id></CdtrAcct>
        <RmtInf><Ustrd>${escapeXml(c.invoiceRef)}</Ustrd></RmtInf>
      </CdtTrfTxInf>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>${escapeXml(header.messageId)}</MsgId>
      <CreDtTm>${escapeXml(header.creationDateTime)}</CreDtTm>
      <NbOfTxs>${credits.length}</NbOfTxs>
      <CtrlSum>${controlSum}</CtrlSum>
      <InitgPty><Nm>${escapeXml(header.initiatingPartyName)}</Nm></InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>${escapeXml(header.paymentInfoId)}</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <NbOfTxs>${credits.length}</NbOfTxs>
      <CtrlSum>${controlSum}</CtrlSum>
      <ReqdExctnDt>${escapeXml(header.requestedExecutionDate)}</ReqdExctnDt>
      <Dbtr><Nm>${escapeXml(header.debtorName)}</Nm></Dbtr>
      <DbtrAcct><Id><IBAN>${escapeXml(header.debtorIban)}</IBAN></Id></DbtrAcct>
      <DbtrAgt><FinInstnId><BIC>${escapeXml(header.debtorBic)}</BIC></FinInstnId></DbtrAgt>
${txLines}
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`;

  return {
    result: {
      xml,
      numberOfTransactions: credits.length,
      controlSumMinor,
    },
    inputs: { header, creditCount: credits.length },
    explanation: `pain.001.001.03: ${credits.length} transactions, control sum ${controlSum}`,
  };
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
