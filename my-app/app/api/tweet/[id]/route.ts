import { NextResponse } from 'next/server';

const mockTweets = [
  {
    id: '1',
    user: {
      name: 'Madhurya Mishra',
      username: 'with_maddy_',
      avatar: '/avatar1.png',
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
      avatar: '/avatar2.png',
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
      avatar: '/avatar3.png',
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
      avatar: '/avatar4.png',
    },
    content: 'Just discovered some amazing React patterns. Sharing a blog post soon! ⚛️',
    timestamp: '2d',
    likes: 89,
    retweets: 12,
    replies: 7,
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tweet = mockTweets.find(t => t.id === id);
    
    if (!tweet) {
      return NextResponse.json(
        { error: 'Tweet not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(tweet);
  } catch (error) {
    console.error('Error fetching tweet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tweet' },
      { status: 500 }
    );
  }
}
