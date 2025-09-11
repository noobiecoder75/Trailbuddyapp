// Activity Level Matching Algorithm
// Matches users based on their fitness activities, preferences, and compatibility

import { supabase } from './supabase'

export class ActivityMatcher {
  constructor() {
    this.weightings = {
      activityLevel: 0.35,      // Activity level compatibility (35%)
      activityTypes: 0.25,      // Shared activity preferences (25%)
      schedule: 0.20,           // Schedule compatibility (20%)
      fitnessLevel: 0.15,       // Fitness level similarity (15%)
      location: 0.05            // Geographic proximity (5%)
    }
  }

  /**
   * Find compatible workout partners for a user
   * @param {string} userId - The user to find matches for
   * @param {Object} options - Matching options
   * @returns {Array} Array of compatible users with compatibility scores
   */
  async findMatches(userId, options = {}) {
    const {
      maxResults = 20,
      minCompatibilityScore = 0.3,
      excludeUserIds = [],
      preferredActivityTypes = null,
      maxDistance = null
    } = options

    try {
      // Get the target user's activity metrics
      const targetUser = await this.getUserActivityMetrics(userId)
      if (!targetUser) {
        throw new Error('User activity metrics not found')
      }

      // Get all potential matches
      const potentialMatches = await this.getPotentialMatches(
        userId, 
        excludeUserIds, 
        maxDistance
      )

      // Calculate compatibility scores for each potential match
      const scoredMatches = []
      
      for (const match of potentialMatches) {
        const compatibility = this.calculateCompatibility(targetUser, match)
        
        if (compatibility.overallScore >= minCompatibilityScore) {
          scoredMatches.push({
            ...match,
            compatibility
          })
        }
      }

      // Sort by compatibility score (descending)
      scoredMatches.sort((a, b) => b.compatibility.overallScore - a.compatibility.overallScore)

      // Filter by activity type preference if specified
      let filteredMatches = scoredMatches
      if (preferredActivityTypes && preferredActivityTypes.length > 0) {
        filteredMatches = scoredMatches.filter(match => {
          const hasSharedActivity = match.preferred_activity_types?.some(type =>
            preferredActivityTypes.includes(type)
          )
          return hasSharedActivity || match.compatibility.activityTypeScore > 0.5
        })
      }

      return filteredMatches.slice(0, maxResults)
    } catch (error) {
      console.error('Error finding matches:', error)
      throw error
    }
  }

