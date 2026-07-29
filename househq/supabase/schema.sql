-- HouseHQ database schema.
-- Run this once in the Supabase SQL Editor (see SETUP-GUIDE.md, step "Set up the database").
-- Safe to re-run: every statement is guarded with IF NOT EXISTS.

create extension if not exists pgcrypto;

-- One row per purchase attempt: a single checklist, or a state bundle (12 checklists).
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('single', 'bundle')),
  state text not null,
  product_slug text,                     -- null for bundle orders
  email text not null,
  phone text,
  marketing_consent boolean not null default false,
  amount_cents integer not null,
  currency text not null default 'aud',
  stripe_session_id text unique,
  stripe_payment_intent text,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'verified', 'expired', 'cancelled')),
  verification_code_hash text,
  verification_token_hash text,
  verification_expires_at timestamptz,
  verification_attempts integer not null default 0,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists orders_stripe_session_idx on orders (stripe_session_id);
create index if not exists orders_email_idx on orders (email);

-- Separate, explicit marketing-email consent register (Spam Act 2003 (Cth)).
create table if not exists marketing_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  consent_at timestamptz not null default now(),
  consent_source text not null,          -- e.g. 'checkout', 'notify-agents', 'notify-guides'
  unsubscribed_at timestamptz
);

-- "Notify me" signups from the Coming Soon cards.
create table if not exists notify_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  list text not null,                    -- 'agents' | 'guides' | 'tools'
  created_at timestamptz not null default now()
);

-- Contact Us form submissions.
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security: these tables are only ever read/written by the server
-- using the service role key, never directly from the browser, so client
-- access is locked out entirely.
alter table orders enable row level security;
alter table marketing_subscribers enable row level security;
alter table notify_signups enable row level security;
alter table contact_messages enable row level security;
