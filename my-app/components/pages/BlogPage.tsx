"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { HomeDock } from "@/components/AppBar";
import  {TweetSkeleton}  from "@/components/magicui/TweetCard";
import Image from "next/image";

// Type definition matching your API response
interface Tweet {
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

/**
 * Picture Card Component - Landscape oriented cards
 */
function PictureCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] bg-white/5 backdrop-blur-md border border-neutral-800 z-30">
      <div 
        className="relative w-full"
        style={{ aspectRatio: '16/9' }} // Landscape aspect ratio
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

/**
 * Picture Cards Row Component - 2 cards side by side extending to page edges
 */
function PictureCardsRow({ images }: { images: Array<{ src: string; alt: string }> }) {
  return (
    <div className="w-full px-2 mb-6 relative z-30"> {/* Minimal padding to prevent cards from touching screen edges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-30"> {/* Reduced gap for more space usage */}
        {images.map((image, index) => (
          <PictureCard 
            key={index}
            src={image.src}
            alt={image.alt}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Simple Tweet Card Component - Creates a visual tweet card from your data
 */
function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <div className="w-80 flex-shrink-0 mx-2">
      <div className="relative flex size-full max-w-lg flex-col gap-3 overflow-hidden rounded-lg border border-neutral-800 p-4 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-colors duration-200 h-full">
        {/* Header */}
        <div className="flex flex-row justify-between tracking-tight">
          <div className="flex items-center space-x-3">
            <img
              src={tweet.user.avatar}
              alt={`${tweet.user.username} profile picture`}
              height={40}
              width={40}
              className="overflow-hidden rounded-full border border-transparent"
            />
            <div>
              <div className="flex items-center whitespace-nowrap font-semibold text-white">
                {tweet.user.name}
              </div>
              <div className="text-sm text-gray-400">
                @{tweet.user.username} · {tweet.timestamp}
              </div>
            </div>
          </div>
          {/* Updated X Icon using the SVG file from public directory */}
          <img
            src="/x.svg"
            alt="X (Twitter) Icon"
            height="20"
            width="20"
            className="size-5 text-white transition-all ease-in-out hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="break-words leading-normal tracking-tighter text-white text-sm">
          {tweet.content}
        </div>

        {/* Metrics */}
        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-auto">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>{tweet.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>{tweet.retweets}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span>{tweet.replies}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Fixed Animated Row Component - Addresses lower row animation issues
 */
function AnimatedRow({
  tweets,
  direction,
  speed = 50,
  rowIndex = 0,
}: { 
  tweets: Tweet[]; 
  direction: "left" | "right"; 
  speed?: number;
  rowIndex?: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Simplified animation function
  const animate = useCallback(() => {
    const row = rowRef.current;
    if (!row || isPaused || !isReady) return;

    const scrollWidth = row.scrollWidth;
    const clientWidth = row.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    // Skip if not scrollable
    if (maxScroll <= 0) return;

    if (direction === "left") {
      if (row.scrollLeft >= maxScroll) {
        row.scrollLeft = 0;
      } else {
        row.scrollLeft += 1;
      }
    } else {
      if (row.scrollLeft <= 0) {
        row.scrollLeft = maxScroll;
      } else {
        row.scrollLeft -= 1;
      }
    }

    // Schedule next animation frame
    timeoutRef.current = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, speed);
  }, [direction, speed, isPaused, isReady]);

  // Initialize the row
  useEffect(() => {
    const initializeRow = () => {
      const row = rowRef.current;
      if (!row) return;

      // Wait for content to load
      const checkContent = () => {
        const scrollWidth = row.scrollWidth;
        const clientWidth = row.clientWidth;
        
        if (scrollWidth > clientWidth) {
          // Set initial position for right-scrolling rows
          if (direction === "right") {
            row.scrollLeft = scrollWidth - clientWidth;
          } else {
            row.scrollLeft = 0;
          }
          setIsReady(true);
        } else {
          // Retry if content hasn't loaded yet
          setTimeout(checkContent, 100);
        }
      };

      // Delay initialization for lower rows
      setTimeout(checkContent, rowIndex * 200);
    };

    initializeRow();
  }, [direction, rowIndex]);

  // Start animation when ready
  useEffect(() => {
    if (isReady && !isPaused) {
      // Clear any existing animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Start animation with a small delay
      setTimeout(() => {
        if (isReady && !isPaused) {
          animate();
        }
      }, 100);
    }

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [animate, isReady, isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div className="mb-6">
      <div
        ref={rowRef}
        className="flex overflow-x-hidden py-2"
        style={{ 
          scrollbarWidth: "none", 
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch"
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <div className="flex">
          {/* Ensure enough content for seamless scrolling */}
          {[...tweets, ...tweets, ...tweets, ...tweets, ...tweets].map((tweet, index) => (
            <TweetCard key={`${tweet.id}-${index}-row${rowIndex}`} tweet={tweet} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Main Blog Page Component
 */
export default function BlogPage() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Picture data - you can customize these images
  const pictureData = [
    { src: "/blog1.png", alt: "Gallery image 1" },
    { src: "/blog2.png", alt: "Gallery image 2" },
    { src: "/blog3.png", alt: "Gallery image 3" },
    { src: "/blog4.png", alt: "Gallery image 4" },
  ];

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/tweets');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.tweets && Array.isArray(data.tweets)) {
          setTweets(data.tweets);
          
          if (data.warning) {
            console.warn('API Warning:', data.warning);
          }
        } else {
          throw new Error('Invalid tweet data format');
        }
      } catch (error) {
        console.error('Failed to fetch tweets:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch tweets');
        setTweets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  const tweetRows = useMemo(() => {
    if (tweets.length === 0) return [];

    const minTweetsPerRow = 3;
    let allTweets = [...tweets];
    
    // Ensure we have enough tweets for smooth scrolling
    while (allTweets.length < minTweetsPerRow * 2) {
      allTweets = [...allTweets, ...tweets];
    }

    // Split into two equal rows
    const midPoint = Math.ceil(allTweets.length / 2);
    
    return [
      allTweets.slice(0, midPoint),
      allTweets.slice(midPoint)
    ].filter(row => row.length > 0);
  }, [tweets]);

  const LandingOverlay = () => (
    <div className="absolute inset-0 w-full h-full bg-neutral-950 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
        <LandingOverlay />
        <HomeDock />
        <div className="w-full relative z-10">
          {/* Loading state with picture card skeletons - edge to edge */}
          <div className="w-full px-2 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1].map((index) => (
                <div key={index} className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-md border border-neutral-800">
                  <div style={{ aspectRatio: '16/9' }}>
                    <TweetSkeleton className="h-full w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-0">
            {[0, 1].map((index) => (
              <div key={index} className="flex overflow-x-hidden py-2 mb-6">
                <div className="flex">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-80 flex-shrink-0 mx-2">
                      <TweetSkeleton className="h-full w-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
        <LandingOverlay />
        <HomeDock />
        <div className="w-full max-w-9xl px-4 relative z-10 text-center">
          <div className="text-white">
            <h2 className="text-xl font-semibold mb-2">Failed to load tweets</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <HomeDock />
      
      {/* Picture cards outside the overlay container */}
      <div className="w-full relative z-30 pt-6">
        {/* First row of picture cards (top of page) - edge to edge */}
        <PictureCardsRow images={pictureData.slice(0, 2)} />
      </div>
      
      {/* Overlay and main content container */}
      <div className="relative">
        <LandingOverlay />
        
        <div className="w-full relative z-10">
          {/* First animated tweet row */}
          {tweetRows[0] && (
            <AnimatedRow
              tweets={tweetRows[0]}
              direction="left"
              speed={25}
              rowIndex={0}
            />
          )}
          
          {/* Second row of picture cards (middle) - outside overlay again */}
        </div>
      </div>
      
      {/* Second picture cards row */}
      <div className="w-full relative z-30">
        <PictureCardsRow images={pictureData.slice(2, 4)} />
      </div>
      
      {/* Final tweet row with overlay */}
      <div className="relative">
        <LandingOverlay />
        <div className="w-full relative z-10">
          {tweetRows[1] && (
            <AnimatedRow
              tweets={tweetRows[1]}
              direction="right"
              speed={25}
              rowIndex={1}
            />
          )}
        </div>
      </div>
    </div>
  );
  
}