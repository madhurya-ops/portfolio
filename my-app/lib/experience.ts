export interface TimelineLink {
  label: "GitHub" | "Live" | "Details"
  url: string
}

export interface TimelineItem {
  id: string
  type: "work" | "project"
  tagline: string
  heading: string
  company?: string
  description: string
  details: string
  skills?: string[]
  links?: TimelineLink[]
  startDate: Date
  endDate: Date
}

export const timelineData: TimelineItem[] = ([
  {
    id: "5",
    type: "work",
    tagline: "June 2026 – Present",
    heading: "System Engineer",
    company: "Tata Consultancy Services, Bangalore",
    description: "Currently undergoing Initial Learning Program (ILP) training at Tata Consultancy Services (TCS), focused on Java, Spring Boot, Angular and Full-Stack Development. Gaining hands-on experience in designing and developing enterprise-grade applications, RESTful APIs, and backend services using modern software development practices.",
    details: "Collaborating on project-based assignments and real-world business scenarios provided by TCS, applying concepts such as object-oriented programming, database management, software engineering principles, and agile development methodologies. Continuously enhancing technical and problem-solving skills through practical implementation and team-based project work.",
    skills: ["Java", "Spring Boot", "Angular", "Full-Stack Development"],
    links: [{ label: "Details", url: "https://www.linkedin.com/in/madhurya-mishra/" }],
    startDate: new Date("2026-06-11"),
    endDate: new Date()
  },
  {
    id: "6",
    type: "project",
    tagline: "May 2026 – Present",
    heading: "Atlas",
    description: "Co-developed an AI-powered job search platform.",
    details: "Scrapes job postings, ranks them against your resume, tailors resumes, drafts outreach, and tracks applications.",
    skills: ["Next.js", "FastAPI", "Python", "Chrome Extension (MV3)", "LLMs"],
    links: [{ label: "GitHub", url: "https://github.com/ProjectAtlas-Job" }],
    startDate: new Date("2026-05-01"),
    endDate: new Date()
  },
  {
    id: "7",
    type: "project",
    tagline: "September 2026",
    heading: "StatusPilot",
    description: "Built an AI meeting-to-status-report generator that knows when it isn't sure — and asks instead of guessing.",
    details: "Developed a full-stack application using a React 19 + TypeScript frontend and a FastAPI backend deployed as serverless functions on Vercel. Implemented a hybrid two-model pipeline: a Groq-hosted LLM extracts candidate items from raw meeting transcripts and writes the narrative, while TypeSafe's Jev decision model returns typed judgments with calibrated probabilities on every item — category, severity, and client-safety. Engineered confidence-based routing so high-certainty items are auto-accepted and uncertain ones are routed to a human review queue. Built a deterministic anti-hallucination layer where RAID tables and action items are assembled in Python rather than parsed from model prose, every item must cite real transcript lines, and any owner not present in the source is nulled. Added a probability-gated client-safety filter that keeps internal remarks out of client-facing exports, with DOCX, XLSX and PDF generation, a mobile-first UI, and 244 automated tests. Measured 86% content coverage against a ground-truth key committed before any live run.",
    skills: ["React", "TypeScript", "Vite", "Tailwind CSS", "FastAPI", "Python", "Pydantic", "Groq", "LLM", "Generative AI", "TypeSafe Jev", "asyncio", "httpx", "REST API", "Vercel", "Serverless", "python-docx", "openpyxl", "fpdf2", "Pytest", "Vitest", "Playwright"],
    links: [{ label: "GitHub", url: "https://github.com/madhurya-ops/statuspilot" }],
    startDate: new Date("2026-09-01"),
    endDate: new Date("2026-09-30")
  },
  {
    id: "8",
    type: "project",
    tagline: "September 2026 – Present",
    heading: "SLA Desk",
    description: "An intelligent support desk where SLA clocks run themselves, breaches escalate automatically, and AI triages every ticket before a human reads it.",
    details: "Developed a full-stack IT service desk using an Angular frontend and a Spring Boot backend with PostgreSQL on Supabase. Built a timestamp-driven SLA engine that pauses clocks while tickets are on hold, and a scheduled monitor that flags at-risk tickets at 80% and auto-escalates breaches to the team lead. Integrated TypeSafe's Jev model to suggest priority and team, detect business impact and gauge customer frustration, with confidence thresholds and a safe fallback to manual triage. Implemented stateless JWT authentication with role-based access for Agents, Leads and Managers, optimistic locking to prevent conflicting updates, and a complete audit timeline of every human, system and AI action. Managed the schema through Flyway migrations, documented the API with Swagger/OpenAPI, and deployed with Docker on Render and Vercel.",
    skills: ["Angular", "TypeScript", "Angular Material", "Chart.js", "Java 25", "Spring Boot", "Spring Security", "JWT", "Spring Data JPA", "Hibernate", "PostgreSQL", "Supabase", "Flyway", "Swagger / OpenAPI", "JUnit", "Docker", "Render", "Vercel", "TypeSafe Jev", "Generative AI"],
    links: [
      { label: "GitHub", url: "https://github.com/madhurya-ops/sla-desk" },
      { label: "Live", url: "https://sla.madhuryamishra.in" }
    ],
    startDate: new Date("2026-09-02"),
    endDate: new Date()
  },
  {
    id: "1",
    type: "project",
    tagline: "June 2025 – August 2025",
    heading: "LegalDoc",
    description: "Engineered a comprehensive legal document processing application with AI-powered analysis capabilities and user authentication system.",
    details: "Developed a full-stack application using React frontend and FastAPI backend with PostgreSQL authentication. Implemented Generative AI (LLM) to extract key clauses, obligations, penalties, and dates from complex legal texts. Built complete authentication system with JWT tokens, password hashing using Bcrypt, and comprehensive input validation. Created Docker containerization for easy deployment and added comprehensive API documentation with automated testing capabilities.",
    skills: ["React", "FastAPI", "PostgreSQL", "LLM", "NLP", "JWT", "Bcrypt", "Docker", "Python", "Generative AI"],
    links: [{ label: "GitHub", url: "https://github.com/madhurya-ops/Legal-Document-Parser" }],
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-08-31")
  },
  {
    id: "2",
    type: "project",
    tagline: "April 2025",
    heading: "Stock Price LSTM Forecasting",
    description: "Engineered a 3-layer LSTM model (128-64-32 units) with dropout, batch normalization, and L2 regularization, achieving R² = 0.96.",
    details: "Trained on 5,000+ data points using EarlyStopping and learning rate scheduling, reducing validation loss by 70% and doubling convergence speed. Designed a time series pipeline with a 30-day lookback and MinMax scaling, improving model stability and reducing prediction variance by 15%. Visualized outputs with Matplotlib to track trends, enabling a 10% decrease in forecast deviation.",
    skills: ["Python", "LSTM", "Deep Learning", "Time Series", "Matplotlib", "Machine Learning"],
    links: [{ label: "GitHub", url: "https://github.com/madhurya-ops/Stock-Price-Prediction" }],
    startDate: new Date("2025-04-01"),
    endDate: new Date("2025-04-30")
  },
  {
    id: "3",
    type: "project",
    tagline: "Nov 2024",
    heading: "Bell's Palsy Severity Detection",
    description: "Engineered a ResNet50-based CNN to classify Bell's Palsy severity into 4 levels, achieving 98.79% accuracy for mouth analysis.",
    details: "Fine-tuned the last 20 layers of ResNet50 with transfer learning, optimizing training using Adam, cross-entropy loss, early stopping, and learning rate scheduling. Augmented 1,000+ images (from 14,000+) with rotation, zoom, flip, and shear to improve generalization and address class imbalance. Evaluated model performance using confusion matrices, precision, recall, F1-score, and ROC-AUC.",
    skills: ["Python", "ResNet50", "CNN", "Transfer Learning", "Computer Vision", "Deep Learning", "Machine Learning"],
    links: [{ label: "GitHub", url: "https://github.com/Chai-B/Bell-s-Palsy-Severity-Detection" }],
    startDate: new Date("2024-11-01"),
    endDate: new Date("2024-11-30")
  },
  {
    id: "4",
    type: "work",
    tagline: "May 2024 - July 2024",
    heading: "Software Engineer Intern",
    company: "Medblue Innovations, Lucknow",
    description: "Developed a Flutter-based mobile app for tracking vital nutrition metrics in preterm infants, revolutionizing neonatal care through enhanced data handling and advanced validation.",
    details: "Designed and deployed a cross-platform Flutter app for neonatal nutrition tracking, cutting manual effort by 60% and improving patient outcomes by 25%. Achieved 70% crash rate reduction and 30% faster load times through modular architecture and performance profiling.",
    skills: ["Flutter", "Firebase", "Hive", "Mobile App Development", "Performance Optimization", "Cross-Platform Testing", "Data Validation", "Healthcare Informatics"],
    links: [{ label: "Details", url: "https://drive.google.com/file/d/10PxxSBUCXdJxS07pkpzor3U2x-52hGta/view?usp=drive_link" }],
    startDate: new Date("2024-05-01"),
    endDate: new Date("2024-07-31")
  }
] satisfies TimelineItem[]).sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
