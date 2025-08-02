import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Twitter API v2 configuration
const TWITTER_API_BASE = 'https://api.twitter.com/2'
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  public_metrics?: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
  };
}

interface TwitterApiResponse {
  data: TwitterTweet[];
  includes?: {
    users: TwitterUser[];
  };
}

interface DatabaseTweet {
  tweet_id: string
  content: string
  author_name: string
  author_username: string
  author_profile_image?: string
  created_at: string
  media_urls?: string[]
  retweet_count: number
  like_count: number
  reply_count: number
  cached_at: string
  is_active: boolean
}

async function fetchTweetsFromTwitter(): Promise<DatabaseTweet[]> {
  if (!TWITTER_BEARER_TOKEN) {
    throw new Error('Twitter Bearer Token not configured')
  }

  try {
    const response = await fetch(
      `${TWITTER_API_BASE}/users/by/username/chaitanyaaab?user.fields=profile_image_url`,
      {
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to get user ID: ${response.status}`)
    }

    const userData = await response.json()
    const userId = userData.data.id

    // Fetch user's tweets
    const tweetsResponse = await fetch(
      `${TWITTER_API_BASE}/users/${userId}/tweets?max_results=10&tweet.fields=created_at,public_metrics&user.fields=profile_image_url,name,username&expansions=author_id`,
      {
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!tweetsResponse.ok) {
      throw new Error(`Twitter API error: ${tweetsResponse.status} ${tweetsResponse.statusText}`)
    }

    const data = await tweetsResponse.json()
    
    // Transform Twitter API response
    const tweets: DatabaseTweet[] = data.data?.map((tweet: TwitterTweet) => {
      const user = data.includes?.users?.find((u: TwitterUser) => u.id === tweet.author_id)
    
      return {
        tweet_id: tweet.id,
        content: tweet.text,
        author_name: user?.name || 'Chaitanya',
        author_username: user?.username || 'chaitanyaaab',
        author_profile_image: user?.profile_image_url || 'https://pbs.twimg.com/profile_images/1949541767751008256/FlKvG0eW_400x400.jpg',
        created_at: tweet.created_at,
        media_urls: [],
        retweet_count: tweet.public_metrics?.retweet_count || 0,
        like_count: tweet.public_metrics?.like_count || 0,
        reply_count: tweet.public_metrics?.reply_count || 0,
        cached_at: new Date().toISOString(),
        is_active: true
      }
    }) || []

    return tweets
  } catch (error) {
    console.error('Error fetching from Twitter API:', error)
    throw error
  }
}

async function cacheTweetsToSupabase(tweets: DatabaseTweet[]): Promise<void> {
  console.log('🔄 Starting cache process...')
  console.log(`📥 Received ${tweets.length} tweets from Twitter API`)
  
  // Log first tweet for verification
  if (tweets.length > 0) {
    console.log('📝 Sample tweet:', {
      id: tweets[0].tweet_id,
      content: tweets[0].content.substring(0, 50) + '...',
      author: tweets[0].author_username
    })
  }

  const { data, error } = await supabaseAdmin
    .from('tweets')
    .upsert(tweets, { 
      onConflict: 'tweet_id',
      ignoreDuplicates: false 
    })
    .select()

  if (error) {
    console.error('❌ Supabase upsert failed:', error)
    throw error
  }

  console.log(`✅ Successfully upserted ${data?.length || 0} tweets to Supabase`)

  // Keep only latest 8 tweets active
  const { data: keep } = await supabaseAdmin
    .from('tweets')
    .select('id')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8)
    
  if (keep && keep.length > 0) {
    const keepIds = keep.map((t: { id: string }) => t.id)
    const { error: deactivateError } = await supabaseAdmin
      .from('tweets')
      .update({ is_active: false })
      .not('id', 'in', keepIds)
      .eq('is_active', true)
      
    if (deactivateError) {
      console.error('⚠️ Failed to deactivate old tweets:', deactivateError)
    } else {
      console.log('🧹 Deactivated old tweets, keeping latest 8')
    }
  }
}

export async function POST() {
  try {
    console.log('🚀 Starting tweet caching process...')
    
    const tweets = await fetchTweetsFromTwitter()
    
    if (tweets.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No tweets found from @chaitanyaaab' },
        { status: 404 }
      )
    }
    
    await cacheTweetsToSupabase(tweets)
    
    return NextResponse.json({ 
      success: true, 
      cached: tweets.length,
      message: `Successfully cached ${tweets.length} tweets from @chaitanyaaab`
    })
  } catch (error: unknown) {
    console.error('❌ Cache process failed:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}