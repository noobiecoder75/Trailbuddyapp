import { supabase } from '../lib/supabase'

// Test database connection and schema
export const testDatabaseConnection = async () => {
  console.log('Testing database connection...')
  
  try {
    // Test basic connection
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    console.log('Session test:', { sessionData, sessionError })
    
    // Test if user_profiles table exists
    const { data: profilesData, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)
    
    console.log('user_profiles table test:', { profilesData, profilesError })
    
    // Test if user_strava_tokens table exists
    const { data: tokensData, error: tokensError } = await supabase
      .from('user_strava_tokens')
      .select('*')
      .limit(1)
    
    console.log('user_strava_tokens table test:', { tokensData, tokensError })
    
    // Test if strava_activities table exists
    const { data: activitiesData, error: activitiesError } = await supabase
      .from('strava_activities')
      .select('*')
      .limit(1)
    
    console.log('strava_activities table test:', { activitiesData, activitiesError })
    
    return {
      connection: !sessionError,
      userProfiles: !profilesError,
      stravaTokens: !tokensError,
      stravaActivities: !activitiesError
    }
    
  } catch (error) {
    console.error('Database test error:', error)
    return {
      connection: false,
      userProfiles: false,
      stravaTokens: false,
      stravaActivities: false,
      error: error.message
    }
  }
}

// Test user signup without profile creation
export const testBasicSignup = async (email, password) => {
  console.log('Testing basic signup without profile creation...')
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    
    console.log('Basic signup test result:', { data, error })
    return { success: !error, data, error }
    
  } catch (error) {
    console.error('Basic signup test error:', error)
    return { success: false, error: error.message }
  }
}