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
