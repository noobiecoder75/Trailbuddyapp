  useEffect(() => {
    // Check for demo mode first - bypass Supabase entirely
    const urlParams = new URLSearchParams(window.location.search)
    const isDemoFromUrl = urlParams.get('demo') === 'true'
    
    if (isDemoMode || isDemoFromUrl) {
      setUser(demoUser)
      setLoading(false)
      return
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