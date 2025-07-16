# TrailBuddy - Strava Activity Tracker

A React application that integrates with Strava to help you track and analyze your outdoor activities. Built with React, Supabase, and TailwindCSS.

## Features

- **Secure Authentication**: Email/password authentication with Supabase
- **Strava Integration**: OAuth 2.0 connection to your Strava account
- **Activity Dashboard**: View your recent activities with rich data
- **Advanced Filtering**: Filter activities by type (run, ride, hike, etc.)
- **Smart Sorting**: Sort by date, distance, duration, or elevation
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Automatic token refresh and activity syncing

## Prerequisites

Before you begin, ensure you have the following:

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account
- A Strava Developer account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd trailbuddy-app
npm install
```

### 2. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be fully set up
3. Go to Settings → API to get your project URL and anon key
4. In the SQL Editor, run the commands from `database-schema.sql` to create the necessary tables

### 3. Strava Developer App Setup

1. Go to [Strava Developers](https://developers.strava.com/)
2. Create a new application
3. Set the **Authorization Callback Domain** to `localhost:5173` (for development)
4. Note down your Client ID and Client Secret

### 4. Environment Variables

Copy the `.env.example` file to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Strava Configuration
VITE_STRAVA_CLIENT_ID=your-strava-client-id
VITE_STRAVA_CLIENT_SECRET=your-strava-client-secret
VITE_STRAVA_REDIRECT_URI=http://localhost:5173/auth/strava/callback
```

### 5. Database Setup

Run the SQL commands from `database-schema.sql` in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Run the queries

This will create:
- User profiles table
- Strava tokens table  
- Activity cache table (optional)
- Necessary indexes and Row Level Security policies

### 6. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Getting Started

1. **Sign Up/Login**: Create a new account or log in with existing credentials
2. **Connect Strava**: Go to your profile and click "Connect with Strava"
3. **Authorize**: Complete the OAuth flow to authorize TrailBuddy
4. **View Activities**: Return to the dashboard to see your recent activities

### Features Overview

- **Dashboard**: Main view showing your connected activities
- **Filtering**: Filter activities by type (running, cycling, hiking, etc.)
- **Sorting**: Sort by date, distance, duration, or elevation gain
- **Activity Cards**: Rich display of activity data including pace, elevation, and duration
- **Profile Management**: Manage your Strava connection and account settings

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   │   ├── LoginForm.jsx
│   │   ├── SignupForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── strava/            # Strava-specific components
│   │   ├── StravaConnect.jsx
│   │   ├── ActivityCard.jsx
│   │   ├── ActivityList.jsx
│   │   └── ActivityFilters.jsx
│   └── common/            # Shared components
├── contexts/              # React contexts
│   ├── AuthContext.jsx    # Authentication state
│   └── StravaContext.jsx  # Strava integration state
├── lib/                   # External service configurations
│   ├── supabase.js        # Supabase client
│   └── stravaApi.js       # Strava API utilities
├── pages/                 # Route components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   └── StravaCallback.jsx
├── utils/                 # Utility functions
│   └── formatters.js      # Data formatting helpers
└── hooks/                 # Custom React hooks
```

## API Integration

### Strava API Endpoints Used

- `GET /athlete` - Get authenticated athlete's profile
- `GET /athlete/activities` - Get athlete's activities
- `POST /oauth/token` - Token exchange and refresh

### Rate Limiting

Strava has the following rate limits:
- 100 requests per 15 minutes
- 1000 requests per day

The application implements:
- Automatic token refresh
- Request caching
- Error handling for rate limits

## Security Features

- **Row Level Security**: All database operations are secured with RLS
- **Token Encryption**: Strava tokens are stored securely in Supabase
- **Protected Routes**: Authentication required for all sensitive pages
- **CORS Configuration**: Proper CORS setup for API calls
- **Input Validation**: Client-side validation for all forms

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Activity Types**: Add to `ActivityFilters.jsx` activityTypes array
2. **Additional Metrics**: Extend `ActivityCard.jsx` and `formatters.js`
3. **More Filters**: Add new filter options in `ActivityFilters.jsx`

## Deployment

### Production Environment Variables

Update your environment variables for production:

```env
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-supabase-anon-key
VITE_STRAVA_CLIENT_ID=your-strava-client-id
VITE_STRAVA_CLIENT_SECRET=your-strava-client-secret
VITE_STRAVA_REDIRECT_URI=https://your-domain.com/auth/strava/callback
```

### Strava App Configuration

Update your Strava app settings:
- Set **Authorization Callback Domain** to your production domain
- Update **Website** and **Application Description**

### Build and Deploy

```bash
npm run build
```

Deploy the `dist` folder to your hosting platform of choice.

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure `.env` file exists and contains correct Supabase credentials
   - Check that variable names start with `VITE_`

2. **"Failed to exchange code for tokens"**
   - Verify Strava Client ID and Secret are correct
   - Check that redirect URI matches exactly in Strava app settings

3. **"Access denied" error**
   - User declined Strava authorization
   - Check Strava app permissions and scopes

4. **Activities not loading**
   - Check browser console for errors
   - Verify Strava token hasn't expired
   - Ensure database tables exist and RLS is configured

### Database Connection Issues

If you encounter database connection issues:

1. Check Supabase project status
2. Verify Row Level Security policies are active
3. Ensure API keys have correct permissions
4. Check that tables exist in the public schema

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the [Strava API documentation](https://developers.strava.com/docs/)
3. Check [Supabase documentation](https://supabase.com/docs)
4. Open an issue in the repository