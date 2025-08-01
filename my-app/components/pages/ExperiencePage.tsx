"use client"

import React, { useRef, useState, useCallback, useMemo, useLayoutEffect } from "react"
import { motion, useScroll, useTransform, useInView, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"
import { HomeDock } from "@/components/AppBar"
import Image from "next/image"

// ========================================
// TYPE DEFINITIONS & INTERFACES
// ========================================

interface TimelineItem {
  id: string
  tagline: string
  heading: string
  description: string
  details: string
  skills?: string[]
  link?: string
  startDate: Date
  endDate: Date
}

// ========================================
// DYNAMIC TIMELINE DATA CONFIGURATION
// ========================================

const timelineData: TimelineItem[] = [
  {
    id: "1",
    tagline: "July 2025 - Present",
    heading: "HubApp",
    description: "A modern productivity dashboard that integrates with multiple services (Google, Microsoft, GitHub, Apple) to provide a unified workspace experience.",
    details: "Built with Next.js 14, TypeScript, Tailwind CSS, and Radix UI components on the frontend, and FastAPI with Firebase/Firestore for data storage. Implemented Auth0 for OAuth integration with multiple service providers. Created a comprehensive dashboard that aggregates data from Google Calendar/Gmail, Microsoft Outlook/Teams, GitHub, and Apple services. Fixed complex authentication flows, implemented secure cookie management, and added comprehensive error handling for all API calls.",
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "FastAPI", "Firebase", "Auth0", "OAuth", "Google APIs", "Microsoft APIs", "GitHub API"],
    link: "https://github.com/Chai-B/HubApp",
    startDate: new Date("2025-07-01"),
    endDate: new Date()
  },
  {
    id: "2",
    tagline: "June 2025 - Present",
    heading: "LegalDoc",
    description: "Engineered a comprehensive legal document processing application with AI-powered analysis capabilities and user authentication system.",
    details: "Developed a full-stack application using React frontend and FastAPI backend with PostgreSQL authentication. Implemented Generative AI (LLM) to extract key clauses, obligations, penalties, and dates from complex legal texts. Built complete authentication system with JWT tokens, password hashing using Bcrypt, and comprehensive input validation. Created Docker containerization for easy deployment and added comprehensive API documentation with automated testing capabilities.",
    skills: ["React", "FastAPI", "PostgreSQL", "LLM", "NLP", "JWT", "Bcrypt", "Docker", "Python", "Generative AI"],
    link: "https://github.com/madhurya-ops/Legal-Document-Parser",
    startDate: new Date("2025-06-01"),
    endDate: new Date()
  },
  {
    id: "3",
    tagline: "May 2025 - June 2025",
    heading: "Technical Intern",
    description: "Studied and implemented concepts in Generative AI, Large Language Models (LLMs), and Retrieval Augmented Generation (RAG) to build AI solutions.",
    details: "Developed APIs using FastAPI and created interactive AI-based web applications with Streamlit for model deployment. Worked extensively with Python to integrate GenAI models into backend services, optimizing workflows for AI application delivery.",
    skills: ["Python", "FastAPI", "Streamlit", "Generative AI", "LLM", "RAG", "GenAI"],
    link: "https://drive.google.com/file/d/1neP9jAwtsWXcUqXdObqMfTG50CgonOBv/view?usp=sharing",
    startDate: new Date("2025-05-01"),
    endDate: new Date("2025-06-30")
  },
  {
    id: "4",
    tagline: "April 2025",
    heading: "Stock Price LSTM Forecasting",
    description: "Engineered a 3-layer LSTM model (128-64-32 units) with dropout, batch normalization, and L2 regularization, achieving R² = 0.96.",
    details: "Trained on 5,000+ data points using EarlyStopping and learning rate scheduling, reducing validation loss by 70% and doubling convergence speed. Designed a time series pipeline with a 30-day lookback and MinMax scaling, improving model stability and reducing prediction variance by 15%. Visualized outputs with Matplotlib to track trends, enabling a 10% decrease in forecast deviation.",
    skills: ["Python", "LSTM", "Deep Learning", "Time Series", "Matplotlib", "Machine Learning"],
    link: "https://github.com/Chai-B/Stock-Price-Prediction-using-LSTM",
    startDate: new Date("2025-04-01"),
    endDate: new Date("2025-04-30")
  },
  {
    id: "6",
    tagline: "Nov 2024",
    heading: "Bell's Palsy Severity Detection",
    description: "Engineered a ResNet50-based CNN to classify Bell's Palsy severity into 4 levels, achieving 98.79% accuracy for mouth analysis.",
    details: "Fine-tuned the last 20 layers of ResNet50 with transfer learning, optimizing training using Adam, cross-entropy loss, early stopping, and learning rate scheduling. Augmented 1,000+ images (from 14,000+) with rotation, zoom, flip, and shear to improve generalization and address class imbalance. Evaluated model performance using confusion matrices, precision, recall, F1-score, and ROC-AUC.",
    skills: ["Python", "ResNet50", "CNN", "Transfer Learning", "Computer Vision", "Deep Learning", "Machine Learning"],
    link: "https://github.com/Chai-B/Bell-s-Palsy-Severity-Detection",
    startDate: new Date("2024-11-01"),
    endDate: new Date("2024-11-30")
  },
  {
    id: "5",
    tagline: "May 2024 - July 2024",
    heading: "Data Science Intern",
    description: "Spearheaded the development of a digital platform aimed to empower India's 140M+ senior citizens, focusing on service accessibility and community engagement.",
    details: "Analyzed 20+ key user and service data points to drive insights that improved platform design and usability for the elderly. Acquired practical knowledge of data governance, user-centric design, and cross-functional collaboration to create inclusive digital solutions for elderly users.",
    skills: ["Data Science", "Python", "Data Governance", "User-Centric Design", "Analytics"],
    link: "https://drive.google.com/file/d/1neP9jAwtsWXcUqXdObqMfTG50CgonOBv/view?usp=sharing",
    startDate: new Date("2024-05-01"),
    endDate: new Date("2024-07-31")
  },
].sort((a, b) => b.startDate.getTime() - a.startDate.getTime())

