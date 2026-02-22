import type { CalculatorResult } from 'afenda-canon';

/**
 * @see CM-02 — Credit exposure: outstanding invoices + open orders
 */
export type InvoiceBalance = { invoiceId: string; outstandingMinor: number; isOverdue: boolean };
export type OrderAmount = { orderId: string; amountMinor: number };

export type ExposureResult = {
  totalExposureMinor: number;
  invoiceExposureMinor: number;
  orderExposureMinor: number;
  overdueMinor: number;
};

export function computeCreditExposure(
  openInvoices: InvoiceBalance[],
  pendingOrders: OrderAmount[],
): CalculatorResult<ExposureResult> {
  let invoiceExposureMinor = 0;
  let overdueMinor = 0;

  for (const inv of openInvoices) {
    invoiceExposureMinor += inv.outstandingMinor;
    if (inv.isOverdue) overdueMinor += inv.outstandingMinor;
  }

  let orderExposureMinor = 0;
  for (const ord of pendingOrders) {
    orderExposureMinor += ord.amountMinor;
  }

  return {
    result: {
      totalExposureMinor: invoiceExposureMinor + orderExposureMinor,
      invoiceExposureMinor,
      orderExposureMinor,
      overdueMinor,
    },
    inputs: { openInvoices, pendingOrders },
    explanation: `Credit exposure: total ${invoiceExposureMinor + orderExposureMinor}, overdue ${overdueMinor}`,
  };
}
