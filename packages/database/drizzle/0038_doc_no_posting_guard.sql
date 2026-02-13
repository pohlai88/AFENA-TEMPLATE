-- 0038_doc_no_posting_guard.sql
-- Challenge 3 item 8: DB guard trigger — doc cannot transition to submitted/active
-- unless doc_no IS NOT NULL. Fires only on doc_status changes, not other edits.
--
-- Applied to all 7 postable doc headers + quotations (8 tables total).
-- Quotations use doc_status but not posting_status — still need doc_no on submit.

-- ============================================================
-- 1. Guard function
-- ============================================================
CREATE OR REPLACE FUNCTION public.require_doc_no_on_submit()
RETURNS trigger AS $$
BEGIN
  -- Only fire when doc_status is changing TO submitted or active
  IF NEW.doc_status IN ('submitted', 'active')
     AND (OLD.doc_status IS DISTINCT FROM NEW.doc_status)
     AND NEW.doc_no IS NULL
  THEN
    RAISE EXCEPTION 'doc_no must be assigned before transitioning to %: table=%, id=%',
      NEW.doc_status, TG_TABLE_NAME, NEW.id
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

COMMENT ON FUNCTION public.require_doc_no_on_submit() IS
  'Challenge 3 item 8: DB-level guard ensuring doc_no is assigned before posting. Called by allocateDocNumber() in submit() handler.';
--> statement-breakpoint

-- ============================================================
-- 2. Apply trigger to all doc tables with doc_status + doc_no
-- ============================================================

-- Sales Invoices
CREATE TRIGGER trg_require_doc_no_sales_invoices
  BEFORE UPDATE OF doc_status ON sales_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.require_doc_no_on_submit();
--> statement-breakpoint

-- Payments
CREATE TRIGGER trg_require_doc_no_payments
  BEFORE UPDATE OF doc_status ON payments
  FOR EACH ROW
  EXECUTE FUNCTION public.require_doc_no_on_submit();
--> statement-breakpoint

-- Sales Orders
CREATE TRIGGER trg_require_doc_no_sales_orders
  BEFORE UPDATE OF doc_status ON sales_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.require_doc_no_on_submit();
--> statement-breakpoint

-- Delivery Notes
CREATE TRIGGER trg_require_doc_no_delivery_notes
  BEFORE UPDATE OF doc_status ON delivery_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.require_doc_no_on_submit();
--> statement-breakpoint

-- Purchase Orders
CREATE TRIGGER trg_require_doc_no_purchase_orders
  BEFORE UPDATE OF doc_status ON purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.require_doc_no_on_submit();
--> statement-breakpoint

-- Goods Receipts
CREATE TRIGGER trg_require_doc_no_goods_receipts
  BEFORE UPDATE OF doc_status ON goods_receipts
  FOR EACH ROW
  EXECUTE FUNCTION public.require_doc_no_on_submit();
--> statement-breakpoint

-- Purchase Invoices
CREATE TRIGGER trg_require_doc_no_purchase_invoices
  BEFORE UPDATE OF doc_status ON purchase_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.require_doc_no_on_submit();
--> statement-breakpoint

-- Quotations (not postable, but still need doc_no on submit)
CREATE TRIGGER trg_require_doc_no_quotations
  BEFORE UPDATE OF doc_status ON quotations
  FOR EACH ROW
  EXECUTE FUNCTION public.require_doc_no_on_submit();
--> statement-breakpoint
