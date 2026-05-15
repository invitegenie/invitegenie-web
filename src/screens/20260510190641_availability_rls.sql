-- 1. Create table (if it doesn't already exist)
CREATE TABLE IF NOT EXISTS public.availability_rules (
    id TEXT PRIMARY KEY DEFAULT ('AR-' || extract(epoch from now()) * 1000),
    "providerId" TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT DEFAULT 'available',
    reason TEXT,
    "timeSlots" JSONB DEFAULT '[]'::jsonb,
    "createdAt" TIMESTAMPTZ DEFAULT now(),
    "updatedAt" TIMESTAMPTZ DEFAULT now(),
    UNIQUE("providerId", date)
);

-- 2. Enable Row Level Security
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public Read Access
-- Customers need to view availability schedules to book services.
CREATE POLICY "Anyone can view availability rules"
    ON public.availability_rules
    FOR SELECT
    USING (true);

-- 4. Policy: Vendor Write Access (Insert, Update, Delete)
-- Vendors can only manage availability for providers they own.
-- Note: If your listings table is named differently (e.g., `providers` instead of `marketplace_listings`),
-- or your owner column is `user_id`, update the subquery below to match your actual schema.
CREATE POLICY "Vendors can manage their own availability rules"
    ON public.availability_rules
    FOR ALL
    USING (
        auth.uid()::text IN (
            SELECT "ownerId"::text FROM public.marketplace_listings WHERE id = "providerId"
        )
    )
    WITH CHECK (
        auth.uid()::text IN (
            SELECT "ownerId"::text FROM public.marketplace_listings WHERE id = "providerId"
        )
    );