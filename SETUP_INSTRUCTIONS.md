# TrailBuddy Setup Instructions

## Database Setup

Your Supabase credentials:
- URL: `https://mdgosdteilqhpwwnojsa.supabase.co`
- Password: `hmJjdMpMejsTFwNF`

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard/project/mdgosdteilqhpwwnojsa
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents from `20250716_trailbuddy_schema.sql` 
5. Click **Run** to execute the schema

### Method 2: Using Supabase CLI

If you prefer using the CLI:

```bash
# Make sure you're in the project directory
cd /Users/tej/Documents/VSCode/Trailbuddyapp

# Push the migration (enter password when prompted)
supabase db push
```

## Next Steps After Database Setup

### 1. Configure Strava Developer App

1. Go to https://developers.strava.com/
2. Click **Create App**
3. Fill out the form:
   - **Application Name**: TrailBuddy
   - **Category**: Lifestyle
   - **Club**: Leave blank
   - **Website**: http://localhost:5173
   - **Authorization Callback Domain**: localhost:5173
   - **Description**: Personal activity tracking app
4. Click **Create**
5. Note your **Client ID** and **Client Secret**

### 2. Update Environment Variables

Edit the `.env` file and add your Strava credentials:

```env
# Supabase Configuration (already set)
VITE_SUPABASE_URL=https://mdgosdteilqhpwwnojsa.supabase.co
VITE_SUPABASE_ANON_KEY=hmJjdMpMejsTFwNF

# Strava Configuration (update these)
VITE_STRAVA_CLIENT_ID=your-client-id-here
VITE_STRAVA_CLIENT_SECRET=your-client-secret-here
VITE_STRAVA_REDIRECT_URI=http://localhost:5173/auth/strava/callback
```

### 3. Test the Application

```bash
# Start the development server
npm run dev
```

Visit http://localhost:5173 and test:
1. User registration/login
2. Strava OAuth connection
3. Activity dashboard

## Troubleshooting

If you encounter issues:

1. **Database connection errors**: Verify the schema was created successfully in Supabase
2. **Strava OAuth errors**: Check that your redirect URI matches exactly: `localhost:5173`
3. **Authentication errors**: Ensure your Supabase anon key is correct

## Files Created

- ✅ `20250716_trailbuddy_schema.sql` - Database schema
- ✅ `supabase/migrations/20250716000000_create_trailbuddy_schema.sql` - Migration file
- ✅ Complete React application with Strava integration
- ✅ Environment configuration