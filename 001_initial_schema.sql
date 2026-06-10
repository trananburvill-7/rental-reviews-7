-- ============================================================
-- RentView - Complete Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- For accent-insensitive search

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE property_type AS ENUM (
  'house', 'unit', 'apartment', 'townhouse', 'duplex', 'studio', 'other'
);

CREATE TYPE moderation_status AS ENUM (
  'pending', 'approved', 'rejected'
);

CREATE TYPE rental_duration AS ENUM (
  'less_than_6_months', '6_12_months', '1_2_years', '2_plus_years'
);

CREATE TYPE australian_state AS ENUM (
  'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'
);

CREATE TYPE report_reason AS ENUM (
  'false_information', 'abuse', 'spam', 'defamation'
);

CREATE TYPE report_status AS ENUM (
  'pending', 'reviewed', 'actioned'
);

-- ============================================================
-- HELPER FUNCTION: slugify
-- ============================================================

CREATE OR REPLACE FUNCTION slugify(input text)
RETURNS text AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        unaccent(input),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- TABLE: properties
-- ============================================================

CREATE TABLE properties (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address       TEXT NOT NULL,
  suburb        TEXT NOT NULL,
  state         australian_state NOT NULL,
  postcode      CHAR(4) NOT NULL CHECK (postcode ~ '^\d{4}$'),
  property_type property_type NOT NULL DEFAULT 'house',
  bedrooms      SMALLINT CHECK (bedrooms >= 0 AND bedrooms <= 20),
  bathrooms     SMALLINT CHECK (bathrooms >= 0 AND bathrooms <= 20),
  car_spaces    SMALLINT CHECK (car_spaces >= 0 AND car_spaces <= 20),
  land_size     INTEGER CHECK (land_size > 0),
  description   TEXT,
  slug          TEXT UNIQUE NOT NULL,
  search_vector TSVECTOR,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-generate slug from address
CREATE OR REPLACE FUNCTION properties_set_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter   INT := 0;
BEGIN
  base_slug := slugify(NEW.address || ' ' || NEW.suburb || ' ' || NEW.state);
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM properties WHERE slug = final_slug AND id != NEW.id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  NEW.slug := final_slug;
  NEW.updated_at := NOW();
  NEW.search_vector := to_tsvector('english',
    coalesce(NEW.address, '') || ' ' ||
    coalesce(NEW.suburb, '') || ' ' ||
    coalesce(NEW.state::text, '') || ' ' ||
    coalesce(NEW.postcode, '') || ' ' ||
    coalesce(NEW.description, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_slug_trigger
BEFORE INSERT OR UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION properties_set_slug();

-- Indexes
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_suburb ON properties(lower(suburb));
CREATE INDEX idx_properties_state ON properties(state);
CREATE INDEX idx_properties_postcode ON properties(postcode);
CREATE INDEX idx_properties_search ON properties USING GIN(search_vector);
CREATE INDEX idx_properties_suburb_state ON properties(lower(suburb), state);

-- ============================================================
-- TABLE: property_images
-- ============================================================

CREATE TABLE property_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_property_images_property ON property_images(property_id);

-- ============================================================
-- TABLE: property_managers
-- ============================================================

CREATE TABLE property_managers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  agency          TEXT,
  photo_url       TEXT,
  office_location TEXT,
  email           TEXT,
  phone           TEXT,
  slug            TEXT UNIQUE NOT NULL,
  search_vector   TSVECTOR,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION managers_set_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter   INT := 0;
BEGIN
  base_slug := slugify(NEW.name || COALESCE(' ' || NEW.agency, ''));
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM property_managers WHERE slug = final_slug AND id != NEW.id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  NEW.slug := final_slug;
  NEW.updated_at := NOW();
  NEW.search_vector := to_tsvector('english',
    coalesce(NEW.name, '') || ' ' ||
    coalesce(NEW.agency, '') || ' ' ||
    coalesce(NEW.office_location, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER managers_slug_trigger
BEFORE INSERT OR UPDATE ON property_managers
FOR EACH ROW EXECUTE FUNCTION managers_set_slug();

CREATE INDEX idx_managers_slug ON property_managers(slug);
CREATE INDEX idx_managers_name ON property_managers(lower(name));
CREATE INDEX idx_managers_agency ON property_managers(lower(agency));
CREATE INDEX idx_managers_search ON property_managers USING GIN(search_vector);

-- ============================================================
-- TABLE: property_reviews
-- ============================================================

CREATE TABLE property_reviews (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id          UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  property_manager_id  UUID REFERENCES property_managers(id) ON DELETE SET NULL,
  nickname             TEXT CHECK (length(nickname) <= 50),
  property_condition   SMALLINT NOT NULL CHECK (property_condition BETWEEN 1 AND 5),
  manager_support      SMALLINT NOT NULL CHECK (manager_support BETWEEN 1 AND 5),
  maintenance_response SMALLINT NOT NULL CHECK (maintenance_response BETWEEN 1 AND 5),
  bond_return          SMALLINT NOT NULL CHECK (bond_return BETWEEN 1 AND 5),
  overall_rating       NUMERIC(3,2) NOT NULL,
  pros                 TEXT CHECK (length(pros) <= 2000),
  cons                 TEXT CHECK (length(cons) <= 2000),
  comments             TEXT CHECK (length(comments) <= 3000),
  rent_again           BOOLEAN,
  rental_duration      rental_duration,
  ip_hash              TEXT,
  moderation_status    moderation_status NOT NULL DEFAULT 'pending',
  moderation_notes     TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-calculate overall rating
CREATE OR REPLACE FUNCTION property_reviews_calculate_rating()
RETURNS TRIGGER AS $$
BEGIN
  NEW.overall_rating := ROUND(
    (NEW.property_condition + NEW.manager_support + NEW.maintenance_response + NEW.bond_return)::NUMERIC / 4,
    2
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER property_reviews_rating_trigger
BEFORE INSERT OR UPDATE ON property_reviews
FOR EACH ROW EXECUTE FUNCTION property_reviews_calculate_rating();

CREATE INDEX idx_property_reviews_property ON property_reviews(property_id);
CREATE INDEX idx_property_reviews_manager ON property_reviews(property_manager_id);
CREATE INDEX idx_property_reviews_status ON property_reviews(moderation_status);
CREATE INDEX idx_property_reviews_created ON property_reviews(created_at DESC);
CREATE INDEX idx_property_reviews_ip ON property_reviews(ip_hash);

-- ============================================================
-- TABLE: manager_reviews
-- ============================================================

CREATE TABLE manager_reviews (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_manager_id  UUID NOT NULL REFERENCES property_managers(id) ON DELETE CASCADE,
  property_id          UUID REFERENCES properties(id) ON DELETE SET NULL,
  nickname             TEXT CHECK (length(nickname) <= 50),
  communication        SMALLINT NOT NULL CHECK (communication BETWEEN 1 AND 5),
  professionalism      SMALLINT NOT NULL CHECK (professionalism BETWEEN 1 AND 5),
  maintenance_followup SMALLINT NOT NULL CHECK (maintenance_followup BETWEEN 1 AND 5),
  fairness             SMALLINT NOT NULL CHECK (fairness BETWEEN 1 AND 5),
  bond_handling        SMALLINT NOT NULL CHECK (bond_handling BETWEEN 1 AND 5),
  overall_rating       NUMERIC(3,2) NOT NULL,
  comments             TEXT CHECK (length(comments) <= 3000),
  ip_hash              TEXT,
  moderation_status    moderation_status NOT NULL DEFAULT 'pending',
  moderation_notes     TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION manager_reviews_calculate_rating()
RETURNS TRIGGER AS $$
BEGIN
  NEW.overall_rating := ROUND(
    (NEW.communication + NEW.professionalism + NEW.maintenance_followup + NEW.fairness + NEW.bond_handling)::NUMERIC / 5,
    2
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER manager_reviews_rating_trigger
BEFORE INSERT OR UPDATE ON manager_reviews
FOR EACH ROW EXECUTE FUNCTION manager_reviews_calculate_rating();

CREATE INDEX idx_manager_reviews_manager ON manager_reviews(property_manager_id);
CREATE INDEX idx_manager_reviews_status ON manager_reviews(moderation_status);
CREATE INDEX idx_manager_reviews_created ON manager_reviews(created_at DESC);
CREATE INDEX idx_manager_reviews_ip ON manager_reviews(ip_hash);

-- ============================================================
-- TABLE: review_reports
-- ============================================================

CREATE TABLE review_reports (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id        UUID NOT NULL,
  review_type      TEXT NOT NULL CHECK (review_type IN ('property', 'manager')),
  reason           report_reason NOT NULL,
  notes            TEXT CHECK (length(notes) <= 1000),
  reporter_ip_hash TEXT,
  status           report_status NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_review_reports_review ON review_reports(review_id);
CREATE INDEX idx_review_reports_status ON review_reports(status);

-- ============================================================
-- TABLE: admin_users
-- ============================================================

CREATE TABLE admin_users (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT UNIQUE NOT NULL,
  role       TEXT NOT NULL DEFAULT 'moderator' CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: rate_limit_log (for spam prevention)
-- ============================================================

CREATE TABLE rate_limit_log (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_hash    TEXT NOT NULL,
  action     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rate_limit_ip_action ON rate_limit_log(ip_hash, action);
CREATE INDEX idx_rate_limit_created ON rate_limit_log(created_at);

-- Auto-cleanup old rate limit entries (keep 7 days)
CREATE OR REPLACE FUNCTION cleanup_rate_limit_log()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limit_log WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- MATERIALIZED VIEW: property_stats
-- ============================================================

CREATE MATERIALIZED VIEW property_stats AS
SELECT
  p.id,
  p.slug,
  p.address,
  p.suburb,
  p.state,
  p.postcode,
  p.property_type,
  p.bedrooms,
  p.bathrooms,
  COUNT(r.id)::INT                              AS review_count,
  ROUND(AVG(r.overall_rating), 2)               AS avg_overall,
  ROUND(AVG(r.property_condition), 2)           AS avg_property_condition,
  ROUND(AVG(r.manager_support), 2)              AS avg_manager_support,
  ROUND(AVG(r.maintenance_response), 2)         AS avg_maintenance_response,
  ROUND(AVG(r.bond_return), 2)                  AS avg_bond_return
FROM properties p
LEFT JOIN property_reviews r ON r.property_id = p.id AND r.moderation_status = 'approved'
GROUP BY p.id
WITH DATA;

CREATE UNIQUE INDEX idx_property_stats_id ON property_stats(id);
CREATE INDEX idx_property_stats_avg ON property_stats(avg_overall DESC NULLS LAST);
CREATE INDEX idx_property_stats_count ON property_stats(review_count DESC);
CREATE INDEX idx_property_stats_suburb ON property_stats(lower(suburb));

-- ============================================================
-- MATERIALIZED VIEW: manager_stats
-- ============================================================

CREATE MATERIALIZED VIEW manager_stats AS
SELECT
  m.id,
  m.slug,
  m.name,
  m.agency,
  m.photo_url,
  m.office_location,
  COUNT(DISTINCT r.id)::INT                       AS review_count,
  ROUND(AVG(r.overall_rating), 2)                 AS avg_overall,
  ROUND(AVG(r.communication), 2)                  AS avg_communication,
  ROUND(AVG(r.professionalism), 2)                AS avg_professionalism,
  ROUND(AVG(r.maintenance_followup), 2)           AS avg_maintenance_followup,
  ROUND(AVG(r.fairness), 2)                       AS avg_fairness,
  ROUND(AVG(r.bond_handling), 2)                  AS avg_bond_handling,
  COUNT(DISTINCT pr.property_id)::INT             AS managed_property_count
FROM property_managers m
LEFT JOIN manager_reviews r ON r.property_manager_id = m.id AND r.moderation_status = 'approved'
LEFT JOIN property_reviews pr ON pr.property_manager_id = m.id AND pr.moderation_status = 'approved'
GROUP BY m.id
WITH DATA;

CREATE UNIQUE INDEX idx_manager_stats_id ON manager_stats(id);
CREATE INDEX idx_manager_stats_avg ON manager_stats(avg_overall DESC NULLS LAST);
CREATE INDEX idx_manager_stats_count ON manager_stats(review_count DESC);

-- ============================================================
-- MATERIALIZED VIEW: suburb_stats
-- ============================================================

CREATE MATERIALIZED VIEW suburb_stats AS
SELECT
  lower(p.suburb) AS suburb_lower,
  p.suburb,
  p.state,
  p.postcode,
  slugify(p.suburb || '-' || p.state) AS slug,
  COUNT(DISTINCT p.id)::INT           AS property_count,
  COUNT(DISTINCT r.id)::INT           AS review_count,
  ROUND(AVG(r.overall_rating), 2)     AS avg_overall
FROM properties p
LEFT JOIN property_reviews r ON r.property_id = p.id AND r.moderation_status = 'approved'
GROUP BY lower(p.suburb), p.suburb, p.state, p.postcode
WITH DATA;

CREATE UNIQUE INDEX idx_suburb_stats_slug ON suburb_stats(slug);
CREATE INDEX idx_suburb_stats_avg ON suburb_stats(avg_overall DESC NULLS LAST);
CREATE INDEX idx_suburb_stats_count ON suburb_stats(review_count DESC);

-- Function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY property_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY manager_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY suburb_stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Properties: public read, service role write
CREATE POLICY "properties_public_read"
  ON properties FOR SELECT USING (true);

CREATE POLICY "properties_service_write"
  ON properties FOR ALL
  USING (auth.role() = 'service_role');

-- Property Images: public read, service role write
CREATE POLICY "property_images_public_read"
  ON property_images FOR SELECT USING (true);

CREATE POLICY "property_images_service_write"
  ON property_images FOR ALL
  USING (auth.role() = 'service_role');

-- Property Managers: public read, service role write
CREATE POLICY "managers_public_read"
  ON property_managers FOR SELECT USING (true);

CREATE POLICY "managers_service_write"
  ON property_managers FOR ALL
  USING (auth.role() = 'service_role');

-- Property Reviews: public read approved only; anyone can insert; service role full access
CREATE POLICY "property_reviews_public_read"
  ON property_reviews FOR SELECT
  USING (moderation_status = 'approved');

CREATE POLICY "property_reviews_public_insert"
  ON property_reviews FOR INSERT
  WITH CHECK (moderation_status = 'pending');

CREATE POLICY "property_reviews_service_all"
  ON property_reviews FOR ALL
  USING (auth.role() = 'service_role');

-- Manager Reviews: same as property reviews
CREATE POLICY "manager_reviews_public_read"
  ON manager_reviews FOR SELECT
  USING (moderation_status = 'approved');

CREATE POLICY "manager_reviews_public_insert"
  ON manager_reviews FOR INSERT
  WITH CHECK (moderation_status = 'pending');

CREATE POLICY "manager_reviews_service_all"
  ON manager_reviews FOR ALL
  USING (auth.role() = 'service_role');

-- Review Reports: insert only for public; service role full access
CREATE POLICY "reports_public_insert"
  ON review_reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "reports_service_all"
  ON review_reports FOR ALL
  USING (auth.role() = 'service_role');

-- Admin Users: service role only
CREATE POLICY "admin_users_service_only"
  ON admin_users FOR ALL
  USING (auth.role() = 'service_role');

-- Rate Limit Log: service role only
CREATE POLICY "rate_limit_service_only"
  ON rate_limit_log FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Run in Supabase Dashboard > Storage:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('manager-photos', 'manager-photos', true);

-- ============================================================
-- SAMPLE DATA (Optional - for development)
-- ============================================================

-- Insert sample properties (Brisbane)
INSERT INTO properties (address, suburb, state, postcode, property_type, bedrooms, bathrooms, car_spaces, description, slug)
VALUES
  ('12 Coronation Drive', 'Milton', 'QLD', '4064', 'house', 3, 2, 2, 'Beautiful Queenslander in the heart of Milton', 'placeholder'),
  ('45 James Street', 'New Farm', 'QLD', '4005', 'apartment', 2, 1, 1, 'Modern apartment with river views', 'placeholder'),
  ('8/120 Petrie Terrace', 'Paddington', 'QLD', '4064', 'unit', 1, 1, 1, 'Renovated unit close to the CBD', 'placeholder'),
  ('33 Wickham Street', 'Fortitude Valley', 'QLD', '4006', 'apartment', 2, 2, 1, 'Contemporary apartment in the Valley', 'placeholder'),
  ('67 Skyring Terrace', 'Newstead', 'QLD', '4006', 'townhouse', 3, 2, 2, 'Brand new townhouse complex', 'placeholder');

-- Insert sample managers
INSERT INTO property_managers (name, agency, office_location, slug)
VALUES
  ('Sarah Mitchell', 'Ray White Brisbane', 'Brisbane City', 'placeholder'),
  ('James Chen', 'LJ Hooker New Farm', 'New Farm', 'placeholder'),
  ('Emma Wilson', 'RE/MAX Results', 'Fortitude Valley', 'placeholder');
