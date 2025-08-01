"use client"

import { useEffect, useRef, useState, useCallback, useMemo, memo } from "react"
import { HomeDock } from "@/components/AppBar";
import { TweetSkeleton } from "@/components/magicui/TweetCard";
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

// Ultra-optimized Picture Card with aggressive memoization
const PictureCard = memo(({ src, alt }: { src: string; alt: string }) => (
  <div className="relative overflow-hidden rounded-2xl transition-all duration-500 ease-out hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] z-30 group">
    <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        priority={false}
        loading="lazy"
        quality={80}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  </div>
));
PictureCard.displayName = 'PictureCard';

// Ultra-fast Picture Cards Row
const PictureCardsRow = memo(({ images }: { images: Array<{ src: string; alt: string }> }) => (
  <div className="w-full px-3 mb-8 relative z-30">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-30">
      {images.map((image, index) => (
        <PictureCard 
          key={`${image.src}-${index}`}
          src={image.src}
          alt={image.alt}
        />
      ))}
    </div>
  </div>
));
PictureCardsRow.displayName = 'PictureCardsRow';

// Hyper-optimized Tweet Card with micro-interactions
const TweetCard = memo(({ tweet }: { tweet: Tweet }) => (
  <div className="w-80 flex-shrink-0 mx-3">
    <div className="relative flex size-full max-w-lg flex-col gap-4 overflow-hidden rounded-2xl border border-white/[0.08] p-5 backdrop-blur-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 ease-out h-full group hover:border-white/[0.12] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
      {/* Header with improved spacing */}
      <div className="flex flex-row justify-between tracking-tight">
        <div className="flex items-center space-x-3">
          <img
            src={tweet.user.avatar}
            alt={`${tweet.user.username} profile`}
            height={40}
            width={40}
            className="overflow-hidden rounded-full border border-white/[0.1] transition-all duration-300 group-hover:border-white/[0.2]"
            loading="lazy"
          />
          <div>
            <div className="flex items-center whitespace-nowrap font-medium text-white/90 group-hover:text-white transition-colors duration-300">
              {tweet.user.name}
            </div>
            <div className="text-sm text-white/50 group-hover:text-white/60 transition-colors duration-300">
              @{tweet.user.username} · {tweet.timestamp}
            </div>
          </div>
        </div>
        <svg
          width="18"
          height="18" 
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-[18px] text-white/60 transition-all duration-300 ease-out group-hover:text-white/80 hover:scale-110"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>

      {/* Enhanced content typography */}
      <div className="break-words leading-relaxed tracking-tight text-white/80 text-sm group-hover:text-white/90 transition-colors duration-300">
        {tweet.content}
      </div>

      {/* Cleaner metrics with micro-interactions */}
      <div className="flex items-center space-x-6 text-sm text-white/40 mt-auto">
        <div className="flex items-center space-x-2 hover:text-white/60 transition-colors duration-200 cursor-pointer">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{tweet.likes}</span>
        </div>
        <div className="flex items-center space-x-2 hover:text-white/60 transition-colors duration-200 cursor-pointer">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{tweet.retweets}</span>
        </div>
        <div className="flex items-center space-x-2 hover:text-white/60 transition-colors duration-200 cursor-pointer">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{tweet.replies}</span>
        </div>
      </div>
    </div>
  </div>
));
TweetCard.displayName = 'TweetCard';

