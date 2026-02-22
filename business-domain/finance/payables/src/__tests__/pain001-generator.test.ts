import { describe, expect, it } from 'vitest';
import { generatePain001 } from '../calculators/pain001-generator';
import type { Pain001Creditor, Pain001Header } from '../calculators/pain001-generator';

const header: Pain001Header = {
  messageId: 'MSG-001',
  creationDateTime: '2026-02-20T12:00:00Z',
  initiatingPartyName: 'ACME Holdings',
  debtorName: 'ACME Holdings Sdn Bhd',
  debtorIban: 'MY12345678901234567890',
  debtorBic: 'MABORKMYXXX',
  paymentInfoId: 'PMT-001',
  requestedExecutionDate: '2026-02-25',
};

const credits: Pain001Creditor[] = [
  {
    name: 'Supplier Alpha',
    iban: 'DE89370400440532013000',
    bic: 'COBADEFFXXX',
    currency: 'EUR',
    amountMinor: 150000,
    invoiceRef: 'INV-2026-001',
    endToEndId: 'E2E-001',
  },
  {
    name: 'Supplier Beta',
    iban: 'GB29NWBK60161331926819',
    currency: 'GBP',
    amountMinor: 75000,
    invoiceRef: 'INV-2026-002',
    endToEndId: 'E2E-002',
  },
];

describe('generatePain001', () => {
  it('generates valid pain.001.001.03 XML', () => {
    const { result } = generatePain001(header, credits);

    expect(result.numberOfTransactions).toBe(2);
    expect(result.controlSumMinor).toBe(225000);
    expect(result.xml).toContain('pain.001.001.03');
    expect(result.xml).toContain('<NbOfTxs>2</NbOfTxs>');
    expect(result.xml).toContain('<CtrlSum>2250.00</CtrlSum>');
  });

  it('includes debtor IBAN and BIC', () => {
    const { result } = generatePain001(header, credits);

    expect(result.xml).toContain('<IBAN>MY12345678901234567890</IBAN>');
    expect(result.xml).toContain('<BIC>MABORKMYXXX</BIC>');
  });

  it('includes creditor BIC when provided', () => {
    const { result } = generatePain001(header, credits);

    expect(result.xml).toContain('<BIC>COBADEFFXXX</BIC>');
  });

  it('omits creditor BIC when not provided', () => {
    const { result } = generatePain001(header, [credits[1]!]);

    expect(result.xml).not.toContain('COBADEFFXXX');
    expect(result.xml).toContain('GB29NWBK60161331926819');
  });

  it('includes remittance info with invoice reference', () => {
    const { result } = generatePain001(header, credits);

    expect(result.xml).toContain('<Ustrd>INV-2026-001</Ustrd>');
    expect(result.xml).toContain('<Ustrd>INV-2026-002</Ustrd>');
  });

  it('escapes XML special characters', () => {
    const specialCredits: Pain001Creditor[] = [
      {
        name: 'Smith & Sons <Ltd>',
        iban: 'DE89370400440532013000',
        currency: 'EUR',
        amountMinor: 10000,
        invoiceRef: 'REF "123"',
        endToEndId: 'E2E-SPECIAL',
      },
    ];

    const { result } = generatePain001(header, specialCredits);

    expect(result.xml).toContain('Smith &amp; Sons &lt;Ltd&gt;');
    expect(result.xml).toContain('REF &quot;123&quot;');
  });

  it('throws for empty credits list', () => {
    expect(() => generatePain001(header, [])).toThrow('at least one credit transfer');
  });

  it('throws for invalid IBAN', () => {
    const bad: Pain001Creditor[] = [
      { name: 'Bad', iban: 'SHORT', currency: 'EUR', amountMinor: 100, invoiceRef: 'X', endToEndId: 'E' },
    ];
    expect(() => generatePain001(header, bad)).toThrow('Invalid IBAN');
  });

  it('throws for zero amount', () => {
    const bad: Pain001Creditor[] = [
      { name: 'Zero', iban: 'DE89370400440532013000', currency: 'EUR', amountMinor: 0, invoiceRef: 'X', endToEndId: 'E' },
    ];
    expect(() => generatePain001(header, bad)).toThrow('Amount must be positive');
  });

  it('returns explanation with transaction count and control sum', () => {
    const calc = generatePain001(header, credits);

    expect(calc.explanation).toContain('2 transactions');
    expect(calc.explanation).toContain('2250.00');
  });
});
