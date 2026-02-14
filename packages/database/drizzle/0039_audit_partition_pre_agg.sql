-- 0039_audit_partition_pre_agg.sql
-- P2: Pre-aggregation materialized views + audit partition helper
--
-- Contents:
-- 1. Helper function to create future audit_log partitions (for when table is migrated)
-- 2. AR aging materialized view
-- 3. AP aging materialized view
-- 4. GL trial balance materialized view
-- 5. Reporting period snapshot refresh function
--
-- NOTE: audit_logs partitioning requires a maintenance window (rename + copy + drop).
-- The create_audit_partition() function is provided for future use.
-- Actual partition cutover should be done during a planned maintenance window.

-- ============================================================
-- 1. Audit partition helper (for future use)
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_audit_partition(
  p_year INTEGER,
  p_month INTEGER
)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  partition_name TEXT;
  start_date DATE;
  end_date DATE;
BEGIN
  partition_name := format('audit_logs_%s_%s',
    p_year::text,
    lpad(p_month::text, 2, '0'));
  start_date := make_date(p_year, p_month, 1);
  end_date := start_date + interval '1 month';

  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF audit_logs FOR VALUES FROM (%L) TO (%L)',
    partition_name, start_date, end_date
  );
END;
$$;
--> statement-breakpoint

COMMENT ON FUNCTION public.create_audit_partition(INTEGER, INTEGER) IS
  'Creates a monthly partition for audit_logs. Call from cron or before partition cutover.';
--> statement-breakpoint

-- ============================================================
-- 2. AR Aging Materialized View
-- ============================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_ar_aging AS
SELECT
  si.org_id,
  si.company_id,
  si.customer_id,
  si.id AS invoice_id,
  si.doc_no,
  si.posting_date,
  si.due_date,
  si.currency_code,
  si.outstanding_minor,
  CASE
    WHEN si.due_date >= CURRENT_DATE THEN 'current'
    WHEN CURRENT_DATE - si.due_date BETWEEN 1 AND 30 THEN '1_30'
    WHEN CURRENT_DATE - si.due_date BETWEEN 31 AND 60 THEN '31_60'
    WHEN CURRENT_DATE - si.due_date BETWEEN 61 AND 90 THEN '61_90'
    ELSE 'over_90'
  END AS aging_bucket
FROM sales_invoices si
WHERE si.posting_status = 'posted'
  AND si.outstanding_minor > 0
  AND si.is_deleted = false
WITH DATA;
--> statement-breakpoint

CREATE UNIQUE INDEX mv_ar_aging_pk ON mv_ar_aging (org_id, invoice_id);
--> statement-breakpoint
CREATE INDEX mv_ar_aging_customer_idx ON mv_ar_aging (org_id, customer_id, aging_bucket);
--> statement-breakpoint
CREATE INDEX mv_ar_aging_company_idx ON mv_ar_aging (org_id, company_id, aging_bucket);
--> statement-breakpoint

-- ============================================================
-- 3. AP Aging Materialized View
-- ============================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_ap_aging AS
SELECT
  pi.org_id,
  pi.company_id,
  pi.supplier_id,
  pi.id AS invoice_id,
  pi.doc_no,
  pi.posting_date,
  pi.due_date,
  pi.currency_code,
  pi.outstanding_minor,
  CASE
    WHEN pi.due_date >= CURRENT_DATE THEN 'current'
    WHEN CURRENT_DATE - pi.due_date BETWEEN 1 AND 30 THEN '1_30'
    WHEN CURRENT_DATE - pi.due_date BETWEEN 31 AND 60 THEN '31_60'
    WHEN CURRENT_DATE - pi.due_date BETWEEN 61 AND 90 THEN '61_90'
    ELSE 'over_90'
  END AS aging_bucket
FROM purchase_invoices pi
WHERE pi.posting_status = 'posted'
  AND pi.outstanding_minor > 0
  AND pi.is_deleted = false
WITH DATA;
--> statement-breakpoint

CREATE UNIQUE INDEX mv_ap_aging_pk ON mv_ap_aging (org_id, invoice_id);
--> statement-breakpoint
CREATE INDEX mv_ap_aging_supplier_idx ON mv_ap_aging (org_id, supplier_id, aging_bucket);
--> statement-breakpoint
CREATE INDEX mv_ap_aging_company_idx ON mv_ap_aging (org_id, company_id, aging_bucket);
--> statement-breakpoint

-- ============================================================
-- 4. GL Trial Balance Materialized View
-- ============================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_trial_balance AS
SELECT
  jl.org_id,
  jl.company_id,
  jl.account_id,
  date_trunc('month', je.posted_at)::date AS period_month,
  SUM(jl.debit_amount) AS total_debit_minor,
  SUM(jl.credit_amount) AS total_credit_minor,
  SUM(jl.debit_amount) - SUM(jl.credit_amount) AS net_balance_minor,
  COUNT(*) AS line_count
FROM journal_lines jl
INNER JOIN journal_entries je ON jl.journal_entry_id = je.id
WHERE je.is_deleted = false
  AND je.posted_at IS NOT NULL
GROUP BY jl.org_id, jl.company_id, jl.account_id, date_trunc('month', je.posted_at)::date
WITH DATA;
--> statement-breakpoint

CREATE UNIQUE INDEX mv_trial_balance_pk ON mv_trial_balance (org_id, company_id, account_id, period_month);
--> statement-breakpoint
CREATE INDEX mv_trial_balance_period_idx ON mv_trial_balance (org_id, period_month);
--> statement-breakpoint

-- ============================================================
-- 5. Refresh function for all pre-aggregation MVs
-- ============================================================
CREATE OR REPLACE FUNCTION public.refresh_reporting_mvs()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_ar_aging;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_ap_aging;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_trial_balance;
END;
$$;
--> statement-breakpoint

COMMENT ON FUNCTION public.refresh_reporting_mvs() IS
  'Refreshes all pre-aggregation materialized views. Call from cron or after batch posting.';
--> statement-breakpoint
