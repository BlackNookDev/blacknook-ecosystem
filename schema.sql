-- BlackNOOK Digital Marketplace — PostgreSQL (Supabase) Şema
-- Kullanım: Supabase Dashboard > SQL Editor içine yapıştırıp çalıştırın,
-- veya: node scripts/run-migration.js schema.sql

-- Kullanıcılar
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,            -- bcryptjs hash
  role          VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user','vendor','admin')),
  avatar        TEXT,                              -- Base64 encoded profil fotoğrafı
  bio           TEXT,                              -- Kısa özet / hakkında
  linkedin_url  VARCHAR(255),                       -- LinkedIn profil linki
  match_available BOOLEAN DEFAULT FALSE,
  match_skills  VARCHAR(255),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ürünler
CREATE TABLE IF NOT EXISTS products (
  id                  SERIAL PRIMARY KEY,
  vendor_id           INTEGER NOT NULL REFERENCES users(id),
  title               VARCHAR(255) NOT NULL,
  slug                VARCHAR(255) NOT NULL UNIQUE,
  category            VARCHAR(100) NOT NULL,
  short_description   TEXT,
  long_description    TEXT,                       -- HTML veya Markdown içerik
  cover_image         TEXT,                        -- Base64 encoded string
  gallery_images      TEXT,                        -- JSON array of Base64 strings
  video_url           TEXT,                        -- Base64 encoded MP4/WebM
  features_list       JSONB,                       -- ["Özellik 1", "Özellik 2", ...]
  listing_data        JSONB,                       -- partner wizard tam taslak
  icon_image          TEXT,                        -- logo / ikon URL
  brand_color         VARCHAR(32) DEFAULT '#6366F1',
  reject_reason       TEXT,
  verified            BOOLEAN NOT NULL DEFAULT FALSE,
  status              VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','unpublished')),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_status ON products (status, created_at DESC);

-- Ürün Lisans Katmanları (Tiers)
CREATE TABLE IF NOT EXISTS product_tiers (
  id              SERIAL PRIMARY KEY,
  product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tier_name       VARCHAR(100) NOT NULL,        -- "License Tier 1", "License Tier 2"
  price           DECIMAL(10,2) NOT NULL,       -- Satış fiyatı
  original_price  DECIMAL(10,2),                -- Çizili orijinal fiyat
  features        JSONB                          -- ["Tüm temel özellikler", "1 Kullanıcı erişimi"]
);

-- Siparişler
CREATE TABLE IF NOT EXISTS orders (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  product_id  INTEGER NOT NULL REFERENCES products(id),
  tier_id     INTEGER NOT NULL REFERENCES product_tiers(id),
  amount      DECIMAL(10,2) NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mesajlar
CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  sender_id   INTEGER NOT NULL REFERENCES users(id),
  receiver_id INTEGER NOT NULL REFERENCES users(id),
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Bildirimleri
CREATE TABLE IF NOT EXISTS admin_notifications (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id),
  message     VARCHAR(500) NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ürün Yorumları
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  rating      SMALLINT NOT NULL DEFAULT 5,        -- 1-5 arası yıldız puanı
  comment     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (product_id, user_id)
);

-- Waitlist (ana sayfa e-posta toplama)
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Geliştirici eşleşme talepleri
CREATE TABLE IF NOT EXISTS match_requests (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name              VARCHAR(255),
  email             VARCHAR(255),
  need              TEXT NOT NULL,
  status            VARCHAR(20) NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'closed', 'cancelled')),
  assigned_user_id  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  conversation_id   INTEGER,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_match_requests_email ON match_requests (email);
CREATE INDEX IF NOT EXISTS idx_match_requests_status ON match_requests (status);

-- Kullanıcı bildirimleri
CREATE TABLE IF NOT EXISTS user_notifications (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  body        TEXT,
  href        VARCHAR(500),
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user
  ON user_notifications (user_id, created_at DESC);

-- Sepet
CREATE TABLE IF NOT EXISTS cart_items (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tier_id     INTEGER REFERENCES product_tiers(id) ON DELETE SET NULL,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, product_id, tier_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items (user_id);

-- Şifre sıfırlama tokenları
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR(64) NOT NULL UNIQUE,
  expires_at  TIMESTAMP NOT NULL,
  used_at     TIMESTAMP,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user
  ON password_reset_tokens (user_id);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires
  ON password_reset_tokens (expires_at);

-- Partner ürün formu taslağı (hesaba bağlı)
CREATE TABLE IF NOT EXISTS listing_drafts (
  user_id     INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data        JSONB NOT NULL,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Eşleşme konuşmaları
CREATE TABLE IF NOT EXISTS conversations (
  id                SERIAL PRIMARY KEY,
  type              VARCHAR(20) NOT NULL DEFAULT 'match',
  match_request_id  INTEGER REFERENCES match_requests(id) ON DELETE SET NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_read_at    TIMESTAMP,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_user
  ON conversation_participants (user_id);

-- Mevcut DB'lerde CREATE TABLE IF NOT EXISTS kolon eklemez; indeksten önce ALTER şart.
ALTER TABLE users ADD COLUMN IF NOT EXISTS match_available BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS match_skills VARCHAR(255);
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS assigned_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS conversation_id INTEGER;

ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_match_requests_assigned ON match_requests (assigned_user_id, status);

CREATE TABLE IF NOT EXISTS installation_requests (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  service_slug  VARCHAR(255) NOT NULL,
  service_name  VARCHAR(255) NOT NULL,
  company_name  VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  requirements  TEXT NOT NULL,
  deployment_type VARCHAR(32),
  status        VARCHAR(20) NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'closed', 'cancelled')),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_installation_requests_user
  ON installation_requests (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS error_logs (
  id          SERIAL PRIMARY KEY,
  source      VARCHAR(120) NOT NULL,
  message     TEXT NOT NULL,
  stack       TEXT,
  detail      TEXT,
  method      VARCHAR(16),
  path        VARCHAR(500),
  user_id     INTEGER,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs (created_at DESC);
