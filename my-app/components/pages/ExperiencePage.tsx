"use client"

import React, { useRef, useState, useCallback, useMemo, useEffect } from "react"
import { motion, useScroll, useInView, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"
import { HomeDock } from "@/components/AppBar"

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

const timelineData: TimelineItem[] = [
  {
    id: "1",
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
    id: "2",
    tagline: "April 2025",
    heading: "Stock Price LSTM Forecasting",
    description: "Engineered a 3-layer LSTM model (128-64-32 units) with dropout, batch normalization, and L2 regularization, achieving R² = 0.96.",
    details: "Trained on 5,000+ data points using EarlyStopping and learning rate scheduling, reducing validation loss by 70% and doubling convergence speed. Designed a time series pipeline with a 30-day lookback and MinMax scaling, improving model stability and reducing prediction variance by 15%. Visualized outputs with Matplotlib to track trends, enabling a 10% decrease in forecast deviation.",
    skills: ["Python", "LSTM", "Deep Learning", "Time Series", "Matplotlib", "Machine Learning"],
    link: "https://github.com/madhurya-ops/Stock-Price-Prediction",
    startDate: new Date("2025-04-01"),
    endDate: new Date("2025-04-30")
  },
  {
    id: "3",
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
    id: "4",
    tagline: "May 2024 - July 2024",
    heading: "Software Engineer",
    description: "Developed a Flutter-based mobile app for tracking vital nutrition metrics in preterm infants, revolutionizing neonatal care through enhanced data handling and advanced validation.",
    details: "Designed and deployed a cross-platform Flutter app for neonatal nutrition tracking, cutting manual effort by 60% and improving patient outcomes by 25%. Achieved 70% crash rate reduction and 30% faster load times through modular architecture and performance profiling.",
    skills: ["Flutter", "Firebase", "Hive", "Mobile App Development", "Performance Optimization", "Cross-Platform Testing", "Data Validation", "Healthcare Informatics"],
    link: "https://drive.google.com/file/d/10PxxSBUCXdJxS07pkpzor3U2x-52hGta/view?usp=drive_link",
    startDate: new Date("2024-05-01"),
    endDate: new Date("2024-07-31")
  }
  
].sort((a, b) => b.startDate.getTime() - a.startDate.getTime())

const useResponsive = () => {
  const [dimensions, setDimensions] = useState({
    width: 1200,
    height: 800,
    isMobile: false
  })

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isMobile = width < 768
      
      setDimensions(prev => {
        if (prev.width === width && prev.height === height && prev.isMobile === isMobile) {
          return prev
        }
        return { width, height, isMobile }
      })
    }

    updateDimensions()
    
    const debouncedResize = (() => {
      let timeoutId: NodeJS.Timeout
      return () => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(updateDimensions, 100)
      }
    })()

    window.addEventListener('resize', debouncedResize, { passive: true })
    return () => {
      window.removeEventListener('resize', debouncedResize)
    }
  }, [])

  return dimensions
}

const TimelineDot = React.memo(function TimelineDot({ 
  item, 
  index, 
  onDotClick, 
  activeCardIndex,
  isMobile
}: { 
  item: TimelineItem
  index: number
  onDotClick: (index: number) => void
  activeCardIndex: number
  isMobile: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()
  const isActive = activeCardIndex >= index
  const displayDate = item.startDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }).replace(' ', " '")

  useEffect(() => {
    controls.start(isActive ? {
      scale: 1.4,
      backgroundColor: "#ffffff",
      boxShadow: "0 0 15px rgba(255, 255, 255, 0.4)"
    } : {
      scale: 1,
      backgroundColor: "#6b7280",
      boxShadow: "0 0 4px rgba(107, 114, 128, 0.2)"
    })
  }, [isActive, controls])

  return (
    <>
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer z-30"
        animate={controls}
        whileHover={{ scale: 1.6 }}
        onClick={() => onDotClick(index)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width: "16px", height: "16px" }}
      />

      {isActive && (
        <motion.div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="bg-neutral-900 text-white text-xs px-2 py-1 rounded-md border border-neutral-700 whitespace-nowrap cursor-pointer pointer-events-auto" onClick={() => onDotClick(index)}>
            {displayDate}
          </div>
        </motion.div>
      )}

      {isHovered && !isActive && !isMobile && (
        <motion.div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: -50 }}
        >
          <div className="bg-black text-white text-xs px-3 py-2 rounded-lg border border-neutral-600 whitespace-nowrap">
            {item.tagline}
          </div>
        </motion.div>
      )}
    </>
  )
})

