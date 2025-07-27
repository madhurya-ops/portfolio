import { NextResponse } from 'next/server';

// Extended cache duration to reduce API calls
let cache: {
  data: { tweets: Tweet[]; lastUpdated: string };
  timestamp: number;
  rateLimitReset?: number;
} | null = null;

const CACHE_DURATION = 45 * 60 * 1000; // 45 minutes (3x Twitter's window)

// Type definitions
interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}

const TWITTER_API_BASE = 'https://api.twitter.com/2';

// Enhanced rate limiting with Twitter header checking
async function rateLimitedFetch(url: string, options: RequestInit): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    // Check Twitter's rate limit headers
    const remainingRequests = response.headers.get('x-rate-limit-remaining');
    const resetTime = response.headers.get('x-rate-limit-reset');
    
    console.log(`Twitter API - Remaining: ${remainingRequests}, Reset: ${resetTime}`);
    
    if (response.status === 429) {
      const resetTimestamp = resetTime ? parseInt(resetTime) * 1000 : Date.now() + (15 * 60 * 1000);
      const waitTime = resetTimestamp - Date.now() + 5000; // Add 5 seconds buffer
      
      console.log(`Rate limited. Waiting ${Math.ceil(waitTime / 1000)} seconds until reset.`);
      
      // Store the reset time in cache to avoid future requests
      if (cache) {
        cache.rateLimitReset = resetTimestamp;
      }
      
      throw new Error(`Rate limit exceeded. Try again after ${new Date(resetTimestamp).toLocaleTimeString()}`);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Update cache with rate limit info
    if (cache && resetTime) {
      cache.rateLimitReset = parseInt(resetTime) * 1000;
    }
    
    return response;
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('fetch')) {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
}

export async function GET() {
  try {
    // Check if we're still within a rate limit window
    if (cache?.rateLimitReset && Date.now() < cache.rateLimitReset) {
      const waitTime = Math.ceil((cache.rateLimitReset - Date.now()) / 1000);
      console.log(`Still in rate limit window. ${waitTime} seconds remaining.`);
      
      if (cache.data) {
        return NextResponse.json({
          ...cache.data,
          warning: `Using cached data. Rate limit resets in ${waitTime} seconds.`
        });
      }
    }

    // Check cache first - extended duration to reduce API calls
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      console.log('Returning cached data');
      return NextResponse.json(cache.data);
    }

    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!bearerToken) {
      console.error('Twitter Bearer Token not found');
      return NextResponse.json(
        { error: 'Twitter API configuration missing' },
        { status: 500 }
      );
    }

    const username = process.env.TWITTER_USERNAME || 'Chaitanyaaab';

    console.log('Making Twitter API request...');

    // Get user ID with enhanced error handling
    const userResponse = await rateLimitedFetch(
      `${TWITTER_API_BASE}/users/by/username/${username}`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'User-Agent': 'TwitterBot/1.0',
        },
      }
    );

    const userData = await userResponse.json();
    
    if (!userData.data?.id) {
      throw new Error(`User ${username} not found or invalid response`);
    }
    
    const userId = userData.data.id;

    // Fetch tweets with enhanced error handling
    const tweetsResponse = await rateLimitedFetch(
      `${TWITTER_API_BASE}/users/${userId}/tweets?max_results=8&tweet.fields=created_at,public_metrics,author_id&expansions=author_id&user.fields=name,username,profile_image_url`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'User-Agent': 'TwitterBot/1.0',
        },
      }
    );

    const tweetsData = await tweetsResponse.json();

    if (!tweetsData.data || !Array.isArray(tweetsData.data)) {
      throw new Error('No tweets found or invalid response structure');
    }

    // Format the data
    const formattedTweets = tweetsData.data.map((tweet: Tweet) => {
      const author = tweetsData.includes?.users?.find((user: TwitterUser) => user.id === tweet.author_id);
      
      return {
        id: tweet.id,
        user: {
          name: author?.name || 'Unknown',
          username: author?.username || 'unknown',
          avatar: author?.profile_image_url || '/placeholder.svg?height=40&width=40'
        },
        content: tweet.text,
        timestamp: formatTimestamp(tweet.created_at),
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        replies: tweet.public_metrics?.reply_count || 0,
      };
    });

    const result = { 
      tweets: formattedTweets,
      lastUpdated: new Date().toISOString()
    };
    
    // Cache the result with extended duration
    cache = {
      data: result,
      timestamp: Date.now(),
      rateLimitReset: undefined // Reset this on successful fetch
    };

    console.log(`Successfully fetched ${formattedTweets.length} tweets`);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching tweets:', error);
    
    // Return cached data if available, regardless of age
    if (cache?.data) {
      console.log('Returning cached data due to error');
      return NextResponse.json({
        ...cache.data,
        warning: 'Using cached data due to API error: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
    }
    
    // Return structured error response
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch tweets',
        tweets: [],
        suggestion: 'Try again later. Twitter API has strict rate limits.'
      },
      { status: 503 } // Service Unavailable instead of 500
    );
  }
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d`;
  } else if (diffHours > 0) {
    return `${diffHours}h`;
  } else if (diffMins > 0) {
    return `${diffMins}m`;
  } else {
    return 'now';
  }
}
