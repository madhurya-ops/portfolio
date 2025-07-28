"use client"

import { useEffect, useRef } from "react"
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react"
import { HomeDock } from "@/components/AppBar";
import { useTheme } from "@/components/ui/themeProvider";

// Mock data structure for tweets - customize this to match your data source
const mockTweets = [
  {
    id: 1,
    user: { 
      name: "Chaitanya", 
      username: "Chaitanyaaab", 
      avatar: "/placeholder.svg?height=40&width=40"
    },
    content: "Just shipped a new feature! The feeling of seeing your code come to life never gets old. 🚀 #coding #webdev",
    timestamp: "2h",
    likes: 42,
    retweets: 12,
    replies: 8,
  },
  {
    id: 2,
    user: { name: "Chaitanya", username: "Chaitanyaaab", avatar: "/placeholder.svg?height=40&width=40" },
    content: "Working on some exciting AI projects. The future is here and it's incredible! 🤖✨ #AI #MachineLearning",
    timestamp: "4h",
    likes: 128,
    retweets: 34,
    replies: 19,
  },
  {
    id: 3,
    user: { name: "Chaitanya", username: "Chaitanyaaab", avatar: "/placeholder.svg?height=40&width=40" },
    content: "Beautiful sunset from my office window. Sometimes you need to pause and appreciate the simple things 🌅",
    timestamp: "6h",
    likes: 89,
    retweets: 23,
    replies: 15,
  },
  {
    id: 4,
    user: { name: "Chaitanya", username: "Chaitanyaaab", avatar: "/placeholder.svg?height=40&width=40" },
    content: "Coffee, code, repeat. That's the developer life! ☕️💻 What's your coding fuel of choice?",
    timestamp: "8h",
    likes: 67,
    retweets: 18,
    replies: 32,
  },
  {
    id: 5,
    user: { name: "Chaitanya", username: "Chaitanyaaab", avatar: "/placeholder.svg?height=40&width=40" },
    content: "Just discovered this amazing new JavaScript framework. The developer experience is phenomenal! 🔥",
    timestamp: "10h",
    likes: 156,
    retweets: 45,
    replies: 28,
  },
  {
    id: 6,
    user: { name: "Chaitanya", username: "Chaitanyaaab", avatar: "/placeholder.svg?height=40&width=40" },
    content: "Debugging is like being a detective in a crime movie where you are also the murderer 🕵️‍♀️😅",
    timestamp: "12h",
    likes: 234,
    retweets: 67,
    replies: 41,
  },
  {
    id: 7,
    user: { name: "Chaitanya", username: "Chaitanyaaab", avatar: "/placeholder.svg?height=40&width=40" },
    content: "Open source contributions are the best way to give back to the community. What's your favorite project?",
    timestamp: "14h",
    likes: 98,
    retweets: 29,
    replies: 22,
  },
  {
    id: 8,
    user: { name: "Chaitanya", username: "Chaitanyaaab", avatar: "/placeholder.svg?height=40&width=40" },
    content: "Remote work has changed everything. Building amazing products from anywhere in the world 🌍",
    timestamp: "16h",
    likes: 112,
    retweets: 31,
    replies: 18,
  }
]

/**
 * Individual Tweet Card Component with theme support
 */
