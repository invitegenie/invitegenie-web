-- InviteGenie runtime schema stabilization.
-- This migration is intentionally idempotent so it can be applied after the
-- earlier dashboard SQL without failing on existing objects.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  role text default 'free_user',
  admin_role text,
  permissions jsonb default '[]'::jsonb,
  status text default 'active',
  avatar_url text,
  account_type text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles add column if not exists admin_role text;
alter table public.profiles add column if not exists permissions jsonb default '[]'::jsonb;
alter table public.profiles add column if not exists status text default 'active';
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

create table if not exists public.events (
  id text primary key default ('evt-' || gen_random_uuid()::text),
  title text not null default 'Untitled Event',
  description text,
  status text default 'active',
  "hostId" text,
  host_id uuid,
  "hostName" text,
  date text,
  event_date timestamptz,
  location text,
  price numeric default 0,
  "totalTickets" integer default 100,
  total_tickets integer default 100,
  "availableTickets" integer default 100,
  available_tickets integer default 100,
  "ticketsSold" integer default 0,
  tickets_sold integer default 0,
  revenue numeric default 0,
  "coverImage" text,
  image_url text,
  category text,
  payload jsonb default '{}'::jsonb,
  "createdAt" timestamptz default now(),
  created_at timestamptz default now(),
  "updatedAt" timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.events add column if not exists "hostId" text;
alter table public.events add column if not exists host_id uuid;
alter table public.events add column if not exists payload jsonb default '{}'::jsonb;
alter table public.events enable row level security;

drop policy if exists "events_public_read_active" on public.events;
drop policy if exists "events_hosts_manage" on public.events;
create policy "events_public_read_active" on public.events
  for select using (status = 'active' or auth.uid()::text = "hostId"::text or auth.uid()::text = host_id::text);
create policy "events_hosts_manage" on public.events
  for all using (auth.uid()::text = "hostId"::text or auth.uid()::text = host_id::text)
  with check (auth.uid()::text = "hostId"::text or auth.uid()::text = host_id::text);

create table if not exists public.tickets (
  id text primary key default ('tkt-' || gen_random_uuid()::text),
  "eventId" text,
  event_id text,
  "userId" text,
  user_id uuid,
  "buyerName" text,
  buyer_name text,
  "buyerEmail" text,
  buyer_email text,
  "eventName" text,
  event_name text,
  type text,
  ticket_type text default 'Standard',
  price numeric default 0,
  date text,
  status text default 'valid',
  "qrValue" text,
  qr_value text,
  payload jsonb default '{}'::jsonb,
  "createdAt" timestamptz default now(),
  created_at timestamptz default now(),
  "updatedAt" timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.tickets add column if not exists "eventId" text;
alter table public.tickets add column if not exists "userId" text;
alter table public.tickets add column if not exists user_id uuid;
alter table public.tickets add column if not exists payload jsonb default '{}'::jsonb;
alter table public.tickets enable row level security;

drop policy if exists "tickets_users_read_own" on public.tickets;
drop policy if exists "tickets_users_insert_own" on public.tickets;
create policy "tickets_users_read_own" on public.tickets
  for select using (auth.uid()::text = "userId"::text or auth.uid()::text = user_id::text);
create policy "tickets_users_insert_own" on public.tickets
  for insert with check (auth.uid()::text = "userId"::text or auth.uid()::text = user_id::text);

create table if not exists public.payments (
  id text primary key default ('pay-' || gen_random_uuid()::text),
  "eventId" text,
  event_id text,
  "userId" text,
  user_id uuid,
  "ticketId" text,
  ticket_id text,
  amount numeric default 0,
  currency text default 'FCFA',
  method text,
  status text default 'completed',
  payload jsonb default '{}'::jsonb,
  date timestamptz,
  "createdAt" timestamptz default now(),
  created_at timestamptz default now(),
  "updatedAt" timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.payments add column if not exists "userId" text;
alter table public.payments add column if not exists user_id uuid;
alter table public.payments add column if not exists payload jsonb default '{}'::jsonb;
alter table public.payments enable row level security;

drop policy if exists "payments_users_read_own" on public.payments;
drop policy if exists "payments_users_insert_own" on public.payments;
create policy "payments_users_read_own" on public.payments
  for select using (auth.uid()::text = "userId"::text or auth.uid()::text = user_id::text);
create policy "payments_users_insert_own" on public.payments
  for insert with check (auth.uid()::text = "userId"::text or auth.uid()::text = user_id::text);

create table if not exists public.memories (
  id text primary key default ('mem-' || gen_random_uuid()::text),
  "eventId" text,
  event_id text,
  "userId" text,
  user_id uuid,
  "userName" text,
  caption text,
  image text,
  media_url text,
  likes jsonb default '[]'::jsonb,
  comments jsonb default '[]'::jsonb,
  payload jsonb default '{}'::jsonb,
  "createdAt" timestamptz default now(),
  created_at timestamptz default now(),
  "updatedAt" timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.memories add column if not exists "eventId" text;
alter table public.memories add column if not exists "userId" text;
alter table public.memories add column if not exists payload jsonb default '{}'::jsonb;
alter table public.memories enable row level security;

drop policy if exists "memories_authenticated_read" on public.memories;
drop policy if exists "memories_users_insert_own" on public.memories;
create policy "memories_authenticated_read" on public.memories
  for select using (auth.role() = 'authenticated');
create policy "memories_users_insert_own" on public.memories
  for insert with check (auth.uid()::text = "userId"::text or auth.uid()::text = user_id::text);

create table if not exists public.invitations (
  id text primary key default ('inv-' || gen_random_uuid()::text),
  "eventId" text,
  event_id text,
  "hostId" text,
  host_id uuid,
  "guestId" text,
  guest_id uuid,
  guest_email text,
  guest_name text,
  status text default 'draft',
  payload jsonb default '{}'::jsonb,
  "createdAt" timestamptz default now(),
  created_at timestamptz default now(),
  "updatedAt" timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.invitations add column if not exists "hostId" text;
alter table public.invitations add column if not exists "guestId" text;
alter table public.invitations add column if not exists payload jsonb default '{}'::jsonb;
alter table public.invitations enable row level security;

drop policy if exists "invitations_users_read_related" on public.invitations;
drop policy if exists "invitations_hosts_manage" on public.invitations;
create policy "invitations_users_read_related" on public.invitations
  for select using (
    auth.uid()::text = "hostId"::text or auth.uid()::text = host_id::text
    or auth.uid()::text = "guestId"::text or auth.uid()::text = guest_id::text
  );
create policy "invitations_hosts_manage" on public.invitations
  for all using (auth.uid()::text = "hostId"::text or auth.uid()::text = host_id::text)
  with check (auth.uid()::text = "hostId"::text or auth.uid()::text = host_id::text);

create table if not exists public.marketplace_listings (
  id text primary key default ('list-' || gen_random_uuid()::text),
  "ownerId" text,
  owner_id uuid,
  title text,
  business_name text,
  category text,
  status text default 'active',
  payload jsonb default '{}'::jsonb,
  "createdAt" timestamptz default now(),
  created_at timestamptz default now(),
  "updatedAt" timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.marketplace_listings add column if not exists "ownerId" text;
alter table public.marketplace_listings add column if not exists owner_id uuid;
alter table public.marketplace_listings add column if not exists payload jsonb default '{}'::jsonb;
alter table public.marketplace_listings enable row level security;

drop policy if exists "marketplace_public_read_active" on public.marketplace_listings;
drop policy if exists "marketplace_owner_manage" on public.marketplace_listings;
create policy "marketplace_public_read_active" on public.marketplace_listings
  for select using (status = 'active' or auth.uid()::text = "ownerId"::text or auth.uid()::text = owner_id::text);
create policy "marketplace_owner_manage" on public.marketplace_listings
  for all using (auth.uid()::text = "ownerId"::text or auth.uid()::text = owner_id::text)
  with check (auth.uid()::text = "ownerId"::text or auth.uid()::text = owner_id::text);

create table if not exists public.availability_rules (
  id text primary key default ('ar-' || gen_random_uuid()::text),
  "providerId" text not null,
  date date not null,
  status text default 'available',
  reason text,
  "timeSlots" jsonb default '[]'::jsonb,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now(),
  unique ("providerId", date)
);

alter table public.availability_rules enable row level security;

drop policy if exists "availability_public_read" on public.availability_rules;
drop policy if exists "availability_owner_manage" on public.availability_rules;
create policy "availability_public_read" on public.availability_rules
  for select using (true);
create policy "availability_owner_manage" on public.availability_rules
  for all using (
    exists (
      select 1 from public.marketplace_listings listing
      where listing.id = availability_rules."providerId"
        and (listing."ownerId"::text = auth.uid()::text or listing.owner_id::text = auth.uid()::text)
    )
  )
  with check (
    exists (
      select 1 from public.marketplace_listings listing
      where listing.id = availability_rules."providerId"
        and (listing."ownerId"::text = auth.uid()::text or listing.owner_id::text = auth.uid()::text)
    )
  );

create table if not exists public.ai_event_plans (
  id text primary key,
  "userId" text not null,
  title text,
  prompt text,
  "eventType" text,
  "eventStyle" text,
  location text,
  "guestCount" integer,
  "estimatedBudget" numeric,
  currency text default 'FCFA',
  "aiSummary" text,
  "generatedTheme" jsonb default '{}'::jsonb,
  "budgetBreakdown" jsonb default '{}'::jsonb,
  timeline jsonb default '[]'::jsonb,
  checklist jsonb default '[]'::jsonb,
  "vendorSuggestions" jsonb default '[]'::jsonb,
  "seatingSuggestions" jsonb default '{}'::jsonb,
  "cateringEstimate" jsonb default '{}'::jsonb,
  "riskRecommendations" jsonb default '[]'::jsonb,
  "emergencyPreparation" jsonb default '[]'::jsonb,
  "generatedWebsiteId" text,
  "eventId" text,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);

alter table public.ai_event_plans enable row level security;

drop policy if exists "ai_event_plans_owner_manage" on public.ai_event_plans;
create policy "ai_event_plans_owner_manage" on public.ai_event_plans
  for all using (auth.uid()::text = "userId")
  with check (auth.uid()::text = "userId");

create table if not exists public.conversations (
  id uuid default gen_random_uuid() primary key,
  participant1 text not null,
  participant2 text not null,
  listing_id text,
  listing_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.conversations enable row level security;

drop policy if exists "conversations_participants_read" on public.conversations;
drop policy if exists "conversations_participants_insert" on public.conversations;
create policy "conversations_participants_read" on public.conversations
  for select using (auth.uid()::text = participant1::text or auth.uid()::text = participant2::text);
create policy "conversations_participants_insert" on public.conversations
  for insert with check (auth.uid()::text = participant1::text or auth.uid()::text = participant2::text);

create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id text not null,
  text text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

drop policy if exists "messages_participants_read" on public.messages;
drop policy if exists "messages_sender_insert" on public.messages;
create policy "messages_participants_read" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.participant1::text = auth.uid()::text or c.participant2::text = auth.uid()::text)
    )
  );
create policy "messages_sender_insert" on public.messages
  for insert with check (auth.uid()::text = sender_id::text);

create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  type text not null default 'general',
  title text not null default 'Notification',
  message text not null default '',
  path text,
  status text default 'pending',
  channel text default 'in_app',
  read boolean default false,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

drop policy if exists "notifications_owner_manage" on public.notifications;
create policy "notifications_owner_manage" on public.notifications
  for all using (auth.uid()::text = user_id::text)
  with check (auth.uid()::text = user_id::text);

create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  title text not null,
  event_name text,
  completed boolean default false,
  due_at timestamptz,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.tasks enable row level security;

drop policy if exists "tasks_owner_manage" on public.tasks;
create policy "tasks_owner_manage" on public.tasks
  for all using (auth.uid()::text = user_id::text)
  with check (auth.uid()::text = user_id::text);

create table if not exists public.meetings (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  title text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  contact_name text,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.meetings enable row level security;

drop policy if exists "meetings_owner_manage" on public.meetings;
create policy "meetings_owner_manage" on public.meetings
  for all using (auth.uid()::text = user_id::text)
  with check (auth.uid()::text = user_id::text);

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "avatars_public_read" on storage.objects;
drop policy if exists "avatars_owner_upload" on storage.objects;
drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "avatars_owner_upload" on storage.objects
  for insert with check (bucket_id = 'avatars' and owner = auth.uid());
create policy "avatars_owner_update" on storage.objects
  for update using (bucket_id = 'avatars' and owner = auth.uid())
  with check (bucket_id = 'avatars' and owner = auth.uid());

create index if not exists events_status_idx on public.events(status);
create index if not exists events_host_id_text_idx on public.events("hostId");
create index if not exists tickets_user_id_text_idx on public.tickets("userId");
create index if not exists payments_user_id_text_idx on public.payments("userId");
create index if not exists availability_provider_date_idx on public.availability_rules("providerId", date);
create index if not exists conversations_participant1_idx on public.conversations(participant1);
create index if not exists conversations_participant2_idx on public.conversations(participant2);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);
create index if not exists tasks_user_completed_created_idx on public.tasks(user_id, completed, created_at desc);
create index if not exists meetings_user_start_time_idx on public.meetings(user_id, start_time);
