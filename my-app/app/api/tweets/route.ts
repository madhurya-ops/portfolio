import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Frontend Tweet interface (what your blog page expects)
interface FrontendTweet {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
}

// Database Tweet interface (what comes from Supabase)
interface DatabaseTweet {
  id: string;
  tweet_id: string;
  content: string;
  author_name: string;
  author_username: string;
  author_profile_image?: string;
  created_at: string;
  retweet_count: number;
  like_count: number;
  reply_count: number;
  cached_at: string;
  is_active: boolean;
}

// Transform database tweet to frontend format
function transformDatabaseTweet(dbTweet: DatabaseTweet): FrontendTweet {
  return {
    id: dbTweet.tweet_id,
    user: {
      name: dbTweet.author_name,
      username: dbTweet.author_username,
      avatar: dbTweet.author_profile_image || 'https://pbs.twimg.com/profile_images/1234567890/default_avatar_400x400.png'
    },
    content: dbTweet.content,
    timestamp: formatTimestamp(dbTweet.created_at),
    likes: dbTweet.like_count,
    retweets: dbTweet.retweet_count,
    replies: dbTweet.reply_count
  }
}

function formatTimestamp(createdAt: string): string {
  const now = new Date()
  const tweetDate = new Date(createdAt)
  const diffInHours = Math.floor((now.getTime() - tweetDate.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'now'
  if (diffInHours < 24) return `${diffInHours}h`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d`
}

export async function GET() {
  try {
    console.log('🔍 Fetching tweets from Supabase database only...')
    
    const { data: cachedTweets, error: supabaseError } = await supabase
      .from('tweets')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (supabaseError) {
      console.error('❌ Supabase query error:', supabaseError)
      return NextResponse.json(
        {
          error: 'Database query failed',
          message: 'Unable to fetch tweets from database',
          details: supabaseError.message
        },
        { status: 500 }
      )
    }

    if (!cachedTweets || cachedTweets.length === 0) {
      console.log('⚠️ No tweets found in Supabase database')
      return NextResponse.json(
        {
          error: 'No tweets available',
          message: 'No tweets found in database. Please cache some tweets first.',
          tweets: []
        },
        { status: 404 }
      )
    }

    // Transform database tweets to frontend format
    const tweets = cachedTweets.map(transformDatabaseTweet)
    
    // Check cache freshness
    const newestTweet = cachedTweets[0]
    const cacheAge = Date.now() - new Date(newestTweet.cached_at).getTime()
    const ageMinutes = Math.floor(cacheAge / (1000 * 60))
    
    console.log(`✅ Serving ${tweets.length} tweets from Supabase database`)
    console.log(`📅 Cache age: ${ageMinutes} minutes old`)

    let warning = null
    if (ageMinutes > 60) {
      warning = `Cache is ${ageMinutes} minutes old - consider refreshing tweets`
    }

    return NextResponse.json({
      tweets,
      source: 'supabase-database',
      warning,
      meta: {
        count: tweets.length,
        cacheAge: `${ageMinutes} minutes`,
        lastUpdated: newestTweet.cached_at
      }
    })

  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    
    return NextResponse.json(
      {
        error: 'Server error',
        message: 'An unexpected error occurred while fetching tweets',
        details: error.message
      },
      { status: 500 }
    )
  }
}