function TweetCard({ tweet }: { tweet: (typeof mockTweets)[0] }) {
  const { theme } = useTheme();
  
  return (
    <div className={`w-80 flex-shrink-0 mx-2 border rounded-lg p-4 ${
      theme === "light" 
        ? "bg-gray-50 border-gray-200" 
        : "bg-neutral-800 border-neutral-700"
    }`}>
      {/* Header Section - User info and timestamp */}
      <div className="pb-3">
        <div className="flex items-center space-x-3">
          {/* Avatar - Theme-aware colors */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
            theme === "light" 
              ? "bg-gray-300 text-gray-700" 
              : "bg-neutral-600 text-white"
          }`}>
            {tweet.user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          
          {/* User name and handle section */}
          <div className="flex-1 min-w-0">
            {/* User display name - Theme-aware text */}
            <p className={`text-sm font-semibold truncate ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>{tweet.user.name}</p>
            {/* Username and timestamp - Theme-aware muted text */}
            <p className={`text-sm truncate ${
              theme === "light" ? "text-gray-500" : "text-neutral-400"
            }`}>
              @{tweet.user.username} · {tweet.timestamp}
            </p>
          </div>
        </div>
      </div>
      
      {/* Content Section - Tweet text and interaction buttons */}
      <div className="pt-0">
        {/* Tweet content text - Theme-aware */}
        <p className={`text-sm mb-4 leading-relaxed ${
          theme === "light" ? "text-gray-800" : "text-neutral-100"
        }`}>{tweet.content}</p>
        
        {/* Interaction buttons row - Theme-aware colors */}
        <div className={`flex items-center justify-between ${
          theme === "light" ? "text-gray-500" : "text-gray-400"
        }`}>
          
          {/* Reply button */}
          <div className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">{tweet.replies}</span>
          </div>
          
          {/* Retweet button */}
          <div className="flex items-center space-x-1 hover:text-green-400 cursor-pointer transition-colors">
            <Repeat2 className="w-4 h-4" />
            <span className="text-xs">{tweet.retweets}</span>
          </div>
          
          {/* Like button */}
          <div className="flex items-center space-x-1 hover:text-red-400 cursor-pointer transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-xs">{tweet.likes}</span>
          </div>
          
          {/* Share button */}
          <div className="hover:text-blue-400 cursor-pointer transition-colors">
            <Share className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Animated Row Component - unchanged functionality, theme support added via TweetCard
 */
function AnimatedRow({
  tweets,
  direction,
  speed = 50,
}: { tweets: typeof mockTweets; direction: "left" | "right"; speed?: number }) {
  
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const row = rowRef.current
    if (!row) return

    const animate = () => {
      const scrollWidth = row.scrollWidth
      const clientWidth = row.clientWidth

      if (direction === "left") {
        if (row.scrollLeft >= scrollWidth - clientWidth) {
          row.scrollLeft = 0
        } else {
          row.scrollLeft += 1
        }
      } else {
        if (row.scrollLeft <= 0) {
          row.scrollLeft = scrollWidth - clientWidth
        } else {
          row.scrollLeft -= 1
        }
      }
    }

    const interval = setInterval(animate, speed)
    return () => clearInterval(interval)
  }, [direction, speed])

  return (
    <div
      ref={rowRef}
      className="flex overflow-x-hidden py-2"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="flex">
        {[...tweets, ...tweets].map((tweet, index) => (
          <TweetCard key={`${tweet.id}-${index}`} tweet={tweet} />
        ))}
      </div>
    </div>
  )
}

/**
 * Main Blog Page Component with theme support
 */
export default function BlogPage() {
  const { theme } = useTheme();
  
  const rows = [
    mockTweets.slice(4, 8),
    mockTweets.slice(0, 4)
  ]
  
  // Theme-aware overlay component
  const LandingOverlay = () => (
    <div className={`absolute inset-0 w-full h-full z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none ${
      theme === "light" 
        ? "bg-gray-50" 
        : "bg-neutral-950"
    }`} />
  );

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col items-center justify-center ${
      theme === "light" ? "bg-white" : "bg-black"
    }`}>
      {/* Background gradient overlay with theme support */}
      <LandingOverlay />
      <HomeDock />
      
      {/* Main content container */}
      <div className="w-full max-w-9xl px-4 relative" style={{ zIndex: 10 }}>
        <div className="space-y-0">
          {rows.map((rowTweets, index) => (
            <AnimatedRow
              key={index}
              tweets={rowTweets}
              direction={index % 2 === 0 ? "left" : "right"}
              speed={20}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
