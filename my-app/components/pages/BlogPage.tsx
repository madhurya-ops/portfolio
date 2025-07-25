"use client"

import { useEffect, useRef } from "react"
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react"
import { HomeDock } from "@/components/AppBar";

// Mock data structure for tweets - customize this to match your data source
const mockTweets = [
  {
    id: 1,
    user: { 
      name: "Chaitanya", 
      username: "Chaitanyaaab", 
      avatar: "/placeholder.svg?height=40&width=40" // Avatar URL (currently not used after UI removal)
    },
    content: "Just shipped a new feature! The feeling of seeing your code come to life never gets old. 🚀 #coding #webdev",
    timestamp: "2h", // Display format for time - customize as needed
    likes: 42,
    retweets: 12,
    replies: 8,
  },
  // ... Additional tweet objects follow the same structure
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
 * Individual Tweet Card Component
 * 
 * Customization Options:
 * - Card width: Change 'w-80' to adjust card width (w-64, w-96, etc.)
 * - Background: Modify 'bg-gray-800' for different card background colors
 * - Border: Adjust 'border-gray-700' for border color, remove 'border' for no border
 * - Spacing: Modify 'mx-2' for horizontal margin between cards
 * - Padding: Change 'p-4' for internal card padding
 * - Border radius: Adjust 'rounded-lg' (rounded-sm, rounded-xl, etc.)
 */
function TweetCard({ tweet }: { tweet: (typeof mockTweets)[0] }) {
  return (
    <div className="w-80 flex-shrink-0 mx-2 bg-neutral-800 border border-neutral-700 rounded-lg p-4">
      {/* Header Section - User info and timestamp */}
      <div className="pb-3">
        <div className="flex items-center space-x-3">
          {/* Avatar - Custom initials display (replaces Avatar component) */}
          {/* Customization: Change size (w-10 h-10), background color (bg-gray-600), text color */}
          <div className="w-10 h-10 bg-neutral-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {/* Extract and display first letters of user's name */}
            {tweet.user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          
          {/* User name and handle section */}
          <div className="flex-1 min-w-0">
            {/* User display name - Customize text color and size */}
            <p className="text-sm font-semibold text-white truncate">{tweet.user.name}</p>
            {/* Username and timestamp - Customize text color and format */}
            <p className="text-sm text-neutral-400 truncate">
              @{tweet.user.username} · {tweet.timestamp}
            </p>
          </div>
        </div>
      </div>
      
      {/* Content Section - Tweet text and interaction buttons */}
      <div className="pt-0">
        {/* Tweet content text */}
        {/* Customization: Adjust text size (text-sm), color (text-gray-100), line height */}
        <p className="text-sm text-neutral-100 mb-4 leading-relaxed">{tweet.content}</p>
        
        {/* Interaction buttons row */}
        {/* Customization: Change button colors, sizes, spacing */}
        <div className="flex items-center justify-between text-gray-400">
          
          {/* Reply button */}
          {/* Hover effect: hover:text-blue-400 - customize hover colors */}
          <div className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer transition-colors">
            <MessageCircle className="w-4 h-4" /> {/* Icon size customizable */}
            <span className="text-xs">{tweet.replies}</span> {/* Number text size */}
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
          
          {/* Share button - no counter display */}
          <div className="hover:text-blue-400 cursor-pointer transition-colors">
            <Share className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Animated Row Component - Creates horizontally scrolling rows of tweets
 * 
 * Props:
 * - tweets: Array of tweet objects to display
 * - direction: "left" or "right" - controls scroll direction
 * - speed: Number (default 50) - lower = faster, higher = slower animation
 * 
 * Customization Options:
 * - Animation speed: Adjust speed prop or modify interval timing
 * - Scroll behavior: Modify the animate function logic
 * - Row spacing: Change 'py-2' for vertical padding between rows
 */
function AnimatedRow({
  tweets,
  direction,
  speed = 50, // Default animation speed - customize as needed
}: { tweets: typeof mockTweets; direction: "left" | "right"; speed?: number }) {
  
  // Reference to the scrollable container for direct DOM manipulation
  const rowRef = useRef<HTMLDivElement>(null)

  // Animation effect - runs continuously to create scrolling effect
  useEffect(() => {
    const row = rowRef.current
    if (!row) return

    // Animation function - called repeatedly via setInterval
    const animate = () => {
      const scrollWidth = row.scrollWidth    // Total scrollable width
      const clientWidth = row.clientWidth    // Visible width

      // Left scrolling logic
      if (direction === "left") {
        // Reset to start when reaching the end
        if (row.scrollLeft >= scrollWidth - clientWidth) {
          row.scrollLeft = 0
        } else {
          row.scrollLeft += 1 // Increment scroll position - adjust for speed
        }
      } 
      // Right scrolling logic  
      else {
        // Reset to end when reaching the start
        if (row.scrollLeft <= 0) {
          row.scrollLeft = scrollWidth - clientWidth
        } else {
          row.scrollLeft -= 1 // Decrement scroll position - adjust for speed
        }
      }
    }

    // Start animation interval - speed parameter controls timing
    const interval = setInterval(animate, speed)
    
    // Cleanup function to prevent memory leaks
    return () => clearInterval(interval)
  }, [direction, speed])

  return (
    <div
      ref={rowRef}
      className="flex overflow-x-hidden py-2" // Hidden scrollbar, vertical padding
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Hide scrollbar cross-browser
    >
      {/* CSS-in-JS to hide webkit scrollbars */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Content container - duplicated tweets for seamless loop */}
      <div className="flex">
        {/* Duplicate tweets array to create infinite scroll effect */}
        {[...tweets, ...tweets].map((tweet, index) => (
          <TweetCard key={`${tweet.id}-${index}`} tweet={tweet} />
        ))}
      </div>
    </div>
  )
}

/**
 * Main Blog Page Component
 * 
 * Customization Options:
 * - Background: Modify 'bg-black' for different page background
 * - Container width: Change 'max-w-7xl' for different max widths
 * - Padding: Adjust 'px-4' and 'py-4' for page margins
 * - Gradient overlay: Modify the radial-gradient style for different visual effects
 * - Row spacing: Change 'space-y-4' for different spacing between rows
 */
export default function BlogPage() {
  // Define which tweets appear in each row - customize tweet selection
  // Currently shows tweets 4-7 in first row, 8-11 in second row (but only 8 tweets exist)
  const rows = [
    mockTweets.slice(4, 8), // First row: tweets 5-8
    mockTweets.slice(0, 4)  // Second row: tweets 1-4 (modified to show existing tweets)
  ]
  const LandingOverlay = () => (
    <div className="absolute inset-0 w-full h-full bg-neutral-950 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background gradient overlay */}
      {/* Customization: Modify colors, opacity, gradient type for different visual effects */}
      <LandingOverlay />
      <HomeDock />
      {/* Main content container */}
      {/* Customization: Adjust max-width, padding, positioning */}
      <div className="w-full max-w-9xl px-4 relative" style={{ zIndex: 10 }}>
        {/* Rows container with vertical spacing */}
        <div className="space-y-0">
          {/* Generate animated rows */}
          {rows.map((rowTweets, index) => (
            <AnimatedRow
              key={index}
              tweets={rowTweets}
              direction={index % 2 === 0 ? "left" : "right"} // Alternate direction per row
              speed={20} // Vary speed per row - customize multiplier
            />
          ))}
        </div>
      </div>
    </div>
  )
}
