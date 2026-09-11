-- Kurumsal "No-API" bağlantılar (OAuth, WhatsApp, IT delege)
CREATE TABLE IF NOT EXISTS company_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id VARCHAR(64) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'disconnected'
    CHECK (status IN ('connected', 'pending_it', 'action_required', 'disconnected')),
  assigned_departments JSONB NOT NULL DEFAULT '[]'::jsonb,
  auth_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (company_id, provider)
);

DO $$ BEGIN
  ALTER TABLE company_integrations DROP CONSTRAINT IF EXISTS company_integrations_provider_check;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_company_integrations_company
  ON company_integrations (company_id, status);

CREATE INDEX IF NOT EXISTS idx_company_integrations_user
  ON company_integrations (user_id, updated_at DESC);