const TimelineCard = React.memo(function TimelineCard({ 
  item, 
  index, 
  onCenterChange,
  dimensions
}: { 
  item: TimelineItem
  index: number
  onCenterChange: (index: number) => void
  dimensions: { width: number; height: number; isMobile: boolean }
}) {
  const ref = useRef(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const isInView = useInView(ref, { amount: 0.5, once: false })
  const { isMobile, width } = dimensions
  
  // First card on RIGHT (index 0), second on LEFT (index 1), etc.
  const isRight = isMobile || index % 2 === 0

  useEffect(() => {
    if (isInView) onCenterChange(index)
  }, [isInView, index, onCenterChange])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
  }, [isMobile])

  const cardDimensions = useMemo(() => {
    if (width < 480) {
      return {
        width: isExpanded ? "calc(100vw - 96px)" : "calc(100vw - 96px)",
        maxWidth: isExpanded ? "400px" : "320px",
        height: isExpanded ? "auto" : "280px"
      }
    } else if (width < 768) {
      return {
        width: isExpanded ? "calc(100vw - 112px)" : "calc(100vw - 112px)",
        maxWidth: isExpanded ? "500px" : "380px",
        height: isExpanded ? "auto" : "300px"
      }
    } else if (width < 1024) {
      return {
        width: isExpanded ? "550px" : "400px",
        height: isExpanded ? "auto" : "320px"
      }
    } else {
      return {
        width: isExpanded ? "650px" : "450px",
        height: isExpanded ? "auto" : "350px"
      }
    }
  }, [width, isExpanded])

  const getPaddingClasses = () => {
    if (width < 480) return 'pl-24 pr-6'
    if (width < 768) return 'pl-28 pr-8'
    if (width < 1024) return 'px-8'
    return ''
  }

  useEffect(() => {
    setIsExpanded(false)
  }, [width])

  return (
    <motion.div
      ref={ref}
      className={`relative ${isMobile ? 'h-auto min-h-screen py-8' : 'h-screen'} flex`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      key={`${width}-${isMobile}`}
    >
      <div className={`${isMobile ? `w-full ${getPaddingClasses()}` : (width < 1024 ? 'w-full px-8' : 'w-1/2')} flex items-center justify-center relative ${isRight ? 'order-last' : 'order-first'}`}>
        <motion.div
          ref={cardRef}
          className="cursor-pointer w-full max-w-none"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => !isMobile && setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          onClick={() => isMobile && setIsExpanded(!isExpanded)}
          animate={{
            ...cardDimensions,
            borderColor: isExpanded ? "#ffffff" : "#6b7280",
            boxShadow: isExpanded ? "0 0 30px rgba(255, 255, 255, 0.15)" : "0 4px 15px rgba(0, 0, 0, 0.1)"
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ 
            margin: "0 auto", 
            minWidth: width < 480 ? "260px" : "280px"
          }}
        >
          <div className="relative bg-neutral-950 border border-white rounded-xl overflow-hidden h-full">
            {!isMobile && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle 500px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0) 60%)`
                }}
                animate={{ opacity: isExpanded ? 1 : 0 }}
              />
            )}

            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_70%)]" />
            
            <div className={`relative z-20 ${width < 480 ? 'p-4' : (isMobile ? 'p-5' : 'p-8')}`}>
              <div className="space-y-5">
                <div className={`${width < 480 ? 'text-xs' : (isMobile ? 'text-sm' : 'text-base')} text-neutral-400 font-medium uppercase tracking-wider`}>
                  {item.tagline}
                </div>
                <h3 className={`${width < 480 ? 'text-lg' : (isMobile ? 'text-xl' : 'text-2xl')} font-bold text-white leading-tight`}>
                  {item.heading}
                </h3>
                <p className={`${width < 480 ? 'text-xs' : (isMobile ? 'text-sm' : 'text-base')} text-neutral-300 leading-relaxed`}>
                  {item.description}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? "auto" : 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-6 border-t border-neutral-700 pt-6 mt-6">
                  <div className="space-y-4">
                    <h4 className={`${width < 480 ? 'text-xs' : (isMobile ? 'text-sm' : 'text-base')} text-white font-semibold`}>Details:</h4>
                    <p className={`${width < 480 ? 'text-xs' : 'text-sm'} text-neutral-300 leading-relaxed`}>
                      {item.details}
                    </p>
                  </div>
                  
                  {item.skills && (
                    <div className="space-y-4">
                      <h4 className={`${width < 480 ? 'text-xs' : (isMobile ? 'text-sm' : 'text-base')} text-white font-semibold`}>Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className={`px-2 py-1 bg-neutral-800 text-neutral-300 ${width < 480 ? 'text-xs px-2 py-1' : (isMobile ? 'text-xs px-3 py-2' : 'text-sm px-3 py-2')} rounded-full border border-neutral-700`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size={width < 480 ? "sm" : (isMobile ? "sm" : "default")}
                    className="bg-transparent border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (item.link) window.open(item.link, '_blank')
                    }}
                    disabled={!item.link}
                  >
                    Details
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {!isMobile && width >= 1024 && (
        <div className={`w-1/2 ${isRight ? 'order-first' : 'order-last'}`}></div>
      )}
    </motion.div>
  )
})

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useResponsive()
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Client-side detection to prevent hydration errors
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Only initialize useScroll after client-side hydration
  const { scrollYProgress } = useScroll({
    target: isClient ? containerRef : undefined,
    offset: ["start start", "end end"]
  })

  const { lineStartVh, lineEndVh, dotPositions } = useMemo(() => {
    const dockHeight = dimensions.isMobile ? 100 : 120
    const topMargin = 100
    const bottomMargin = dockHeight + 50
    
    const lineStartVh = (topMargin / dimensions.height) * 100
    const lineEndVh = ((dimensions.height - bottomMargin) / dimensions.height) * 100
    
    const totalLineHeight = lineEndVh - lineStartVh
    const dotPositions = timelineData.map((_, index) => 
      lineStartVh + (totalLineHeight * index / (timelineData.length - 1))
    )
    
    return { lineStartVh, lineEndVh, dotPositions }
  }, [dimensions])

  const lineProgressHeight = useMemo(() => {
    const totalLineHeight = lineEndVh - lineStartVh
    const progressHeight = (totalLineHeight * activeCardIndex / (timelineData.length - 1))
    return `${progressHeight}vh`
  }, [activeCardIndex, lineEndVh, lineStartVh])

  const scrollToSection = useCallback((index: number) => {
    if (!isClient) return
    const targetY = index * window.innerHeight
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    })
  }, [isClient])

  const timelinePosition = useMemo(() => {
    if (dimensions.width < 480) return { left: "64px", transform: "translateX(0)" }
    if (dimensions.width < 768) return { left: "72px", transform: "translateX(0)" }
    return { left: "50%", transform: "translateX(-50%)" }
  }, [dimensions.width])

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
        <HomeDock />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white animate-pulse">Loading Timeline...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
      <HomeDock />
      
      <div ref={containerRef} className="relative z-10">
        <motion.div
          className="fixed w-0.5 bg-neutral-600 z-20"
          style={{
            left: timelinePosition.left,
            transform: timelinePosition.transform,
            top: `${lineStartVh}vh`,
            height: `${lineEndVh - lineStartVh}vh`
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
        />

        <motion.div
          className="fixed w-0.5 bg-gradient-to-b from-white via-white to-neutral-300 origin-top z-20"
          style={{
            left: timelinePosition.left,
            transform: timelinePosition.transform,
            top: `${lineStartVh}vh`,
            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))'
          }}
          animate={{ height: lineProgressHeight }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {timelineData.map((item, index) => (
          <motion.div
            key={item.id}
            className="fixed z-30"
            style={{
              left: timelinePosition.left,
              transform: timelinePosition.transform,
              top: `${dotPositions[index]}vh`
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + (index * 0.05) }}
          >
            <TimelineDot
              item={item}
              index={index}
              onDotClick={scrollToSection}
              activeCardIndex={activeCardIndex}
              isMobile={dimensions.isMobile}
            />
          </motion.div>
        ))}

        <div>
          {timelineData.map((item, index) => (
            <TimelineCard 
              key={`${item.id}-${dimensions.width}`}
              item={item} 
              index={index} 
              onCenterChange={setActiveCardIndex}
              dimensions={dimensions}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
