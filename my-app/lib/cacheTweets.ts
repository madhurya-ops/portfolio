import { supabaseAdmin } from './supabase'
import type { Tweet } from '@/types/tweet'

export async function cacheTweetsToSupabase(tweets: Tweet[]): Promise<void> {
  // Upsert tweets by tweet_id
  const { error } = await supabaseAdmin
    .from('tweets')
    .upsert(
      tweets.map(tweet => ({
        tweet_id: tweet.tweet_id,
        content: tweet.content,
        author_name: tweet.author_name,
        author_username: tweet.author_username,
        author_profile_image: tweet.author_profile_image,
        created_at: tweet.created_at,
        media_urls: tweet.media_urls || [],
        retweet_count: tweet.retweet_count,
        like_count: tweet.like_count,
        reply_count: tweet.reply_count,
        cached_at: new Date().toISOString(),
        is_active: true
      })),
      { onConflict: 'tweet_id' }
    )

  if (error) throw error

  // Deactivate all except latest 8 tweets
  const { data: keep } = await supabaseAdmin
    .from('tweets')
    .select('id')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8)
  if (keep && keep.length > 0) {
    const keepIds = keep.map((t: { id: string }) => t.id)
    await supabaseAdmin
      .from('tweets')
      .update({ is_active: false })
      .not('id', 'in', keepIds)
      .eq('is_active', true)
  }
}