-- 1. Create table
CREATE TABLE IF NOT EXISTS public.ai_event_plans (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    title TEXT,
    prompt TEXT,
    "eventType" TEXT,
    "eventStyle" TEXT,
    location TEXT,
    "guestCount" INTEGER,
    "estimatedBudget" NUMERIC,
    currency TEXT,
    "aiSummary" TEXT,
    "generatedTheme" JSONB DEFAULT '{}'::jsonb,
    "budgetBreakdown" JSONB DEFAULT '{}'::jsonb,
    timeline JSONB DEFAULT '[]'::jsonb,
    checklist JSONB DEFAULT '[]'::jsonb,
    "vendorSuggestions" JSONB DEFAULT '[]'::jsonb,
    "seatingSuggestions" JSONB DEFAULT '{}'::jsonb,
    "cateringEstimate" JSONB DEFAULT '{}'::jsonb,
    "riskRecommendations" JSONB DEFAULT '[]'::jsonb,
    "emergencyPreparation" JSONB DEFAULT '[]'::jsonb,
    "generatedWebsiteId" TEXT,
    "eventId" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT now(),
    "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.ai_event_plans ENABLE ROW LEVEL SECURITY;

-- 3. Policy: User Read/Write Access
CREATE POLICY "Users can manage their own ai event plans"
    ON public.ai_event_plans
    FOR ALL
    USING (auth.uid()::text = "userId")
    WITH CHECK (auth.uid()::text = "userId");