  /**
   * Get user's activity metrics from database
   */
  async getUserActivityMetrics(userId) {
    const { data, error } = await supabase
      .from('user_activity_metrics')
      .select(`
        *,
        user_profiles!inner(id, display_name, avatar_url),
        user_health_connections!inner(provider_type, is_active)
      `)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // No metrics found
      }
      throw error
    }

    return data
  }

  /**
   * Get potential matches from database
   */
  async getPotentialMatches(userId, excludeUserIds = [], maxDistance = null) {
    let query = supabase
      .from('user_activity_metrics')
      .select(`
        *,
        user_profiles!inner(id, display_name, avatar_url, created_at),
        user_health_connections!inner(provider_type, is_active)
      `)
      .neq('user_id', userId)
      .not('user_id', 'in', `(${excludeUserIds.join(',')})`)
      .gt('last_calculated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Active in last 30 days

    // Add distance filtering if specified (would require location data)
    if (maxDistance) {
      // This would require PostGIS extension and location data
      // For now, we'll skip location-based filtering
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data || []
  }

  /**
   * Calculate overall compatibility between two users
   */
  calculateCompatibility(user1, user2) {
    const activityLevelScore = this.calculateActivityLevelCompatibility(user1, user2)
    const activityTypeScore = this.calculateActivityTypeCompatibility(user1, user2)
    const scheduleScore = this.calculateScheduleCompatibility(user1, user2)
    const fitnessLevelScore = this.calculateFitnessLevelCompatibility(user1, user2)
    const locationScore = 1.0 // Default until location data is available

    const overallScore = (
      activityLevelScore * this.weightings.activityLevel +
      activityTypeScore * this.weightings.activityTypes +
      scheduleScore * this.weightings.schedule +
      fitnessLevelScore * this.weightings.fitnessLevel +
      locationScore * this.weightings.location
    )

    return {
      overallScore: Math.round(overallScore * 100) / 100,
      breakdown: {
        activityLevelScore,
        activityTypeScore,
        scheduleScore,
        fitnessLevelScore,
        locationScore
      },
      explanation: this.generateCompatibilityExplanation({
        activityLevelScore,
        activityTypeScore,
        scheduleScore,
        fitnessLevelScore
      })
    }
  }

  /**
   * Calculate activity level compatibility (0-1 score)
   * Users with similar activity levels are more compatible
   */
  calculateActivityLevelCompatibility(user1, user2) {
    const score1 = user1.activity_level_score || 0
    const score2 = user2.activity_level_score || 0
    
    // Calculate similarity (closer scores = higher compatibility)
    const scoreDifference = Math.abs(score1 - score2)
    const maxDifference = 100 // Maximum possible difference
    
    // Convert difference to similarity (0-1 scale)
    const similarity = 1 - (scoreDifference / maxDifference)
    
    // Apply curve to favor closer matches
    return Math.pow(similarity, 0.5)
  }

  /**
   * Calculate activity type compatibility
   * Higher score for users who share similar activity interests
   */
  calculateActivityTypeCompatibility(user1, user2) {
    const types1 = new Set(user1.preferred_activity_types || [])
    const types2 = new Set(user2.preferred_activity_types || [])
    
    if (types1.size === 0 || types2.size === 0) {
      return 0.5 // Neutral score if no data
    }
    
    // Calculate Jaccard similarity
    const intersection = new Set([...types1].filter(x => types2.has(x)))
    const union = new Set([...types1, ...types2])
    
    const jaccardSimilarity = intersection.size / union.size
    
    // Weight common outdoor activities higher
    const outdoorActivities = ['running', 'cycling', 'hiking', 'walking', 'climbing']
    const outdoorIntersection = [...intersection].filter(type => 
      outdoorActivities.includes(type.toLowerCase())
    ).length
    
    const outdoorBonus = outdoorIntersection > 0 ? 0.2 : 0
    
    return Math.min(1.0, jaccardSimilarity + outdoorBonus)
  }

  /**
   * Calculate schedule compatibility
   * Users who work out at similar times are more compatible
   */
  calculateScheduleCompatibility(user1, user2) {
    const times1 = user1.preferred_workout_times || []
    const times2 = user2.preferred_workout_times || []
    
    if (times1.length === 0 || times2.length === 0) {
      return 0.6 // Slightly positive default
    }
    
    // Group hours into time blocks
    const getTimeBlock = (hour) => {
      if (hour >= 5 && hour < 10) return 'early_morning'
      if (hour >= 10 && hour < 14) return 'late_morning'
      if (hour >= 14 && hour < 18) return 'afternoon'
      if (hour >= 18 && hour < 22) return 'evening'
      return 'night'
    }
    
    const blocks1 = new Set(times1.map(getTimeBlock))
    const blocks2 = new Set(times2.map(getTimeBlock))
    
    // Calculate overlap
    const intersection = new Set([...blocks1].filter(x => blocks2.has(x)))
    const union = new Set([...blocks1, ...blocks2])
    
    return intersection.size / union.size
  }

  /**
   * Calculate fitness level compatibility
   * Users at similar fitness levels train better together
   */
  calculateFitnessLevelCompatibility(user1, user2) {
    const levels = ['beginner', 'intermediate', 'advanced', 'elite']
    const level1 = user1.fitness_level || 'intermediate'
    const level2 = user2.fitness_level || 'intermediate'
    
    const index1 = levels.indexOf(level1)
    const index2 = levels.indexOf(level2)
    
    if (index1 === -1 || index2 === -1) {
      return 0.5 // Default if levels unknown
    }
    
    const levelDifference = Math.abs(index1 - index2)
    const maxDifference = levels.length - 1
    
    return 1 - (levelDifference / maxDifference)
  }

  /**
   * Generate human-readable compatibility explanation
   */
  generateCompatibilityExplanation(scores) {
    const explanations = []
    
    if (scores.activityLevelScore > 0.8) {
      explanations.push("Very similar activity levels")
    } else if (scores.activityLevelScore > 0.6) {
      explanations.push("Compatible activity levels")
    } else if (scores.activityLevelScore < 0.4) {
      explanations.push("Different activity levels")
    }
    
    if (scores.activityTypeScore > 0.7) {
      explanations.push("Shared activity interests")
    } else if (scores.activityTypeScore > 0.5) {
      explanations.push("Some common activities")
    }
    
    if (scores.scheduleScore > 0.7) {
      explanations.push("Similar workout schedules")
    } else if (scores.scheduleScore > 0.5) {
      explanations.push("Some schedule overlap")
    }
    
    if (scores.fitnessLevelScore > 0.8) {
      explanations.push("Similar fitness levels")
    }
    
    return explanations.length > 0 ? explanations.join(", ") : "Basic compatibility"
  }

  /**
   * Get activity level category from score
   */
  getActivityLevelCategory(score) {
    if (score >= 80) return 'Very Active'
    if (score >= 60) return 'Active'
    if (score >= 40) return 'Moderate'
    if (score >= 20) return 'Light'
    return 'Sedentary'
  }

  /**
   * Update user's activity metrics (triggers recalculation)
   */
  async updateUserMetrics(userId) {
    try {
      const { error } = await supabase.rpc('update_user_activity_metrics', {
        user_uuid: userId
      })
      
      if (error) throw error
      
      return true
    } catch (error) {
      console.error('Error updating user metrics:', error)
      throw error
    }
  }

  /**
   * Get matching statistics for debugging
   */
  async getMatchingStats() {
    const { data, error } = await supabase
      .from('user_activity_metrics')
      .select('activity_level_score, fitness_level, preferred_activity_types')
      .not('activity_level_score', 'is', null)

    if (error) {
      throw error
    }

    const stats = {
      totalUsers: data.length,
      activityLevelDistribution: {},
      fitnessLevelDistribution: {},
      popularActivities: {}
    }

    data.forEach(user => {
      // Activity level distribution
      const category = this.getActivityLevelCategory(user.activity_level_score)
      stats.activityLevelDistribution[category] = 
        (stats.activityLevelDistribution[category] || 0) + 1

      // Fitness level distribution
      const fitness = user.fitness_level || 'unknown'
      stats.fitnessLevelDistribution[fitness] = 
        (stats.fitnessLevelDistribution[fitness] || 0) + 1

      // Popular activities
      if (user.preferred_activity_types) {
        user.preferred_activity_types.forEach(activity => {
          stats.popularActivities[activity] = 
            (stats.popularActivities[activity] || 0) + 1
        })
      }
    })

    return stats
  }
}

// Export singleton instance
export const activityMatcher = new ActivityMatcher()

// Export utility functions
export const getActivityLevelCategory = (score) => {
  return activityMatcher.getActivityLevelCategory(score)
}

export const findCompatibleUsers = (userId, options) => {
  return activityMatcher.findMatches(userId, options)
}

export const calculateUserCompatibility = (user1, user2) => {
  return activityMatcher.calculateCompatibility(user1, user2)
}