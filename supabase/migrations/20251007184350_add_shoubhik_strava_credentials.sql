-- Add Shoubhik's Strava API Configuration for OAuth Flow
-- Migration: Set up Shoubhik's Strava API config (OAuth method)
-- Date: 2025-10-07
--
-- IMPORTANT: This creates the API config and assigns it to Shoubhik.
-- Tokens will be obtained through OAuth when Shoubhik clicks "Connect with Strava"
--
-- Strava App Settings Requirements:
-- Client ID: 177311 must have these redirect URIs configured:
-- - http://localhost:5173/auth/strava/callback (for dev)
-- - https://trail-mate.ca/auth/strava/callback (for production)

DO $$
DECLARE
    v_user_id UUID;
    v_config_id UUID;
BEGIN
    -- Find Shoubhik's user_id by email or display_name
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

    -- 3. Initialize rate limiting for this config
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

    -- 4. Initialize sync preferences for the user (optional)
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
    RAISE NOTICE '========================================';
    RAISE NOTICE 'OAUTH FLOW: Next steps for Shoubhik:';
    RAISE NOTICE '1. Log in to the app';
    RAISE NOTICE '2. Click "Connect with Strava"';
    RAISE NOTICE '3. Authorize the app (client_id: 177311)';
    RAISE NOTICE '4. Tokens will be stored automatically';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'REMINDER: Verify redirect URIs in Strava app settings:';
    RAISE NOTICE '- http://localhost:5173/auth/strava/callback';
    RAISE NOTICE '- https://trail-mate.ca/auth/strava/callback';
    RAISE NOTICE '========================================';


EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error occurred: %', SQLERRM;
        RAISE;
END $$;
