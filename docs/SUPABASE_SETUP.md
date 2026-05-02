# Supabase Integration Guide

This guide explains how to set up and use Supabase with Invite Genie.

## Prerequisites

- ✅ Supabase project created (https://supabase.com)
- ✅ Supabase URL and Anon Key configured in `.env.local`
- ✅ Firebase hosting configured

## Step 1: Apply the SQL Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `docs/SUPABASE_SCHEMA.sql`
5. Paste it into the SQL editor
6. Click **Run** to execute

This creates all 18 tables with proper Row Level Security (RLS) policies.

## Step 2: Verify Environment Variables

Confirm `.env.local` contains:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Never commit `.env.local` to Git. It's already in `.gitignore`.

## Step 3: Enable Real Supabase Client (Optional)

The app currently uses a **localStorage fallback mock**. To use real Supabase:

1. Install the Supabase JavaScript client:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Update `src/lib/supabaseClient.js`:
   - Uncomment the real initialization code
   - Comment out the mock client

3. Restart the dev server:
   ```bash
   npm run dev
   ```

## Step 4: Row Level Security (RLS) Policies

All tables have basic RLS policies enabled:

- **profiles**: Users can view all profiles, but only update their own
- **events**: Public events visible to all; private events only to host
- **tickets**: Users only see their own tickets; hosts see guest tickets
- **invitations**: Users see invitations sent to them; hosts manage their invitations
- **memories**: Anyone can view (public photos)
- **posts**: Anyone can view (social feed)

### Adding Custom Policies

For more specific access control, add policies in Supabase Dashboard:

1. Go to **Authentication > Policies**
2. Select a table
3. Click **Create Policy**
4. Define your access rules using SQL

Example: Allow only event hosts to view vendor management:

```sql
CREATE POLICY "Hosts can manage vendors"
  ON public.vendors
  FOR ALL
  USING (auth.uid()::text IN (
    SELECT host_id FROM events WHERE vendor_id = id
  ));
```

## Step 5: Testing Supabase Connection

Run the health check to verify Supabase is working:

```javascript
// In any React component
import { checkSupabaseHealth } from '../services/supabaseEngine';

const health = await checkSupabaseHealth();
console.log(health); // Will show status and any errors
```

## Step 6: Data Synchronization

The app uses a **hybrid approach**:

1. **localStorage is the source of truth** for now
2. When Supabase is enabled, data is also saved to Supabase
3. If Supabase fails, localStorage keeps the app working
4. On app load, data is read from localStorage first

This means:

- ✅ **App always works**, even if Supabase is down
- ✅ **Data is backed up to Supabase** when available
- ✅ **No breaking changes** to existing functionality
- ✅ **Gradual migration** possible without disrupting users

## Step 7: Using Supabase Functions in Components

### Getting Data (async)

```javascript
import { getEventsFromSupabase } from '../services/supabaseEngine';

// In a useEffect hook
useEffect(() => {
  const loadEvents = async () => {
    const events = await getEventsFromSupabase({ status: 'active' });
    setEvents(events);
  };
  loadEvents();
}, []);
```

### Creating Data (async)

```javascript
import { createEventInSupabase } from '../services/supabaseEngine';

const handleCreateEvent = async (eventData) => {
  const newEvent = await createEventInSupabase(eventData);
  // localStorage is automatically updated too
};
```

## Step 8: Authentication

Supabase provides built-in authentication. To use it:

1. Enable an auth provider in Supabase Dashboard:
   - Email/Password
   - Google
   - GitHub
   - Magic Link

2. Update your auth context to use Supabase:

```javascript
import { supabase } from '../lib/supabaseClient';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: userEmail,
  password: userPassword,
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: userEmail,
  password: userPassword,
});

// Get current session
const { data: { session } } = await supabase.auth.getSession();
```

## Step 9: Real-Time Subscriptions (Advanced)

Supabase supports real-time updates. Use this for live notifications:

```javascript
import { supabase } from '../lib/supabaseClient';

// Subscribe to new events
const subscription = supabase
  .channel('events')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'events' },
    (payload) => {
      console.log('New event:', payload.new);
      // Update UI
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

## Step 10: Database Backup & Restore

Supabase provides automatic daily backups. To export your data:

1. Go to **Settings > Database > Backups**
2. Download a backup in CSV or JSON format
3. Restore from backup if needed

## Troubleshooting

### "Supabase not configured" error

Check your `.env.local`:
```bash
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

Both should have values.

### "Row Level Security denied" error

The user doesn't have permission. Check:
1. Are they authenticated?
2. Does the RLS policy apply to their user role?
3. Is the table owner/host correct?

### "Supabase connection timeout"

Your Supabase instance might be sleeping (free tier). To keep it active:
1. Upgrade to paid plan (Supabase Pro)
2. Or access it regularly to keep it awake

### Data not syncing to Supabase

If data is in localStorage but not in Supabase:
1. Check that Supabase is enabled (`isSupabaseEnabled()`)
2. Verify network request in browser DevTools
3. Check Supabase logs for permission errors

## Security Best Practices

### ✅ Do

- Keep `VITE_SUPABASE_ANON_KEY` safe (it's public-facing but limited)
- Use Row Level Security on all tables
- Validate data on the backend (Supabase Edge Functions)
- Use HTTPS for all connections
- Rotate API keys periodically

### ❌ Don't

- Expose `VITE_SUPABASE_SERVICE_ROLE_KEY` in React (backend only!)
- Trust client-side validation alone
- Store sensitive data without encryption
- Use the Anon Key for sensitive operations

## Production Deployment

1. **Set environment variables** in Firebase:
   ```bash
   firebase functions:config:set supabase.url="..."
   firebase functions:config:set supabase.key="..."
   ```

2. **Create server-side functions** for sensitive operations:
   - Use Supabase Edge Functions
   - Or Firebase Cloud Functions
   - These can safely use `service_role_key`

3. **Enable backup strategy**:
   - Daily Supabase backups
   - Git commit important schema changes
   - Document all custom migrations

## Next Steps

- ✅ Apply the SQL schema
- ✅ Test data creation in Supabase
- ✅ Enable authentication
- ✅ Set up real-time subscriptions
- ✅ Create backup procedures
- ✅ Document custom policies
- ✅ Plan data migration strategy

## Support

For issues or questions:
- Supabase Docs: https://supabase.com/docs
- GitHub Issues: [Invite Genie repo]
- Email: support@invitegenie.app
