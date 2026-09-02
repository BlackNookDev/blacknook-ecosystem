-- Destek talebi alanları (match_requests genişletmesi)
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS urgency VARCHAR(20);
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS category VARCHAR(40);
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