// ========================================
// UTILITY FUNCTIONS
// ========================================

const getSideForIndex = (index: number, isMobile: boolean): "left" | "right" => {
  if (isMobile) return "right"
  return index % 2 === 0 ? "right" : "left"
}

const calculateTimelinePosition = (date: Date, startDate: Date, endDate: Date): number => {
  const totalDuration = endDate.getTime() - startDate.getTime()
  const currentPosition = date.getTime() - startDate.getTime()
  return Math.max(0, Math.min(1, currentPosition / totalDuration))
}

const formatDateForDisplay = (date: Date): string => {
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const year = date.getFullYear().toString().slice(-2)
  return `${month} '${year}`
}

const getTimelineBounds = (data: TimelineItem[]) => {
  const allDates = data.flatMap(item => [item.startDate, item.endDate])
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())))
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())))
  
  const padding = (maxDate.getTime() - minDate.getTime()) * 0.1
  return { 
    minDate: new Date(minDate.getTime() - padding), 
    maxDate: new Date(maxDate.getTime() + padding) 
  }
}

// Enhanced responsive hook with proper resize handling and debouncing
const useResponsive = () => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  })

  const [breakpoints, setBreakpoints] = useState({
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    isTablet: typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
    isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  })

  const updateDimensions = useCallback(() => {
    if (typeof window === 'undefined') return
    
    const width = window.innerWidth
    const height = window.innerHeight
    
    setDimensions(prev => {
      if (prev.width === width && prev.height === height) return prev
      return { width, height }
    })
    
    setBreakpoints(prev => {
      const newBreakpoints = {
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      }
      
      if (prev.isMobile === newBreakpoints.isMobile && 
          prev.isTablet === newBreakpoints.isTablet && 
          prev.isDesktop === newBreakpoints.isDesktop) return prev
      
      return newBreakpoints
    })
  }, [])

  useLayoutEffect(() => {
    updateDimensions()

    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateDimensions, 10)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [updateDimensions])

  return { ...breakpoints, dimensions }
}

