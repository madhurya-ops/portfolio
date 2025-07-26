"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

const words = ["backend", "websites"];

export default function NameCard() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isInitialLoad] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentTime, setCurrentTime] = useState(new Date());
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsAnimating(false)
      }, 500)
    }, 3000);

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(wordInterval);
      clearInterval(timeInterval);
    };
  }, [])

  // Mouse tracking for spotlight effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMousePosition({ x, y })
    }
  }

  return (
    <div className="w-full flex items-center">
      <div className="absolute bottom-10 right-0 z-100">
              <div className="font-mono flex justify-end items-center gap-1 text-sm font-light text-zinc-400">
                <div className="size-1.5 rounded-full bg-green-500" />
                <p className="text-s font-light">Available for work</p>
              </div>
              <div className="flex items-center justify-center">
                <time
                  className="text-[11px] font-light font-mono tabular-nums tracking-wider text-zinc-500"
                  dateTime={currentTime.toISOString()}
                  aria-label="Current time"
                >
                  {currentTime.toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                  ,{" "}
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </time>
              </div>
    </div>
      <div
        ref={cardRef}
        className={`relative w-full max-w-xl overflow-hidden rounded-xl border bg-zinc-950 border-zinc-900 text-white cursor-pointer transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isInitialLoad || isHovered
            ? "transform scale-110 shadow-xl shadow-zinc-900/60 -translate-y-8 border-zinc-700/50"
            : "transform scale-95 shadow-lg shadow-zinc-900/30 hover:scale-105 hover:shadow-xl hover:shadow-zinc-900/40 hover:border-zinc-700/30"
        }`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transition: "all 1000ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 800ms ease-out",
        }}
      >
        {/* Enhanced dynamic spotlight effect that covers entire component */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-500 ease-out opacity-80"
          style={{
            background: `radial-gradient(circle 600px at ${mousePosition.x}px ${mousePosition.y}px, 
              rgba(255,255,255,0.15) 0%, 
              rgba(255,255,255,0.08) 15%, 
              rgba(255,255,255,0.04) 30%, 
              rgba(255,255,255,0.02) 45%, 
              rgba(255,255,255,0.01) 60%, 
              rgba(255,255,255,0.005) 75%, 
              transparent 100%)`,
          }}
        />

        {/* Secondary subtle glow layer */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out opacity-60"
          style={{
            background: `radial-gradient(ellipse 800px 400px at ${mousePosition.x}px ${mousePosition.y}px, 
              rgba(255,255,255,0.06) 0%, 
              rgba(255,255,255,0.03) 25%, 
              rgba(255,255,255,0.015) 50%, 
              rgba(255,255,255,0.008) 70%, 
              transparent 100%)`,
          }}
        />

        {/* Central spotlight effect */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.008)_50%,transparent_70%)] transition-opacity duration-500" />

        {/* Subtle edge lighting with smooth transitions */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.015)_0%,transparent_40%)] transition-opacity duration-800" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.01)_0%,transparent_30%)] transition-opacity duration-800" />

        {/* Name area subtle glow with enhanced smoothness */}
        <div className="absolute top-5 left-20 w-48 h-16 pointer-events-none bg-[radial-gradient(ellipse,rgba(255,255,255,0.03)_0%,transparent_60%)] transition-all duration-600 ease-out" />

        {/* Inner content box with smoother backdrop */}
        <div className="relative z-10 rounded-lg bg-zinc-950/40 border border-zinc-800/40 backdrop-blur-sm transition-all duration-800 ease-out">
          <div className="p-5 flex flex-col gap-6 h-full min-h-[300px] sm:min-h-[340px]">
            {/* Header */}
            <div className="w-full flex justify-start items-start">
              <div className="flex gap-3">
                <Image
                  src="/NameCard.svg?height=64&width=64"
                  alt="Madhurya"
                  width={64}
                  height={64}
                  className="size-16 rounded-4xl opacity-90 transition-all duration-500 ease-out"
                />
                <div>
                  <p
                    className="font-normal text-4xl text-white transition-all duration-500 ease-out"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                    }}
                  >
                    Madhurya
                  </p>
                  <p className="text-lg font-mono font-light text-zinc-400/80 transition-all duration-500 ease-out">
                    @with_maddy_
                  </p>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col gap-1 overflow-hidden">
              <div
                className="font-normal w-full flex items-center justify-start gap-1 transition-all duration-500 ease-out"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                }}
              >
                <p className="inline text-2xl transition-all duration-500 ease-out">I build</p>
                <div className="min-w-[5.5rem] relative">
                  <div className="w-full text-2xl leading-none text-center relative font-normal">
                    <span
                      className={`w-full inline-block transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                        isAnimating ? "opacity-0 blur-sm transform scale-95" : "opacity-100 blur-0 transform scale-100"
                      } text-zinc-300`}
                      style={{
                        filter: isAnimating ? "blur(1px)" : "none",
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                      }}
                    >
                      {words[currentWordIndex]}
                    </span>
                  </div>
                </div>
                <p className="text-3xl transition-all duration-500 ease-out">.</p>
              </div>
              <div className="w-full">
                <p
                  className="text-2xl font-normal text-zinc-300 transition-all duration-500 ease-out"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
                  }}
                >
                  Hello, I&apos;m Chaitanya! a developer passionate about creating amazing digital experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
