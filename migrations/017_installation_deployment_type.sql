-- Kurulum taleplerine dağıtım tercihi
ALTER TABLE installation_requests
  ADD COLUMN IF NOT EXISTS deployment_type VARCHAR(32);

CREATE INDEX IF NOT EXISTS idx_installation_requests_status_created
  ON installation_requests (status, created_at DESC);