// ========================================
// OPTIMIZED ANIMATION VARIANTS
// ========================================

const animationVariants = {
  dot: {
    inactive: {
      scale: 1,
      backgroundColor: "#6b7280",
      borderColor: "transparent",
      boxShadow: "0 0 4px rgba(107, 114, 128, 0.2)",
      // Remove transition from the animation object - let Framer Motion handle it
    },
    active: {
      scale: 1.4,
      backgroundColor: "#ffffff",
      borderColor: "#ffffff",
      boxShadow: "0 0 15px rgba(255, 255, 255, 0.4)",
      // Remove transition from the animation object
    },
    hover: {
      scale: 1.6,
      // Remove transition from the animation object
    }
  },
  card: {
    hidden: { 
      opacity: 0, 
      y: 30, 
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
    }
  },
  skillTag: {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.2,
      }
    })
  }
}

// ========================================
// TIMELINE DOT COMPONENT
// ========================================

interface TimelineDotProps {
  item: TimelineItem
  index: number
  scrollProgress: number
  onDotClick: (index: number) => void
  timelinePosition: number
  isMobile: boolean
  activeCardIndex: number
}

const TimelineDot = React.memo(function TimelineDot({ 
  item, 
  index, 
  scrollProgress, 
  onDotClick, 
  timelinePosition,
  isMobile,
  activeCardIndex
}: TimelineDotProps) {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()
  
  // Dot becomes active when its corresponding card is centered
  const isScrolledPast = activeCardIndex >= index
  
  const displayDate = formatDateForDisplay(item.startDate)

  React.useEffect(() => {
    controls.start(isScrolledPast ? animationVariants.dot.active : animationVariants.dot.inactive)
  }, [isScrolledPast, controls])

  const handleDotClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDotClick(index)
  }, [onDotClick, index])

  return (
    <>
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer z-30"
        animate={controls}
        whileHover={animationVariants.dot.hover}
        whileTap={{ scale: 1.2, transition: { duration: 0.1 } }}
        onClick={handleDotClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "16px",
          height: "16px",
          willChange: "transform, background-color, border-color, box-shadow",
        }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isScrolledPast ? 1 : 0,
          scale: isScrolledPast ? 1 : 0.8,
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.div 
          className="bg-neutral-900 text-white text-xs px-2 py-1 rounded-md border border-neutral-700 whitespace-nowrap cursor-pointer pointer-events-auto"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
            backgroundColor: "#262626",
            transition: { duration: 0.15 }
          }}
          onClick={handleDotClick}
        >
          {displayDate}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
        initial={{ opacity: 0, scale: 0.8, y: -40 }}
        animate={{
          opacity: (isHovered && !isScrolledPast && !isMobile) ? 1 : 0,
          scale: (isHovered && !isScrolledPast && !isMobile) ? 1 : 0.8,
          y: (isHovered && !isScrolledPast && !isMobile) ? -50 : -40,
        }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="bg-black text-white text-xs px-3 py-2 rounded-lg border border-neutral-600 whitespace-nowrap shadow-xl">
          {item.tagline}
        </div>
      </motion.div>
    </>
  )
})

// ========================================
// TIMELINE CARD COMPONENT
// ========================================

interface TimelineCardProps {
  item: TimelineItem
  index: number
  totalItems: number
  isMobile: boolean
  isTablet: boolean
  dimensions: { width: number; height: number }
  onCenterChange: (index: number) => void
}

