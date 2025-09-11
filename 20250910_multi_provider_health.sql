-- Multi-Provider Health Integration Schema
-- Extends existing schema to support Strava, Google Health Connect, and Apple HealthKit

-- 1. Health Connections table (replaces single Strava tokens approach)
CREATE TABLE IF NOT EXISTS public.user_health_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_type TEXT NOT NULL CHECK (provider_type IN ('strava', 'google_health', 'apple_health')),
    provider_user_id TEXT, -- Provider's internal user ID
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    scopes TEXT[], -- Array of granted permissions
    connection_data JSONB, -- Provider-specific connection metadata
    last_sync_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, provider_type) -- One connection per provider per user
);

-- Enable RLS on user_health_connections
ALTER TABLE public.user_health_connections ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_health_connections
CREATE POLICY "Users can view their own health connections" 
    ON public.user_health_connections 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own health connections" 
    ON public.user_health_connections 
    FOR ALL 
    USING (auth.uid() = user_id);

-- 2. Unified Health Activities table
CREATE TABLE IF NOT EXISTS public.unified_health_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_type TEXT NOT NULL CHECK (provider_type IN ('strava', 'google_health', 'apple_health')),
    provider_activity_id TEXT NOT NULL, -- Original activity ID from provider
    activity_type TEXT NOT NULL, -- Normalized: run, walk, cycle, workout, etc.
    name TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_seconds INTEGER,
    distance_meters REAL,
    calories_burned INTEGER,
    steps INTEGER,
    heart_rate_avg INTEGER,
    heart_rate_max INTEGER,
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    raw_data JSONB, -- Original provider data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, provider_type, provider_activity_id) -- Prevent duplicates
);

-- Enable RLS on unified_health_activities
ALTER TABLE public.unified_health_activities ENABLE ROW LEVEL SECURITY;

-- RLS policies for unified_health_activities
CREATE POLICY "Users can view their own activities" 
    ON public.unified_health_activities 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own activities" 
    ON public.unified_health_activities 
    FOR ALL 
    USING (auth.uid() = user_id);

-- 3. User Activity Metrics (for matching algorithm)
CREATE TABLE IF NOT EXISTS public.user_activity_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    -- Weekly averages
    weekly_active_minutes REAL DEFAULT 0,
    weekly_steps REAL DEFAULT 0,
    weekly_distance_meters REAL DEFAULT 0,
    weekly_calories REAL DEFAULT 0,
    weekly_workout_count INTEGER DEFAULT 0,
    -- Activity preferences
    preferred_activity_types TEXT[] DEFAULT '{}',
    activity_level_score REAL DEFAULT 0, -- 0-100 score
    fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
    -- Schedule patterns
    preferred_workout_times INTEGER[] DEFAULT '{}', -- Hours of day (0-23)
    typical_workout_duration_minutes INTEGER,
    -- Last calculation
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_activity_metrics
ALTER TABLE public.user_activity_metrics ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_activity_metrics
CREATE POLICY "Users can view their own metrics" 
    ON public.user_activity_metrics 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own metrics" 
    ON public.user_activity_metrics 
    FOR ALL 
    USING (auth.uid() = user_id);

-- 4. Activity Sync Logs (track synchronization)
CREATE TABLE IF NOT EXISTS public.activity_sync_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_type TEXT NOT NULL,
    sync_type TEXT CHECK (sync_type IN ('full', 'incremental', 'manual')),
    activities_synced INTEGER DEFAULT 0,
    sync_status TEXT CHECK (sync_status IN ('success', 'partial', 'failed')) DEFAULT 'success',
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on activity_sync_logs
ALTER TABLE public.activity_sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for activity_sync_logs
CREATE POLICY "Users can view their own sync logs" 
    ON public.activity_sync_logs 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_health_connections_user_provider ON public.user_health_connections(user_id, provider_type);
