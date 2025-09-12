import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useDemo } from './DemoContext'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isDemoMode, demoUser } = useDemo()

  useEffect(() => {
    // Check for demo mode first - bypass Supabase entirely
    const urlParams = new URLSearchParams(window.location.search)
    const isDemoFromUrl = urlParams.get('demo') === 'true'
    
    if (isDemoMode || isDemoFromUrl) {
      setUser(demoUser)
      setLoading(false)
      return // No cleanup needed for demo mode
    }

    // Only attempt Supabase for real users
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('Supabase auth error:', error)
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes (only for non-demo mode)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [isDemoMode, demoUser])

  const signUp = async (email, password) => {
    // Skip Supabase in demo mode
    if (isDemoMode) {
      console.log('Demo mode: Skipping signup')
      return { user: demoUser }
    }

    console.log('AuthContext: Starting signup process for:', email)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      console.log('AuthContext: Supabase signup response:', { data, error })
      
      if (error) {
        console.error('AuthContext: Signup error details:', {
          message: error.message,
          status: error.status,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }
      
      console.log('AuthContext: Signup successful:', data)
      return data
    } catch (err) {
      console.error('AuthContext: Signup exception:', err)
      throw err
    }
  }

  const signIn = async (email, password) => {
    // Skip Supabase in demo mode
    if (isDemoMode) {
      console.log('Demo mode: Skipping sign in')
      return { user: demoUser }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('AuthContext: Sign in error:', error)
      throw error
    }
    console.log('AuthContext: Sign in successful')
    return data
  }

  const signInWithGoogle = async (includeFitnessScopes = false) => {
    // Skip Supabase in demo mode
    if (isDemoMode) {
      console.log('Demo mode: Skipping Google sign in')
      return { user: demoUser }
    }

    const options = {
      redirectTo: `${window.location.origin}/dashboard`
    }

    // Add Google Fit scopes if requested
    if (includeFitnessScopes) {
      options.scopes = [
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.body.read',
        'https://www.googleapis.com/auth/fitness.location.read'
      ].join(' ')
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options
    })
    
    if (error) {
      console.error('AuthContext: Google sign in error:', error)
      throw error
    }
    
    console.log('AuthContext: Google sign in initiated')
    return data
  }

  const signOut = async () => {
    console.log('AuthContext: Starting sign out process')
    
    // Skip Supabase in demo mode
    if (isDemoMode) {
      console.log('Demo mode: Skipping sign out, clearing user state')
      setUser(null)
      return { success: true }
    }

    try {
      console.log('AuthContext: Calling Supabase signOut')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('AuthContext: Sign out error:', error)
        throw error
      }
      
      console.log('AuthContext: Sign out successful')
      // Clear user state immediately
      setUser(null)
      return { success: true }
    } catch (error) {
      console.error('AuthContext: Sign out failed:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}