"use client"

import React, { useRef, useState, useCallback, useMemo } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { HomeDock } from "@/components/AppBar"

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
}

// ========================================
// DYNAMIC TIMELINE DATA CONFIGURATION
// ========================================

const timelineData: TimelineItem[] = [
  {
    id: "1",
    tagline: "July 2025 - Present",
    heading: "HubApp - Productivity Dashboard",
    description: "A modern productivity dashboard that integrates with multiple services (Google, Microsoft, GitHub, Apple) to provide a unified workspace experience.",
    details: "Built with Next.js 14, TypeScript, Tailwind CSS, and Radix UI components on the frontend, and FastAPI with Firebase/Firestore for data storage. Implemented Auth0 for OAuth integration with multiple service providers. Created a comprehensive dashboard that aggregates data from Google Calendar/Gmail, Microsoft Outlook/Teams, GitHub, and Apple services. Fixed complex authentication flows, implemented secure cookie management, and added comprehensive error handling for all API calls.",
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "FastAPI", "Firebase", "Auth0", "OAuth", "Google APIs", "Microsoft APIs", "GitHub API"],
    link: "https://github.com/Chai-B/HubApp",
  },
  {
    id: "2",
    tagline: "June 2025 - Present",
    heading: "Legal Document Parser",
    description: "Engineered a comprehensive legal document processing application with AI-powered analysis capabilities and user authentication system.",
    details: "Developed a full-stack application using React frontend and FastAPI backend with PostgreSQL authentication. Implemented Generative AI (LLM) to extract key clauses, obligations, penalties, and dates from complex legal texts. Built complete authentication system with JWT tokens, password hashing using Bcrypt, and comprehensive input validation. Created Docker containerization for easy deployment and added comprehensive API documentation with automated testing capabilities.",
    skills: ["React", "FastAPI", "PostgreSQL", "LLM", "NLP", "JWT", "Bcrypt", "Docker", "Python", "Generative AI"],
    link: "https://github.com/madhurya-ops/Legal-Document-Parser",
  },
  {
    id: "3",
    tagline: "May 2025 - June 2025",
    heading: "Technical Intern",
    description: "Studied and implemented concepts in Generative AI, Large Language Models (LLMs), and Retrieval Augmented Generation (RAG) to build AI solutions.",
    details: "Developed APIs using FastAPI and created interactive AI-based web applications with Streamlit for model deployment. Worked extensively with Python to integrate GenAI models into backend services, optimizing workflows for AI application delivery.",
    skills: ["Python", "FastAPI", "Streamlit", "Generative AI", "LLM", "RAG", "GenAI"],
    link: "https://www.xebia.com",
  },
  {
    id: "4",
    tagline: "April 2025",
    heading: "Stock Price LSTM Forecasting",
    description: "Engineered a 3-layer LSTM model (128-64-32 units) with dropout, batch normalization, and L2 regularization, achieving R² = 0.96.",
    details: "Trained on 5,000+ data points using EarlyStopping and learning rate scheduling, reducing validation loss by 70% and doubling convergence speed. Designed a time series pipeline with a 30-day lookback and MinMax scaling, improving model stability and reducing prediction variance by 15%. Visualized outputs with Matplotlib to track trends, enabling a 10% decrease in forecast deviation.",
    skills: ["Python", "LSTM", "Deep Learning", "Time Series", "Matplotlib", "Machine Learning"],
  },
  {
    id: "5",
    tagline: "Nov 2024 - Present",
    heading: "Bell's Palsy Severity Detection",
    description: "Engineered a ResNet50-based CNN to classify Bell's Palsy severity into 4 levels, achieving 98.79% accuracy for mouth analysis.",
    details: "Fine-tuned the last 20 layers of ResNet50 with transfer learning, optimizing training using Adam, cross-entropy loss, early stopping, and learning rate scheduling. Augmented 1,000+ images (from 14,000+) with rotation, zoom, flip, and shear to improve generalization and address class imbalance. Evaluated model performance using confusion matrices, precision, recall, F1-score, and ROC-AUC.",
    skills: ["Python", "ResNet50", "CNN", "Transfer Learning", "Computer Vision", "Deep Learning", "Machine Learning"],
  },
  {
    id: "6",
    tagline: "May 2024 - July 2024",
    heading: "Data Science Intern",
    description: "Spearheaded the development of a digital platform aimed to empower India's 140M+ senior citizens, focusing on service accessibility and community engagement.",
    details: "Analyzed 20+ key user and service data points to drive insights that improved platform design and usability for the elderly. Acquired practical knowledge of data governance, user-centric design, and cross-functional collaboration to create inclusive digital solutions for elderly users.",
    skills: ["Data Science", "Python", "Data Governance", "User-Centric Design", "Analytics"],
    link: "https://www.nic.in",
  },
  {
    id: "7",
    tagline: "June 2024",
    heading: "Web Text Scraping/Analysis",
    description: "Developed a Python script to scrape and analyze content from 100+ web pages using BeautifulSoup, NLTK, and requests.",
    details: "Extracted 250,000+ words, calculating 15+ text metrics such as Fog Index, sentiment polarity, and subjectivity scores. Achieved 95%+ accuracy in text extraction, processing each page in under 3 seconds and exporting results to clean Excel/CSV formats.",
    skills: ["Python", "BeautifulSoup", "NLTK", "Web Scraping", "NLP", "Data Analysis"],
  },
  {
    id: "8",
    tagline: "2022 - 2026",
    heading: "BTech - Electronics & Computer Science Engineering",
    description: "Currently pursuing Bachelor's degree at KIIT University with CGPA of 7.35, focusing on advanced programming and machine learning concepts.",
    details: "Comprehensive coursework covering Python, Java, HTML, CSS, JavaScript, ReactJs, NodeJs, MySQL, C programming, Machine Learning, Deep Learning, Computer Vision, DSA, OOP, DBMS, OS, Probability & Statistics, and emerging technologies like LLM and RAG systems.",
    skills: ["Python", "Java", "JavaScript", "ReactJs", "NodeJs", "MySQL", "Machine Learning", "Deep Learning", "Computer Vision", "DSA"],
    link: "https://kiit.ac.in",
  },
]

