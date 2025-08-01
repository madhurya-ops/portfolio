// Database tweet structure (from Supabase)
export interface Tweet {
    id: string
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

export interface DatabaseTweet {
    id: string
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
  
  // Frontend tweet structure (what your blog page expects)
  export interface FrontendTweet {
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
  