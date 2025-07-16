-- TrailBuddy Database Schema
-- This file contains the SQL commands to set up the database schema in Supabase

-- Enable Row Level Security (RLS) for all tables
-- This is already enabled by default in Supabase

-- 1. User profiles table (extends the built-in auth.users table)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" 
    ON public.user_profiles 
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.user_profiles 
    FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON public.user_profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- 2. Strava tokens table (stores encrypted access/refresh tokens)
CREATE TABLE IF NOT EXISTS public.user_strava_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    athlete_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_strava_tokens
ALTER TABLE public.user_strava_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_strava_tokens
CREATE POLICY "Users can view their own tokens" 
    ON public.user_strava_tokens 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens" 
    ON public.user_strava_tokens 
    FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tokens" 
    ON public.user_strava_tokens 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tokens" 
    ON public.user_strava_tokens 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- 3. Activity cache table (optional - for caching Strava activities)
CREATE TABLE IF NOT EXISTS public.strava_activities (
    id BIGINT PRIMARY KEY, -- Strava activity ID
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    distance REAL,
    moving_time INTEGER,
    elapsed_time INTEGER,
    total_elevation_gain REAL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    average_speed REAL,
    max_speed REAL,
    activity_data JSONB, -- Store full activity data from Strava
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on strava_activities
ALTER TABLE public.strava_activities ENABLE ROW LEVEL SECURITY;

-- RLS policies for strava_activities
CREATE POLICY "Users can view their own activities" 
    ON public.strava_activities 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities" 
    ON public.strava_activities 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" 
    ON public.strava_activities 
    FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities" 
    ON public.strava_activities 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_strava_activities_user_id ON public.strava_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_strava_activities_start_date ON public.strava_activities(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_strava_activities_type ON public.strava_activities(type);
CREATE INDEX IF NOT EXISTS idx_user_strava_tokens_user_id ON public.user_strava_tokens(user_id);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER handle_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_strava_tokens_updated_at
    BEFORE UPDATE ON public.user_strava_tokens
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_strava_activities_updated_at
    BEFORE UPDATE ON public.strava_activities
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Optional: Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, display_name, avatar_url)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();