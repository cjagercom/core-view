-- CoreView Database Schema
-- Run against Neon PostgreSQL

-- Sessions table: core record for each user journey
CREATE TABLE IF NOT EXISTS sessions (
  id                    TEXT PRIMARY KEY,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status                TEXT NOT NULL DEFAULT 'in_progress',
  current_step          TEXT NOT NULL DEFAULT 'warmup',
  session_number        INTEGER NOT NULL DEFAULT 1,
  responses             JSONB NOT NULL DEFAULT '[]'::jsonb,
  dimension_accumulator JSONB NOT NULL DEFAULT '{}'::jsonb,
  profile               JSONB,
  llm_profile_text      JSONB,
  writing_text          TEXT,
  feedback_token        TEXT UNIQUE,
  feedback_enabled      BOOLEAN NOT NULL DEFAULT FALSE,
  feedback_responses    JSONB NOT NULL DEFAULT '[]'::jsonb,
  feedback_link_active  BOOLEAN NOT NULL DEFAULT FALSE,
  profile_text_versions JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions (status);
CREATE INDEX IF NOT EXISTS idx_sessions_last_active ON sessions (last_active_at);
CREATE INDEX IF NOT EXISTS idx_sessions_feedback_token ON sessions (feedback_token);

-- Analytics events table: anonymous event tracking
CREATE TABLE IF NOT EXISTS analytics_events (
  id           BIGSERIAL PRIMARY KEY,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_type   TEXT NOT NULL,
  event_data   JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_analytics_type_time ON analytics_events (event_type, occurred_at);

-- Migration: add profile_text_versions column
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS profile_text_versions JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Migration: add share_token column for read-only profile sharing
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_sessions_share_token ON sessions (share_token);
