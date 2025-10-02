-- Multi-User Strava API Configuration
-- Migration: Add support for multiple Strava API configurations and enhanced rate limiting
-- Date: 2025-09-28

-- 1. Strava API configurations table (stores different API key sets)
CREATE TABLE IF NOT EXISTS public.strava_api_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- e.g., 'user1_config', 'user2_config', 'user3_config'
    client_id TEXT NOT NULL,
    client_secret TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    daily_limit INTEGER DEFAULT 1000, -- Strava's daily limit per app
    fifteen_min_limit INTEGER DEFAULT 100, -- Strava's 15-minute limit per app
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on strava_api_configs (admin only access)
ALTER TABLE public.strava_api_configs ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for strava_api_configs (you'll need to set admin user IDs)
-- CREATE POLICY "Admin can manage API configs"
--     ON public.strava_api_configs
--     FOR ALL
--     USING (auth.uid() IN (
--         '00000000-0000-0000-0000-000000000000'::uuid  -- Replace with your actual admin user ID
--     ));

-- 2. User API config assignments table
CREATE TABLE IF NOT EXISTS public.user_strava_config_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    strava_config_id UUID REFERENCES public.strava_api_configs(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_strava_config_assignments
ALTER TABLE public.user_strava_config_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_strava_config_assignments
CREATE POLICY "Users can view their own config assignment"
    ON public.user_strava_config_assignments
    FOR SELECT
    USING (auth.uid() = user_id);

-- CREATE POLICY "Admin can manage config assignments"
--     ON public.user_strava_config_assignments
--     FOR ALL
--     USING (auth.uid() IN (
--         '00000000-0000-0000-0000-000000000000'::uuid  -- Replace with your actual admin user ID
--     ));

-- 3. Rate limit tracking table (persistent rate limiting per config)
CREATE TABLE IF NOT EXISTS public.strava_rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strava_config_id UUID REFERENCES public.strava_api_configs(id) ON DELETE CASCADE,
    daily_requests INTEGER DEFAULT 0,
    daily_window_start DATE DEFAULT CURRENT_DATE,
    fifteen_min_requests INTEGER DEFAULT 0,
    fifteen_min_window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_request_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_rate_limited BOOLEAN DEFAULT false,
    retry_after TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(strava_config_id)
);

-- Enable RLS on strava_rate_limits
ALTER TABLE public.strava_rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS policies for strava_rate_limits (users can view rate limits for their assigned config)
CREATE POLICY "Users can view rate limits for their config"
    ON public.strava_rate_limits
    FOR SELECT
    USING (
        strava_config_id IN (
            SELECT strava_config_id
            FROM public.user_strava_config_assignments
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "System can update rate limits"
    ON public.strava_rate_limits
    FOR ALL
    USING (true); -- Allow system to update rate limits

-- 4. Sync requests table (manual sync approval workflow)
CREATE TABLE IF NOT EXISTS public.strava_sync_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL CHECK (request_type IN ('full_sync', 'activities_sync', 'profile_sync')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'failed')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    sync_details JSONB, -- Store details about what was synced
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on strava_sync_requests
ALTER TABLE public.strava_sync_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for strava_sync_requests
CREATE POLICY "Users can view their own sync requests"
    ON public.strava_sync_requests
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sync requests"
    ON public.strava_sync_requests
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sync requests"
    ON public.strava_sync_requests
    FOR UPDATE
    USING (auth.uid() = user_id);

-- 5. User sync preferences table
CREATE TABLE IF NOT EXISTS public.user_sync_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    manual_sync_only BOOLEAN DEFAULT false,
    auto_sync_frequency TEXT DEFAULT 'daily' CHECK (auto_sync_frequency IN ('never', 'hourly', 'daily', 'weekly')),
    sync_activities BOOLEAN DEFAULT true,
    sync_profile BOOLEAN DEFAULT true,
    last_auto_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_sync_preferences
ALTER TABLE public.user_sync_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_sync_preferences
CREATE POLICY "Users can view their own sync preferences"
    ON public.user_sync_preferences
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sync preferences"
    ON public.user_sync_preferences
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sync preferences"
    ON public.user_sync_preferences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 6. Add foreign key to existing user_strava_tokens table to link with config
ALTER TABLE public.user_strava_tokens
ADD COLUMN IF NOT EXISTS strava_config_id UUID REFERENCES public.strava_api_configs(id);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_strava_config_assignments_user_id
    ON public.user_strava_config_assignments(user_id);

CREATE INDEX IF NOT EXISTS idx_strava_rate_limits_config_id
    ON public.strava_rate_limits(strava_config_id);

CREATE INDEX IF NOT EXISTS idx_strava_sync_requests_user_id_status
    ON public.strava_sync_requests(user_id, status);

CREATE INDEX IF NOT EXISTS idx_user_sync_preferences_user_id
    ON public.user_sync_preferences(user_id);

-- 8. Insert initial API configurations (you'll need to update these with your actual values)
-- INSERT INTO public.strava_api_configs (name, client_id, client_secret, is_active) VALUES
-- ('primary_config', 'your_client_id_1', 'your_client_secret_1', true),
-- ('secondary_config', 'your_client_id_2', 'your_client_secret_2', true),
-- ('tertiary_config', 'your_client_id_3', 'your_client_secret_3', true);

-- 9. Function to automatically clean up old rate limit data
CREATE OR REPLACE FUNCTION cleanup_old_rate_limit_data()
RETURNS void AS $$
BEGIN
    -- Reset daily counters if new day
    UPDATE public.strava_rate_limits
    SET
        daily_requests = 0,
        daily_window_start = CURRENT_DATE,
        updated_at = NOW()
    WHERE daily_window_start < CURRENT_DATE;

    -- Reset 15-minute counters if window expired
    UPDATE public.strava_rate_limits
    SET
        fifteen_min_requests = 0,
        fifteen_min_window_start = NOW(),
        is_rate_limited = false,
        retry_after = NULL,
        updated_at = NOW()
    WHERE fifteen_min_window_start < NOW() - INTERVAL '15 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create updated_at triggers for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_strava_api_configs_updated_at
    BEFORE UPDATE ON public.strava_api_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_strava_config_assignments_updated_at
    BEFORE UPDATE ON public.user_strava_config_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strava_rate_limits_updated_at
    BEFORE UPDATE ON public.strava_rate_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strava_sync_requests_updated_at
    BEFORE UPDATE ON public.strava_sync_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sync_preferences_updated_at
    BEFORE UPDATE ON public.user_sync_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();