const TimelineCard = React.memo(function TimelineCard({ 
  item, 
  index, 
  isMobile, 
  isTablet,
  dimensions,
  onCenterChange
}: TimelineCardProps) {
  const ref = useRef(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const isInView = useInView(ref, { 
    amount: 0.5, // Card is considered centered when 50% is visible
    once: false
  })

  // Notify parent when this card becomes centered
  React.useEffect(() => {
    if (isInView) {
      onCenterChange(index)
    }
  }, [isInView, index, onCenterChange])

  const side = useMemo(() => getSideForIndex(index, isMobile), [index, isMobile])
  const isLeft = side === "left"

  const mouseMoveTimeoutRef = useRef<number | null>(null)
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return
    
    if (mouseMoveTimeoutRef.current !== null) {
      cancelAnimationFrame(mouseMoveTimeoutRef.current)
    }
    
    mouseMoveTimeoutRef.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePosition({ x, y })
      }
    })
  }, [isMobile])

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) setIsExpanded(true)
  }, [isMobile])

  const handleMouseLeave = useCallback(() => {
    setIsExpanded(false)
    if (mouseMoveTimeoutRef.current !== null) {
      cancelAnimationFrame(mouseMoveTimeoutRef.current)
    }
  }, [])

  const handleCardTap = useCallback(() => {
    if (isMobile) {
      setIsExpanded(!isExpanded)
    }
  }, [isMobile, isExpanded])

  // Enhanced card dimensions with better screen edge handling
  const getCardDimensions = useCallback(() => {
    const { width } = dimensions
    
    if (width < 480) { // Very small mobile
      return {
        width: isExpanded ? "calc(100vw - 96px)" : "calc(100vw - 96px)",
        maxWidth: isExpanded ? "400px" : "320px",
        height: isExpanded ? "auto" : "280px"
      }
    } else if (width < 768) { // Mobile
      return {
        width: isExpanded ? "calc(100vw - 112px)" : "calc(100vw - 112px)",
        maxWidth: isExpanded ? "500px" : "380px",
        height: isExpanded ? "auto" : "300px"
      }
    } else if (width < 1024) { // Tablet
      return {
        width: isExpanded ? "550px" : "400px",
        height: isExpanded ? "auto" : "320px"
      }
    } else { // Desktop
      return {
        width: isExpanded ? "650px" : "450px",
        height: isExpanded ? "auto" : "350px"
      }
    }
  }, [dimensions, isExpanded])

  const cardAnimation = useMemo(() => ({
    ...getCardDimensions(),
    borderColor: isExpanded ? "#ffffff" : "#6b7280",
    boxShadow: isExpanded 
      ? "0 0 30px rgba(255, 255, 255, 0.15)" 
      : "0 4px 15px rgba(0, 0, 0, 0.1)",
  }), [isExpanded, getCardDimensions])

  const spotlightStyle = useMemo(() => {
    if (isMobile) return {}
    return {
      background: `radial-gradient(circle 500px at ${mousePosition.x}px ${mousePosition.y}px, 
        rgba(255,255,255,0.08) 0%, 
        rgba(255,255,255,0.04) 25%, 
        rgba(255,255,255,0) 60%)`,
    }
  }, [mousePosition.x, mousePosition.y, isMobile])

  const shouldShowCard = !isMobile || (isMobile && side === "right")

  if (!shouldShowCard) {
    return (
      <motion.div className="relative h-screen flex">
        <div className="w-full"></div>
      </motion.div>
    )
  }

  // Dynamic padding based on screen size
  const getPaddingClasses = () => {
    const { width } = dimensions
    if (width < 480) {
      return 'pl-24 pr-6' // 96px left, 24px right
    } else if (width < 768) {
      return 'pl-28 pr-8' // 112px left, 32px right
    } else if (width < 1024) {
      return 'px-8' // Tablet padding
    } else {
      return '' // Desktop - no special padding
    }
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${isMobile ? 'h-auto min-h-screen py-8' : 'h-screen'} flex`}
      variants={animationVariants.card}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      key={`${isMobile}-${isTablet}`}
    >
      <div className={`${isMobile ? `w-full ${getPaddingClasses()}` : (isTablet ? 'w-full px-8' : 'w-1/2')} flex items-center justify-center relative ${!isLeft && !isMobile ? 'order-last' : ''}`}>
        <div className="w-full max-w-none">
          <motion.div
            ref={cardRef}
            className="cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardTap}
            animate={cardAnimation}
            transition={{ 
              duration: 0.3, 
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{
              transformOrigin: "center center",
              willChange: 'width, height, border-color, box-shadow',
              minWidth: dimensions.width < 480 ? "260px" : "280px",
              margin: "0 auto"
            }}
          >
            <div className="relative bg-neutral-950 border border-white rounded-xl overflow-hidden h-full">
              {!isMobile && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={spotlightStyle}
                  animate={{ opacity: isExpanded ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_70%)]" />
              
              <div className={`relative z-20 ${dimensions.width < 480 ? 'p-4' : (isMobile ? 'p-5' : 'p-8')}`}>
                <motion.div 
                  className="space-y-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className={`${dimensions.width < 480 ? 'text-xs' : (isMobile ? 'text-sm' : 'text-base')} text-neutral-400 font-medium uppercase tracking-wider`}>
                    {item.tagline}
                  </div>
                  <h3 className={`${dimensions.width < 480 ? 'text-lg' : (isMobile ? 'text-xl' : 'text-2xl')} font-bold text-white leading-tight`}>
                    {item.heading}
                  </h3>
                  <p className={`${dimensions.width < 480 ? 'text-xs' : (isMobile ? 'text-sm' : 'text-base')} text-neutral-300 leading-relaxed`}>
                    {item.description}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: isExpanded ? 1 : 0,
                    height: isExpanded ? "auto" : 0,
                  }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-6 border-t border-neutral-700 pt-6 mt-6">
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 15 }}
                      animate={isExpanded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                      transition={{ duration: 0.2, delay: 0.05 }}
                    >
                      <h4 className={`${dimensions.width < 480 ? 'text-xs' : (isMobile ? 'text-sm' : 'text-base')} text-white font-semibold`}>Details:</h4>
                      <p className={`${dimensions.width < 480 ? 'text-xs' : 'text-sm'} text-neutral-300 leading-relaxed`}>
                        {item.details}
                      </p>
                    </motion.div>
                    
                    {item.skills && (
                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 15 }}
                        animate={isExpanded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        <h4 className={`${dimensions.width < 480 ? 'text-xs' : (isMobile ? 'text-sm' : 'text-base')} text-white font-semibold`}>Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.skills.map((skill, skillIndex) => (
                            <motion.span
                              key={skill}
                              className={`px-2 py-1 bg-neutral-800 text-neutral-300 ${dimensions.width < 480 ? 'text-xs px-2 py-1' : (isMobile ? 'text-xs px-3 py-2' : 'text-sm px-3 py-2')} rounded-full border border-neutral-700`}
                              custom={skillIndex}
                              variants={animationVariants.skillTag}
                              initial="hidden"
                              animate={isExpanded ? "visible" : "hidden"}
                              whileHover={!isMobile ? { 
                                scale: 1.05,
                                backgroundColor: "#404040",
                                transition: { duration: 0.1 }
                              } : {}}
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={isExpanded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                      transition={{ duration: 0.2, delay: 0.15 }}
                    >
                      <Button 
                        variant="outline" 
                        size={dimensions.width < 480 ? "sm" : (isMobile ? "sm" : "default")}
                        className="bg-transparent border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-500 transition-colors duration-150"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (item.link) {
                            window.open(item.link, '_blank', 'noopener,noreferrer')
                          }
                        }}
                        disabled={!item.link}
                      >
                        {item.link ? 'Details' : 'Details'}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {!isMobile && !isTablet && (
        <div className={`w-1/2 ${isLeft ? 'order-last' : ''}`}></div>
      )}
    </motion.div>
  )
})

// ========================================
// MAIN EXPERIENCE COMPONENT
// ========================================

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const { isMobile, isTablet, isDesktop, dimensions } = useResponsive()
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const { minDate, maxDate } = useMemo(() => getTimelineBounds(timelineData), [])

  // Timeline bounds - dots positioned precisely between first and last cards
  const { lineStartVh, lineEndVh, dotPositions } = useMemo(() => {
    const dockHeight = isMobile ? 100 : 120
    const topMargin = 100 // More space from top
    const bottomMargin = dockHeight + 50 // More space above dock
    
    const lineStartVh = (topMargin / dimensions.height) * 100
    const lineEndVh = ((dimensions.height - bottomMargin) / dimensions.height) * 100
    
    // Calculate exact dot positions
    const totalLineHeight = lineEndVh - lineStartVh
    const dotPositions = timelineData.map((_, index) => 
      lineStartVh + (totalLineHeight * index / (timelineData.length - 1))
    )
    
    return { lineStartVh, lineEndVh, dotPositions }
  }, [dimensions.height, isMobile])

  // Line height based on active card index, not scroll progress
  const lineProgressHeight = useMemo(() => {
    if (activeCardIndex === 0) return "0%"
    
    const totalLineHeight = lineEndVh - lineStartVh
    const progressHeight = (totalLineHeight * activeCardIndex / (timelineData.length - 1))
    return `${progressHeight}vh`
  }, [activeCardIndex, lineEndVh, lineStartVh])

  const [currentScrollProgress, setCurrentScrollProgress] = useState(0)
  
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setCurrentScrollProgress(latest)
    })
    return unsubscribe
  }, [scrollYProgress])

  // Handle card center change
  const handleCardCenterChange = useCallback((index: number) => {
    setActiveCardIndex(index)
  }, [])

  // Scroll to specific card (center it perfectly)
  const scrollToSection = useCallback((index: number) => {
    // Calculate the exact scroll position to center the card
    const viewportHeight = window.innerHeight
    const targetY = index * viewportHeight
    
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    })
  }, [])

  const timelinePositions = useMemo(() => {
    return timelineData.map(item => {
      return calculateTimelinePosition(item.startDate, minDate, maxDate)
    })
  }, [minDate, maxDate])

  // Enhanced timeline positioning
  const getTimelinePosition = () => {
    if (dimensions.width < 480) {
      return { left: "64px", transform: "translateX(0)" }
    } else if (dimensions.width < 768) {
      return { left: "72px", transform: "translateX(0)" }
    } else {
      return { left: "50%", transform: "translateX(-50%)" }
    }
  }

  const timelinePosition = getTimelinePosition()

  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
      <HomeDock />
      
      <div ref={containerRef} className="relative z-10">
        {/* Background timeline line */}
        <motion.div
          className="fixed w-0.5 bg-neutral-600 z-20"
          style={{
            left: timelinePosition.left,
            transform: timelinePosition.transform,
            top: `${lineStartVh}vh`,
            height: `${lineEndVh - lineStartVh}vh`,
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Animated progress line - only reaches to active card's dot */}
        <motion.div
          className="fixed w-0.5 bg-gradient-to-b from-white via-white to-neutral-300 origin-top z-20"
          style={{
            left: timelinePosition.left,
            transform: timelinePosition.transform,
            top: `${lineStartVh}vh`,
            willChange: 'height',
            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))'
          }}
          animate={{
            height: lineProgressHeight
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Timeline dots positioned at exact calculated positions */}
        {timelineData.map((item, index) => (
          <motion.div
            key={`dot-${item.id}-${dimensions.width}`}
            className="fixed z-30"
            style={{
              left: timelinePosition.left,
              transform: timelinePosition.transform,
              top: `${dotPositions[index]}vh`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.4, 0, 0.2, 1], 
              delay: 0.3 + (index * 0.05) 
            }}
          >
            <TimelineDot
              item={item}
              index={index}
              scrollProgress={currentScrollProgress}
              onDotClick={scrollToSection}
              timelinePosition={timelinePositions[index]}
              isMobile={isMobile}
              activeCardIndex={activeCardIndex}
            />
          </motion.div>
        ))}

        {/* Card sections */}
        <div>
          {timelineData.map((item, index) => (
            <div
              key={`${item.id}-${dimensions.width}`}
              ref={(el) => {
                cardRefs.current[index] = el
              }}
            >
              <TimelineCard 
                item={item} 
                index={index} 
                totalItems={timelineData.length}
                isMobile={isMobile}
                isTablet={isTablet}
                dimensions={dimensions}
                onCenterChange={handleCardCenterChange}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
