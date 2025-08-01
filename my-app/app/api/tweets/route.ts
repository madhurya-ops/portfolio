import { NextResponse } from 'next/server';

// Twitter API v2 configuration
const TWITTER_API_BASE = 'https://api.twitter.com/2';
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// Fallback mock data in case Twitter API is not configured
const fallbackTweets = [
  {
    id: '1',
    user: {
      name: 'Madhurya Mishra',
      username: 'with_maddy_',
      avatar: 'https://pbs.twimg.com/profile_images/1234567890/default_avatar_400x400.png',
    },
    content: 'Just built an amazing portfolio site with Next.js and TypeScript! 🚀',
    timestamp: '2h',
    likes: 42,
    retweets: 8,
    replies: 3,
  },
  {
    id: '2',
    user: {
      name: 'Tech Enthusiast',
      username: 'techie_dev',
      avatar: 'https://pbs.twimg.com/profile_images/1234567891/tech_avatar_400x400.png',
    },
    content: 'Working on some exciting AI projects with LLMs and RAG systems. The future is here! 🤖',
    timestamp: '5h',
    likes: 128,
    retweets: 24,
    replies: 15,
  },
  {
    id: '3',
    user: {
      name: 'Code Master',
      username: 'codemaster',
      avatar: 'https://pbs.twimg.com/profile_images/1234567892/code_avatar_400x400.png',
    },
    content: 'Pro tip: Always write clean, maintainable code. Your future self will thank you! 💻',
    timestamp: '1d',
    likes: 256,
    retweets: 64,
    replies: 32,
  },
  {
    id: '4',
    user: {
      name: 'Web Dev',
      username: 'webdev_pro',
      avatar: 'https://pbs.twimg.com/profile_images/1234567893/web_avatar_400x400.png',
    },
    content: 'Just discovered some amazing React patterns. Sharing a blog post soon! ⚛️',
    timestamp: '2d',
    likes: 89,
    retweets: 12,
    replies: 7,
  },
];

async function fetchTweetsFromTwitter() {
  if (!TWITTER_BEARER_TOKEN) {
    throw new Error('Twitter Bearer Token not configured');
  }

  try {
    // Fetch tweets from a specific user or search query
    // You can modify this URL to fetch from specific users or search terms
    const response = await fetch(
      `${TWITTER_API_BASE}/tweets/search/recent?query=portfolio%20nextjs%20typescript&max_results=10&tweet.fields=created_at,public_metrics&user.fields=profile_image_url,name,username&expansions=author_id`,
      {
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform Twitter API response to match our expected format
    const tweets = data.data?.map((tweet: any) => {
      const user = data.includes?.users?.find((u: any) => u.id === tweet.author_id);
      return {
        id: tweet.id,
        user: {
          name: user?.name || 'Unknown User',
          username: user?.username || 'unknown',
          avatar: user?.profile_image_url || 'https://pbs.twimg.com/profile_images/1234567890/default_avatar_400x400.png',
        },
        content: tweet.text,
        timestamp: formatTimestamp(tweet.created_at),
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        replies: tweet.public_metrics?.reply_count || 0,
      };
    }) || [];

    return tweets;
  } catch (error) {
    console.error('Error fetching from Twitter API:', error);
    throw error;
  }
}

function formatTimestamp(createdAt: string): string {
  const now = new Date();
  const tweetDate = new Date(createdAt);
  const diffInHours = Math.floor((now.getTime() - tweetDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'now';
  if (diffInHours < 24) return `${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
}

export async function GET() {
  try {
    let tweets;
    let warning = null;

    // Try to fetch from Twitter API if configured
    if (TWITTER_BEARER_TOKEN) {
      try {
        tweets = await fetchTweetsFromTwitter();
      } catch (error) {
        console.warn('Twitter API failed, using fallback data:', error);
        tweets = fallbackTweets;
        warning = 'Twitter API failed, showing fallback data. Check your API credentials.';
      }
    } else {
      // Use fallback data if no Twitter API token is configured
      tweets = fallbackTweets;
      warning = 'Twitter API not configured. Set TWITTER_BEARER_TOKEN environment variable to fetch real tweets.';
    }

    return NextResponse.json({ 
      tweets,
      warning
    });
  } catch (error) {
    console.error('Error in tweets API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch tweets',
        tweets: fallbackTweets,
        warning: 'Using fallback data due to error.'
      },
      { status: 500 }
    );
  }
}