CREATE INDEX IF NOT EXISTS idx_health_connections_active ON public.user_health_connections(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_unified_activities_user_time ON public.unified_health_activities(user_id, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_unified_activities_provider ON public.unified_health_activities(user_id, provider_type);
CREATE INDEX IF NOT EXISTS idx_unified_activities_type ON public.unified_health_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_metrics_score ON public.user_activity_metrics(activity_level_score DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_user_provider ON public.activity_sync_logs(user_id, provider_type, started_at DESC);

-- Add triggers for updated_at
CREATE TRIGGER handle_health_connections_updated_at
    BEFORE UPDATE ON public.user_health_connections
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_unified_activities_updated_at
    BEFORE UPDATE ON public.unified_health_activities
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_activity_metrics_updated_at
    BEFORE UPDATE ON public.user_activity_metrics
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to calculate activity level score
CREATE OR REPLACE FUNCTION public.calculate_activity_level_score(user_uuid UUID)
RETURNS REAL AS $$
DECLARE
    score REAL := 0;
    weekly_minutes REAL;
    weekly_workouts INTEGER;
    weekly_steps_count REAL;
BEGIN
    -- Get user's weekly averages
    SELECT 
        COALESCE(weekly_active_minutes, 0),
        COALESCE(weekly_workout_count, 0),
        COALESCE(weekly_steps, 0)
    INTO weekly_minutes, weekly_workouts, weekly_steps_count
    FROM public.user_activity_metrics 
    WHERE user_id = user_uuid;
    
    -- Calculate score based on multiple factors (0-100)
    -- Active minutes (40% weight): 150+ minutes = full points
    score := score + LEAST(40, (weekly_minutes / 150.0) * 40);
    
    -- Workout frequency (30% weight): 4+ workouts = full points  
    score := score + LEAST(30, (weekly_workouts / 4.0) * 30);
    
    -- Daily steps (30% weight): 10000+ steps/day = full points
    score := score + LEAST(30, ((weekly_steps_count / 7.0) / 10000.0) * 30);
    
    RETURN ROUND(score, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update activity metrics
CREATE OR REPLACE FUNCTION public.update_user_activity_metrics(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    metrics_record RECORD;
BEGIN
    -- Calculate metrics from last 4 weeks of activities
    SELECT 
        AVG(weekly_active_minutes) as avg_active_minutes,
        AVG(weekly_steps) as avg_steps,
        AVG(weekly_distance) as avg_distance,
        AVG(weekly_calories) as avg_calories,
        AVG(weekly_workouts) as avg_workouts,
        array_agg(DISTINCT activity_type) as activity_types,
        array_agg(DISTINCT EXTRACT(HOUR FROM start_time)::INTEGER) as workout_hours,
        AVG(duration_seconds / 60) as avg_duration
    FROM (
        SELECT 
            DATE_TRUNC('week', start_time) as week,
            SUM(CASE WHEN activity_level IN ('moderate', 'active', 'very_active') THEN duration_seconds / 60.0 ELSE 0 END) as weekly_active_minutes,
            SUM(COALESCE(steps, 0)) as weekly_steps,
            SUM(COALESCE(distance_meters, 0)) as weekly_distance,
            SUM(COALESCE(calories_burned, 0)) as weekly_calories,
            COUNT(*) as weekly_workouts,
            activity_type,
            start_time,
            duration_seconds
        FROM public.unified_health_activities 
        WHERE user_id = user_uuid 
            AND start_time >= NOW() - INTERVAL '4 weeks'
        GROUP BY week, activity_type, start_time, duration_seconds
    ) weekly_stats
    INTO metrics_record;
    
    -- Upsert metrics
    INSERT INTO public.user_activity_metrics (
        user_id,
        weekly_active_minutes,
        weekly_steps,
        weekly_distance_meters,
        weekly_calories,
        weekly_workout_count,
        preferred_activity_types,
        preferred_workout_times,
        typical_workout_duration_minutes,
        last_calculated_at
    ) VALUES (
        user_uuid,
        COALESCE(metrics_record.avg_active_minutes, 0),
        COALESCE(metrics_record.avg_steps, 0),
        COALESCE(metrics_record.avg_distance, 0),
        COALESCE(metrics_record.avg_calories, 0),
        COALESCE(metrics_record.avg_workouts, 0),
        COALESCE(metrics_record.activity_types, '{}'),
        COALESCE(metrics_record.workout_hours, '{}'),
        COALESCE(metrics_record.avg_duration, 0),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        weekly_active_minutes = EXCLUDED.weekly_active_minutes,
        weekly_steps = EXCLUDED.weekly_steps,
        weekly_distance_meters = EXCLUDED.weekly_distance_meters,
        weekly_calories = EXCLUDED.weekly_calories,
        weekly_workout_count = EXCLUDED.weekly_workout_count,
        preferred_activity_types = EXCLUDED.preferred_activity_types,
        preferred_workout_times = EXCLUDED.preferred_workout_times,
        typical_workout_duration_minutes = EXCLUDED.typical_workout_duration_minutes,
        last_calculated_at = NOW(),
        updated_at = NOW();
        
    -- Update activity level score
    UPDATE public.user_activity_metrics 
    SET activity_level_score = public.calculate_activity_level_score(user_uuid)
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;