import { createContext, useContext, useState, useEffect } from 'react'

const DemoContext = createContext({})

export const useDemo = () => {
  const context = useContext(DemoContext)
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider')
  }
  return context
}

export const DemoProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoStep, setDemoStep] = useState(0)

  // Check URL params for demo mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('demo') === 'true') {
      setIsDemoMode(true)
    }
  }, [])

  // Demo user data
  const demoUser = {
    id: 'demo-user-123',
    email: 'alex@trailbuddy.ca',
    name: 'Alex Thompson',
    created_at: new Date().toISOString()
  }

  // Mock Strava athlete data
  const demoAthlete = {
    id: 12345678,
    username: 'alexthompson',
    firstname: 'Alex',
    lastname: 'Thompson',
    city: 'Vancouver',
    state: 'BC',
    country: 'Canada',
    profile: 'https://ui-avatars.com/api/?name=Alex+Thompson&background=3b82f6&color=fff&size=200',
    stats: {
      recent_run_totals: {
        count: 12,
        distance: 156789,
        moving_time: 43200,
        elevation_gain: 1234
      },
      all_run_totals: {
        count: 234,
        distance: 2456789,
        moving_time: 864000,
        elevation_gain: 23456
      }
    }
  }

  // Mock activities data
  const demoActivities = [
    {
      id: 1,
      name: 'Morning Trail Run - Lynn Canyon',
      type: 'Run',
      sport_type: 'TrailRun',
      start_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      start_date_local: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      distance: 12543,
      moving_time: 3845,
      elapsed_time: 4200,
      total_elevation_gain: 342,
      average_speed: 3.26,
      max_speed: 5.2,
      average_heartrate: 152,
      max_heartrate: 178,
      kudos_count: 23,
      comment_count: 5,
      athlete_count: 3,
      map: {
        summary_polyline: 'encoded_polyline_data'
      }
    },
    {
      id: 2,
      name: 'Grouse Grind Challenge',
      type: 'Run',
      sport_type: 'TrailRun',
      start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      start_date_local: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      distance: 2900,
      moving_time: 3012,
      elapsed_time: 3400,
      total_elevation_gain: 853,
      average_speed: 0.96,
      max_speed: 2.1,
      average_heartrate: 168,
      max_heartrate: 185,
      kudos_count: 45,
      comment_count: 12,
      athlete_count: 1
    },
    {
      id: 3,
      name: 'Seawall Sunset Ride',
      type: 'Ride',
      sport_type: 'Ride',
      start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      start_date_local: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      distance: 28456,
      moving_time: 5423,
      elapsed_time: 6000,
      total_elevation_gain: 45,
      average_speed: 5.24,
      max_speed: 8.9,
      average_heartrate: 135,
      max_heartrate: 162,
      kudos_count: 18,
      comment_count: 3,
      athlete_count: 4
    },
    {
      id: 4,
      name: 'Deep Cove Trail Adventure',
      type: 'Run',
      sport_type: 'TrailRun',
      start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      start_date_local: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      distance: 18234,
      moving_time: 6789,
      elapsed_time: 7200,
      total_elevation_gain: 567,
      average_speed: 2.69,
      max_speed: 4.8,
      average_heartrate: 148,
      max_heartrate: 172,
      kudos_count: 34,
      comment_count: 8,
      athlete_count: 2
    },
    {
      id: 5,
      name: 'Pacific Spirit Park Loop',
      type: 'Run',
      sport_type: 'Run',
      start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      start_date_local: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      distance: 8765,
      moving_time: 2456,
      elapsed_time: 2600,
      total_elevation_gain: 123,
      average_speed: 3.57,
      max_speed: 5.6,
      average_heartrate: 145,
      max_heartrate: 165,
      kudos_count: 15,
      comment_count: 2,
      athlete_count: 1
    }
  ]

  const value = {
    isDemoMode,
    setIsDemoMode,
    demoStep,
    setDemoStep,
    demoUser,
    demoAthlete,
    demoActivities
  }

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  )
}