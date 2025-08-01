# Twitter API Setup Guide

To fetch real tweets with avatar images from Twitter, you need to set up Twitter API credentials.

## Step 1: Get Twitter API Access

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Sign in with your Twitter account
3. Apply for a developer account if you haven't already
4. Create a new app/project
5. Generate a Bearer Token

## Step 2: Configure Environment Variables

Create a `.env.local` file in your `my-app` directory with:

```env
# Twitter API v2 Credentials
TWITTER_BEARER_TOKEN=your_actual_bearer_token_here
```

## Step 3: Test the Integration

1. Restart your development server
2. Visit your blog page
3. Check the browser console for any warnings
4. The avatars should now load from real Twitter profile images

## Fallback Behavior

If the Twitter API is not configured or fails:
- The app will use fallback data with placeholder avatar URLs
- You'll see a warning message in the console
- The app will continue to work normally

## Troubleshooting

### Common Issues:

1. **"Twitter Bearer Token not configured"**
   - Make sure you've created the `.env.local` file
   - Restart your development server after adding the token

2. **"Twitter API error: 401"**
   - Your Bearer Token is invalid or expired
   - Generate a new token from the Twitter Developer Portal

3. **"Twitter API error: 429"**
   - You've hit the rate limit
   - Wait a few minutes and try again

4. **Avatar images still not loading**
   - Check the browser's Network tab to see if the image URLs are being fetched
   - The fallback URLs should work even without Twitter API

## Customization

You can modify the search query in `app/api/tweets/route.ts`:

```typescript
// Change this line to search for different tweets
const response = await fetch(
  `${TWITTER_API_BASE}/tweets/search/recent?query=YOUR_SEARCH_QUERY&max_results=10&...`
);
```

## Security Notes

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore`
- Keep your Bearer Token secure and don't share it publicly 