// ========================================
// DYNAMIC SIDE CALCULATION UTILITY
// ========================================

const getSideForIndex = (index: number): "left" | "right" => {
  return index % 2 === 0 ? "right" : "left"
}

// ========================================
// TIMELINE DOT COMPONENT
// ========================================

interface TimelineDotProps {
  index: number
  totalItems: number
  scrollProgress: number
}

const TimelineDot = React.memo(function TimelineDot({ index, totalItems, scrollProgress }: TimelineDotProps) {
  const dotPosition = (index + 0.5) / totalItems
  const isScrolledPast = scrollProgress >= dotPosition
  
  const animationValues = useMemo(() => ({
    scale: isScrolledPast ? 1.4 : 1,
    backgroundColor: isScrolledPast ? "#ffffff" : "#6b7280",
    borderColor: isScrolledPast ? "#ffffff" : "#9ca3af",
  }), [isScrolledPast])

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-gray-500 z-30"
      animate={animationValues}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      style={{
        width: "20px",
        height: "20px",
        willChange: "transform, background-color, border-color",
      }}
    />
  )
})

// ========================================
// TIMELINE CARD COMPONENT
// ========================================

interface TimelineCardProps {
  item: TimelineItem
  index: number
  totalItems: number
}

const TimelineCard = React.memo(function TimelineCard({ item, index, totalItems }: TimelineCardProps) {
  const ref = useRef(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // 🔄 FIXED: Changed 'threshold' to 'amount'
  const isInView = useInView(ref, { 
    amount: 0.3,  // 🔄 FIXED: 'threshold' → 'amount'
    once: true
  })

  const side = useMemo(() => getSideForIndex(index), [index])
  const isLeft = side === "left"

  const mouseMoveTimeoutRef = useRef<number>()
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseMoveTimeoutRef.current) {
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
  }, [])

  const handleMouseEnter = useCallback(() => setIsExpanded(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsExpanded(false)
    if (mouseMoveTimeoutRef.current) {
      cancelAnimationFrame(mouseMoveTimeoutRef.current)
    }
  }, [])

  const cardAnimation = useMemo(() => ({
    width: isExpanded ? "650px" : "450px",
    height: isExpanded ? "auto" : "350px",
    borderColor: isExpanded ? "#ffffff" : "#6b7280",
    boxShadow: isExpanded 
      ? "0 0 30px rgba(255, 255, 255, 0.3)" 
      : "0 2px 8px rgba(0, 0, 0, 0.1)",
  }), [isExpanded])

  const spotlightStyle = useMemo(() => ({
    background: `radial-gradient(circle 600px at ${mousePosition.x}px ${mousePosition.y}px, 
      rgba(255,255,255,0.15) 0%, 
      rgba(255,255,255,0.08) 25%, 
      rgba(255,255,255,0) 60%)`,
  }), [mousePosition.x, mousePosition.y])

  if ((isLeft && index % 2 === 0) || (!isLeft && index % 2 === 1)) {
    return (
      <motion.div className="relative h-screen flex">
        <div className="w-1/2"></div>
        <div className="w-1/2"></div>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className="relative h-screen flex"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={`w-1/2 flex items-center justify-center relative ${!isLeft ? 'order-last' : ''}`}>
        <motion.div
          ref={cardRef}
          className="cursor-pointer"
          initial={{ x: isLeft ? -50 : 50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { x: isLeft ? -50 : 50, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="relative bg-neutral-950 border border-gray-600 rounded-xl overflow-hidden"
            animate={cardAnimation}
            transition={{ 
              duration: 0.5, 
              ease: "easeInOut"
            }}
            style={{
              transformOrigin: "center center",
              willChange: 'width, height, border-color, box-shadow'
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-500 ease-out"
              style={{
                ...spotlightStyle,
                willChange: 'background'
              }}
            />

            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_70%)]" />
            
            <div className="relative z-20 p-8">
              <div className="space-y-5">
                <div className="text-base text-neutral-400 font-medium uppercase tracking-wider">
                  {item.tagline}
                </div>
                <h3 className="text-2xl font-bold text-white leading-tight">
                  {item.heading}
                </h3>
                <p className="text-base text-neutral-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: isExpanded ? 1 : 0,
                  height: isExpanded ? "auto" : 0,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
                style={{ willChange: 'height, opacity' }}
              >
                <div className="space-y-6 border-t border-neutral-700 pt-6 mt-6">
                  <div className="space-y-4">
                    <h4 className="text-base text-white font-semibold">Details:</h4>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                  
                  {item.skills && (
                    <div className="space-y-4">
                      <h4 className="text-base text-white font-semibold">Technologies:</h4>
                      <div className="flex flex-wrap gap-3">
                        {item.skills.map((skill, skillIndex) => (
                          <motion.span
                            key={skill}
                            className="px-3 py-2 bg-neutral-800 text-neutral-300 text-sm rounded-full border border-neutral-700"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: skillIndex * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            style={{ willChange: 'transform' }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Fixed Details Button with Link */}
                  <Button 
                    variant="outline" 
                    size="default"
                    className="bg-transparent border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-500 transition-colors text-base"
                    onClick={() => {
                      if (item.link) {
                        window.open(item.link, '_blank', 'noopener,noreferrer')
                      }
                    }}
                    disabled={!item.link}
                  >
                    {item.link ? 'View Project' : 'Details'}
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <div className={`w-1/2 ${isLeft ? 'order-last' : ''}`}></div>
    </motion.div>
  )
})

// ========================================
// MAIN EXPERIENCE COMPONENT
// ========================================

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const { lineStartPercent, lineEndPercent } = useMemo(() => {
    const totalScreens = timelineData.length
    return {
      lineStartPercent: (0.5 / totalScreens) * 100,
      lineEndPercent: ((totalScreens - 0.5) / totalScreens) * 100
    }
  }, [])

  const lineHeight = useTransform(scrollYProgress, [0, 1], [`${lineStartPercent}%`, `${lineEndPercent}%`])
  const coloredLineHeight = useTransform(scrollYProgress, [0, 1], ["0%", `${lineEndPercent - lineStartPercent}%`])

  const [currentScrollProgress, setCurrentScrollProgress] = useState(0)
  
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setCurrentScrollProgress(latest)
    })
    return unsubscribe
  }, [scrollYProgress])

  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
      <HomeDock />
      
      <div ref={containerRef} className="relative z-10">
        <div
          className="fixed left-1/2 transform -translate-x-1/2 w-0.5 bg-neutral-600 z-20"
          style={{
            top: `${lineStartPercent}vh`,
            height: `${lineEndPercent - lineStartPercent}vh`,
          }}
        />

        <motion.div
          className="fixed left-1/2 transform -translate-x-1/2 w-0.5 bg-white origin-top z-20"
          style={{
            height: coloredLineHeight,
            top: `${lineStartPercent}vh`,
            willChange: 'height'
          }}
        />

        {timelineData.map((item, index) => (
          <div
            key={`dot-${item.id}`}
            className="fixed left-1/2 z-30"
            style={{
              top: `${lineStartPercent + ((lineEndPercent - lineStartPercent) * (index + 0.5) / timelineData.length)}vh`,
            }}
          >
            <TimelineDot
              index={index}
              totalItems={timelineData.length}
              scrollProgress={currentScrollProgress}
            />
          </div>
        ))}

        <div>
          {timelineData.map((item, index) => (
            <TimelineCard 
              key={item.id} 
              item={item} 
              index={index} 
              totalItems={timelineData.length} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}
