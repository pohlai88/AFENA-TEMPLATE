-- Gate 6 (GOV-06): search_documents projection — no app writes.
-- search_documents is written ONLY by the search worker (SEARCH_WORKER_DATABASE_URL).
-- App role (authenticated) must not INSERT/UPDATE/DELETE.
REVOKE INSERT, UPDATE, DELETE ON search_documents FROM authenticated;
