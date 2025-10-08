-- Add Shoubhik's Strava API Configuration and Tokens
-- Migration: Add Shoubhik's Strava credentials to the system
-- Date: 2025-10-07

-- NOTE: Before running this migration, you need to find Shoubhik's user_id
-- Run this query first to get the user_id:
-- SELECT id, email, raw_user_meta_data->>'display_name' as display_name
-- FROM auth.users
-- WHERE email ILIKE '%shoubhik%' OR raw_user_meta_data->>'display_name' ILIKE '%shoubhik%';

-- Set the user_id variable (REPLACE THIS WITH ACTUAL USER_ID)
DO $$
DECLARE
    v_user_id UUID;
    v_config_id UUID;
    v_token_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Find Shoubhik's user_id by email or display_name
    -- Adjust the WHERE clause based on how Shoubhik's account is identified
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE raw_user_meta_data->>'display_name' ILIKE '%shoubhik%'
       OR email ILIKE '%shoubhik%'
    LIMIT 1;

    -- If user not found, raise an error
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User Shoubhik not found. Please verify the user exists in auth.users table.';
    END IF;

    RAISE NOTICE 'Found user_id: %', v_user_id;

    -- 1. Insert Strava API configuration for Shoubhik
    INSERT INTO public.strava_api_configs (
        name,
        client_id,
        client_secret,
        is_active,
        daily_limit,
        fifteen_min_limit
    ) VALUES (
        'shoubhik_config',
        '177311',
        '9b88349a32db291048207670b2b63accd1582886',
        true,
        1000,
        100
    )
    RETURNING id INTO v_config_id;

    RAISE NOTICE 'Created Strava config with id: %', v_config_id;

    -- 2. Assign the config to Shoubhik's user account
    INSERT INTO public.user_strava_config_assignments (
        user_id,
        strava_config_id
    ) VALUES (
        v_user_id,
        v_config_id
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        strava_config_id = EXCLUDED.strava_config_id,
        updated_at = NOW();

    RAISE NOTICE 'Assigned config to user';

    -- 3. Store access and refresh tokens
    -- Strava tokens typically expire in 6 hours (21600 seconds)
    -- Setting expiration to 6 hours from now as a safe default
    v_token_expires_at := NOW() + INTERVAL '6 hours';

    INSERT INTO public.user_strava_tokens (
        user_id,
        access_token,
        refresh_token,
        expires_at,
        strava_config_id
    ) VALUES (
        v_user_id,
        'a26e01d05156cb7db52ddee83c8386b544001789',
        '9bc6489ab4df00fcf997e4a09aac0a44c20bf61b',
        v_token_expires_at,
        v_config_id
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        expires_at = EXCLUDED.expires_at,
        strava_config_id = EXCLUDED.strava_config_id,
        updated_at = NOW();

    RAISE NOTICE 'Stored tokens with expiration: %', v_token_expires_at;

    -- 4. Initialize rate limiting for this config
    INSERT INTO public.strava_rate_limits (
        strava_config_id,
        daily_requests,
        daily_window_start,
        fifteen_min_requests,
        fifteen_min_window_start,
        is_rate_limited,
        retry_after
    ) VALUES (
        v_config_id,
        0,
        CURRENT_DATE,
        0,
        NOW(),
        false,
        NULL
    )
    ON CONFLICT (strava_config_id)
    DO UPDATE SET
        updated_at = NOW();

    RAISE NOTICE 'Initialized rate limiting for config';

    -- 5. Initialize sync preferences for the user (optional)
    INSERT INTO public.user_sync_preferences (
        user_id,
        manual_sync_only,
        auto_sync_frequency,
        sync_activities,
        sync_profile
    ) VALUES (
        v_user_id,
        false,
        'daily',
        true,
        true
    )
    ON CONFLICT (user_id)
    DO NOTHING;

    RAISE NOTICE 'Setup completed successfully for Shoubhik';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'IMPORTANT: The access token may be expired.';
    RAISE NOTICE 'The app will automatically refresh it on first use.';
    RAISE NOTICE '============================================';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error occurred: %', SQLERRM;
        RAISE;
END $$;
