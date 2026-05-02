# InviteGenie Supabase Auth and RLS Notes

These notes describe the database shape expected by the frontend role-based auth architecture. Do not put service role keys in the frontend. Use only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vite.

## Tables

### profiles

- `id uuid primary key references auth.users`
- `email text`
- `full_name text`
- `phone text`
- `role text`
- `admin_role text`
- `permissions jsonb`
- `status text`
- `created_at timestamp`

### admin_roles

- `id uuid`
- `name text`
- `description text`
- `permissions jsonb`
- `created_by uuid`
- `created_at timestamp`

### admin_audit_logs

- `id uuid`
- `admin_id uuid`
- `action text`
- `target_type text`
- `target_id text`
- `metadata jsonb`
- `created_at timestamp`

### marketplace_listings

- `owner_id uuid`
- `status text`
- `approved_by uuid`

### events

- `host_id uuid`
- `status text`

## Row Level Security Plan

- Normal users can only read and update their own `profiles` row.
- Event hosts can create, read, update, and manage only events where `events.host_id = auth.uid()`.
- Vendors can manage only marketplace listings where `marketplace_listings.owner_id = auth.uid()`.
- Admin access should be permission-based. RLS policies can read permissions from `profiles.permissions` or an `admin_roles` join, but sensitive writes should also be validated by secure backend functions.
- `super_admin` has full platform access only through secure backend/RLS policies. Do not rely on frontend checks for final authorization.
- Admin role changes, marketplace approvals, financial setting changes, 2FA changes, and account status changes should write immutable rows into `admin_audit_logs`.

## Super Admin Phone MFA

The current React UI includes a development-only OTP placeholder. Production should use Supabase Auth MFA and phone/SMS challenge handling:

- `supabase.auth.mfa.getAuthenticatorAssuranceLevel()`
- `supabase.auth.mfa.enroll()`
- `supabase.auth.mfa.challenge()`
- `supabase.auth.mfa.verify()`

## Firebase Hosting

Firebase Hosting should rewrite all SPA routes to `/index.html`; the project `firebase.json` already includes:

```json
{ "source": "**", "destination": "/index.html" }
```