// Ultra-high performance animation with RAF optimization
const AnimatedRow = memo(({
  tweets,
  direction,
  speed = 30,
  rowIndex = 0,
}: { 
  tweets: Tweet[]; 
  direction: "left" | "right"; 
  speed?: number;
  rowIndex?: number;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState(() => direction === "right" ? -320 : 0);

  // Hyper-optimized animation with consistent 60fps
  const animate = useCallback(() => {
    if (isPaused) return;
    
    setPosition(prev => {
      const increment = direction === "left" ? 0.3 : -0.3; // Slower, smoother
      const newPos = prev + increment;
      
      // Reset position for seamless loop
      const resetThreshold = 344; // Card width + margin
      if (direction === "left" && newPos > resetThreshold) {
        return -resetThreshold;
      }
      if (direction === "right" && newPos < -resetThreshold * 2) {
        return 0;
      }
      
      return newPos;
    });
    
    rafRef.current = requestAnimationFrame(animate);
  }, [direction, isPaused]);

  useEffect(() => {
    // Staggered start for smooth cascading effect
    const timeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, rowIndex * 150);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animate, rowIndex]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  return (
    <div className="mb-10 overflow-hidden">
      <div
        ref={rowRef}
        className="flex overflow-hidden py-3"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="flex"
          style={{
            transform: `translate3d(${position}px, 0, 0)`,
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Minimal duplication for better performance */}
          {[...tweets, ...tweets].map((tweet, index) => (
            <TweetCard key={`${tweet.id}-${index}-${rowIndex}`} tweet={tweet} />
          ))}
        </div>
      </div>
    </div>
  );
});
AnimatedRow.displayName = 'AnimatedRow';

// Optimized Loading with skeleton shimmer
const LoadingState = memo(() => (
  <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
    <div className="absolute inset-0 w-full h-full bg-neutral-950 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
    <HomeDock />
    <div className="w-full relative z-10">
      <div className="w-full px-3 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map((index) => (
            <div key={index} className="relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] animate-pulse">
              <div style={{ aspectRatio: '16/9' }}>
                <div className="w-full h-full bg-gradient-to-r from-white/[0.02] via-white/[0.05] to-white/[0.02] animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-10">
        {[0, 1].map((index) => (
          <div key={index} className="flex overflow-hidden py-3 mb-10">
            <div className="flex">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="w-80 flex-shrink-0 mx-3">
                  <div className="h-48 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] animate-pulse">
                    <div className="w-full h-full bg-gradient-to-r from-white/[0.02] via-white/[0.05] to-white/[0.02] animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
));
LoadingState.displayName = 'LoadingState';

// Clean Error State
const ErrorState = memo(({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
    <div className="absolute inset-0 w-full h-full bg-neutral-950 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
    <HomeDock />
    <div className="w-full max-w-md px-6 relative z-10 text-center">
      <div className="text-white bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8">
        <h2 className="text-xl font-medium mb-3 text-white/90">Failed to load content</h2>
        <p className="text-white/60 mb-6 text-sm leading-relaxed">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-white/[0.08] text-white/90 rounded-xl hover:bg-white/[0.12] hover:text-white transition-all duration-300 ease-out border border-white/[0.1] hover:border-white/[0.2] font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
));
ErrorState.displayName = 'ErrorState';

// Static data optimization
const PICTURE_DATA = [
  { src: "/blog1.png", alt: "Gallery image 1" },
  { src: "/blog2.png", alt: "Gallery image 2" },
  { src: "/blog3.png", alt: "Gallery image 3" },
  { src: "/blog4.png", alt: "Gallery image 4" },
] as const;

// Ultra-clean overlay
const LandingOverlay = memo(() => (
  <div className="absolute inset-0 w-full h-full bg-neutral-950 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
));
LandingOverlay.displayName = 'LandingOverlay';

/**
 * Ultra-Optimized Blog Page - Lightning Speed & Clean Design
 */
export default function BlogPage() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTweets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tweets', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'max-age=300', // 5min cache
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load content (${response.status})`);
      }
      
      const data = await response.json();
      
      if (data.tweets && Array.isArray(data.tweets)) {
        setTweets(data.tweets);
      } else {
        throw new Error('Invalid content format');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Network error');
      setTweets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  // Ultra-efficient tweet rows with minimal processing
  const tweetRows = useMemo(() => {
    if (tweets.length === 0) return [];

    const minRows = Math.max(2, Math.ceil(tweets.length / 3));
    const rowSize = Math.ceil(tweets.length / 2);
    
    return [
      tweets.slice(0, rowSize),
      tweets.slice(rowSize)
    ].filter(row => row.length > 0);
  }, [tweets]);

  const handleRetry = useCallback(() => {
    fetchTweets();
  }, [fetchTweets]);

  // Early returns for optimal performance
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={handleRetry} />;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <HomeDock />
      
      {/* Top picture section */}
      <div className="w-full relative z-30 pt-8">
        <PictureCardsRow images={PICTURE_DATA.slice(0, 2)} />
      </div>
      
      {/* First tweet row */}
      <div className="relative">
        <LandingOverlay />
        <div className="w-full relative z-10">
          {tweetRows[0] && (
            <AnimatedRow
              tweets={tweetRows[0]}
              direction="left"
              speed={30}
              rowIndex={0}
            />
          )}
        </div>
      </div>
      
      {/* Bottom picture section */}
      <div className="w-full relative z-30">
        <PictureCardsRow images={PICTURE_DATA.slice(2, 4)} />
      </div>
      
      {/* Second tweet row */}
      <div className="relative">
        <LandingOverlay />
        <div className="w-full relative z-10">
          {tweetRows[1] && (
            <AnimatedRow
              tweets={tweetRows[1]}
              direction="right"
              speed={30}
              rowIndex={1}
            />
          )}
        </div>
      </div>
    </div>
  );
}
