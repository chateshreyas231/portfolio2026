'use client';

import { motion } from 'framer-motion';
import { Building2, GraduationCap, Car, Trophy, Users, Gamepad2, Image as ImageIcon, Film, Facebook, Twitter, ShoppingCart, Zap, TrendingUp, Vote, Shield, ExternalLink, Github, FileText, BookOpen } from 'lucide-react';
import { useState } from 'react';

const projects = [
  {
    id: 'all',
    label: 'All Projects',
  },
  {
    id: 'ai',
    label: 'AI & ML',
  },
  {
    id: 'frontend',
    label: 'Frontend',
  },
  {
    id: 'fullstack',
    label: 'Full Stack',
  },
];

const featuredProjects = [
  {
    id: 'anythingai-space',
    category: 'fullstack',
    featured: false,
    icon: BookOpen,
    period: '2024 - Present',
    company: 'Personal Project',
    title: 'AnythingAI.space - AI/ML Knowledge Hub',
    description: 'Learn AI the right way—curated roadmaps, interactive mind maps, and production guides you can apply immediately.',
    highlights: [
      'Built comprehensive knowledge hub with curated roadmaps and interactive mind maps.',
      'Implemented content validation system ensuring reliable, cited sources for all tutorials.',
      'Created production architecture guides with failure modes and observability patterns.',
      'Developed fast local search across all content with MDX-based content management.',
    ],
    technologies: ['Next.js', 'TypeScript', 'MDX', 'Firebase', 'Vercel', 'Content Validation', 'Search'],
    color: 'from-indigo-500 to-purple-500',
    github: 'https://github.com/chateshreyas231/anythingai.space',
    proves: 'Full-stack delivery + content systems',
  },
  {
    id: 'capital-group',
    category: 'ai',
    featured: true,
    icon: Building2,
    period: '2024 - Present',
    company: 'Red River Technology',
    title: 'Enterprise Conversational Platform',
    description: 'Led migration of 40,000+ employees to a production-grade conversational AI platform. Built RAG pipelines, agent orchestration, and evaluation systems that increased intent recognition by 35% and reduced ticket resolution time by 40%.',
    highlights: [
      '35% boost in accurate intent resolution through NLU & retrieval tuning.',
      'Unified live agent + virtual agent journeys with custom UI and governance dashboards.',
      'Automated release pipelines and observability for AI-assisted workflows.',
    ],
    technologies: ['ServiceNow', 'Amelia AI', 'LangChain', 'LangGraph', 'Now Assist', 'Analytics'],
    color: 'from-purple-500 to-pink-500',
    proves: 'RAG + agent orchestration + evaluation + enterprise integrations',
  },
  {
    id: 'uwm',
    category: 'fullstack',
    featured: true,
    icon: GraduationCap,
    period: '2022 - 2024',
    company: 'University of Wisconsin Milwaukee',
    title: 'UWM Helpdesk Intelligence Hub',
    description: 'Built a production chatbot system that handled 40% of student IT support inquiries. Integrated with Azure identity services and ServiceNow workflows to deliver secure, scalable support automation.',
    highlights: [
      'Replaced 40% of traditional ticket volume with conversational support.',
      'Mentored Level 1 consultants with playbooks, training loops, and QA dashboards.',
      'Partnered with Azure & identity teams to connect user data with secure escalation paths.',
    ],
    technologies: ['React', 'Node.js', 'MariaDB', 'Azure', 'ServiceNow'],
    color: 'from-blue-500 to-cyan-500',
    proves: 'Chatbot + integrations + full-stack UI',
  },
  {
    id: 'volkswagen',
    category: 'frontend',
    featured: true,
    icon: Car,
    period: '2021 - 2022',
    company: 'Volkswagen IT Services',
    title: 'Digital Operations Suite',
    description: 'Built scalable React platforms and microservices with REST and GraphQL integrations, powering global operations with optimized performance and reliable deployments.',
    highlights: [
      'Reusable design system accelerated feature delivery across product squads.',
      'REST & GraphQL integration with automation improved deployment reliability.',
      'Strategic media optimization improved asset load time by 30%.',
    ],
    technologies: ['React', 'Redux', 'Node.js', 'GraphQL', 'AWS S3', 'GitHub Actions'],
    color: 'from-green-500 to-emerald-500',
    proves: 'Full-stack delivery + integrations + performance',
  },
  {
    id: 'anthill',
    category: 'ai',
    featured: false,
    icon: Trophy,
    period: '2025',
    company: 'Chicago Innovate',
    title: 'AntHill CO₂ Intelligence · AEC+ Tech Hackathon Winner',
    description: 'Streamlit prototype for structural embodied carbon analysis on massing models. Interactive parametric design platform that analyzes and visualizes CO₂ emissions for architectural designs using ML-powered analytics.',
    highlights: [
      'End-to-end prototype in 24 hours combining real-time datasets, forecasting, and narrative visuals.',
      'Crafted UX flows that make sustainability metrics actionable for execs and project teams.',
      'Built 3D mesh visualization with color-coded embodied carbon analysis.',
    ],
    technologies: ['Python', 'Streamlit', 'LLMs', 'React', 'D3.js', 'AWS', 'Grasshopper', 'Rhinoceros'],
    color: 'from-orange-500 to-red-500',
    github: 'https://github.com/sardarchitect/anthill',
  },
  {
    id: 'circles',
    category: 'fullstack',
    featured: false,
    icon: Users,
    period: '2023',
    company: 'Academic Project',
    title: 'CIRCLES - Social Networking App',
    description: 'A Social networking app which makes you engage and connect with all the people you have met in your lifetime!',
    highlights: [
      'Built a complete social networking platform with real-time connections.',
      'Implemented user engagement features for lifetime connections.',
    ],
    technologies: ['React Native', 'Redux', 'Router', 'Expo-client', 'Node.js', 'TypeScript', 'AWS S3', 'RDS', 'Amplify', 'Cognito'],
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'angrybirds-vr',
    category: 'frontend',
    featured: false,
    icon: Gamepad2,
    period: '2022',
    company: 'Academic Project',
    title: 'AngryBirds VR',
    description: 'A Virtual Reality AngryBirds game using Unity 3D, Translational and Rotational movements, Locomotion technique and RayCasting ops.',
    highlights: [
      'Developed immersive VR experience with Unity 3D.',
      'Implemented translational and rotational movements with locomotion techniques.',
    ],
    technologies: ['Unity 3D', 'C# Scripts', 'Oculus Headset 2 Meta'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'image-processing-tomography',
    category: 'ai',
    featured: false,
    icon: ImageIcon,
    period: '2021',
    company: 'Research Project',
    title: 'Image Processing for Snapshot Projection Optical Tomography',
    description: 'Optimized the MATLAB Code for processing images used for background subtraction and median filter by writing code in C language. Reduced time consumption for processing 100,000 images.',
    highlights: [
      'Optimized image processing by converting MATLAB code to C language.',
      'Significantly reduced processing time for 100,000 images.',
      'Integrated C code back to MATLAB program seamlessly.',
    ],
    technologies: ['C', 'MATLAB', 'CIPS'],
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'bigscreen',
    category: 'frontend',
    featured: false,
    icon: Film,
    period: '2021',
    company: 'Personal Project',
    title: 'BigScreen - Movie App',
    description: 'A movie app which buffers and renders all the latest movies using TheMovieDB API.',
    highlights: [
      'Built a responsive movie browsing application.',
      'Integrated TheMovieDB API for latest movie data.',
    ],
    technologies: ['ReactJS', 'Router', 'Javascript', 'Firebase', 'OAuth', 'TheMovieDB API'],
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'fb-social-networking',
    category: 'fullstack',
    featured: false,
    icon: Facebook,
    period: '2021',
    company: 'Personal Project',
    title: 'FB Social Networking App',
    description: 'A social networking clone and a chat application with live status updates.',
    highlights: [
      'Built a complete social networking platform clone.',
      'Implemented real-time chat functionality.',
      'Added live status updates and news feed features.',
    ],
    technologies: ['ReactJS', 'Router', 'Javascript', 'Firebase', 'OAuth', 'Google User Auth', 'Facebook News Feed API', 'Live Status Updates'],
    color: 'from-blue-600 to-blue-400',
  },
  {
    id: 'twitter-sentiment-analysis',
    category: 'ai',
    featured: false,
    icon: Twitter,
    period: '2022',
    company: 'Data Science Project',
    title: 'Twitter Sentiment Analysis for Ukraine Russia War',
    description: 'This project detected sentiment for all twitter posts using latest kaggle dataset. Development done to get all the necessary EDA\'s based on location of the tweet to detect the type of sentiment and the location from which the particular tweet was posted.',
    highlights: [
      'Analyzed sentiment for Twitter posts using Kaggle dataset.',
      'Performed EDA based on tweet location and sentiment type.',
      'Detected sentiment patterns and geographic distribution.',
    ],
    technologies: ['Python', 'TensorFlow', 'Keras', 'NLP', 'Anaconda'],
    color: 'from-sky-500 to-blue-500',
  },
  {
    id: 'amazon-shopify',
    category: 'fullstack',
    featured: false,
    icon: ShoppingCart,
    period: '2021',
    company: 'Hobby Project',
    title: 'Amazon Shopify',
    description: 'A hobby project to build the Shopping Website integrating authentication, and payment methods using stripe.',
    highlights: [
      'Built complete e-commerce platform with authentication.',
      'Integrated Stripe payment API for secure transactions.',
      'Implemented real-time order history tracking.',
    ],
    technologies: ['ReactJS', 'User Authentication', 'Login', 'Logout', 'Product Cart', 'Firebase', 'Stripe Payment API', 'Real Time Order History'],
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'electricity-theft-detector',
    category: 'ai',
    featured: false,
    icon: Zap,
    period: '2021',
    company: 'Academic Project',
    title: 'Electricity Theft Detector',
    description: 'A system that detects theft by recognizing patterns according to seasons. The deployed model can send automatic e-mail notification to electricity provider admin if theft is detected at user\'s place.',
    highlights: [
      'Developed ML model to detect electricity theft patterns using XGBoost, CatBoost, and LightGBM.',
      'Implemented seasonal pattern recognition for accurate detection.',
      'Automated email notification system for theft alerts.',
      'Published research paper in International Journal of Engineering Research.',
    ],
    technologies: ['Anaconda', 'Spyder', 'Python Tkinter', 'Numpy', 'Pandas', 'Google Cloud Vision API', 'Matplotlib', 'Seaborn', 'SciKit Learn', 'Tensorflow', 'XGBoost', 'SARIMAX'],
    color: 'from-yellow-400 to-yellow-600',
    researchPapers: [
      { label: 'IJERCSE', url: 'https://ijercse.com/viewabstract.php?id=14834&volume=Volume8&issue=Issue8' },
      { label: 'Academia', url: 'https://www.academia.edu/145269798/Efficient_Power_Theft_Detection_Using_Smart_Meter_Data' },
      { label: 'ResearchGate', url: 'https://www.researchgate.net/publication/389279237_Efficient_Power_Theft_Detection_Using_Smart_Meter_Data' },
    ],
    images: [
      '/projects/electricity-theft-detector/dashboard.jpg',
      '/projects/electricity-theft-detector/results.jpg',
    ],
  },
  {
    id: 'google-stock-prediction',
    category: 'ai',
    featured: false,
    icon: TrendingUp,
    period: '2021',
    company: 'Data Science Project',
    title: 'Google Stock Price Prediction',
    description: 'A deep learning backend, in which I analyzed 5 yr. dataset for prediction of stock prices of current year.',
    highlights: [
      'Analyzed 5-year historical stock price dataset.',
      'Built deep learning model using RNN and LSTM.',
      'Created visualizations for stock price predictions.',
    ],
    technologies: ['Recurrent Neural Networks', 'LSTM', 'scikit-learn', 'MatPlotLib', 'Keras', 'TensorFlow', 'Training And Testing', 'Visualizations', 'Jupyter Notebook'],
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'election-winner-predictor',
    category: 'ai',
    featured: false,
    icon: Vote,
    period: '2021',
    company: 'Academic Project',
    title: 'Election Winner Predictor',
    description: 'An academic project where a model was deployed to predict the election winner following the trends and people\'s preferences along the years in past.',
    highlights: [
      'Developed predictive model for election outcomes.',
      'Analyzed historical trends and voter preferences.',
      'Created comprehensive data visualizations.',
    ],
    technologies: ['Jupyter Notebook', 'Python', 'Numpy', 'Pandas', 'MatplotLib', 'Seaborn', 'SciKit Learn'],
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'face-mask-detector',
    category: 'ai',
    featured: false,
    icon: Shield,
    period: '2021',
    company: 'Local Company Deployment',
    title: 'Face Mask Detector',
    description: 'A Face mask detector system implemented at a local company to detect if the face mask is ON for safety and security purpose at the location. A basic monitoring system for security guards.',
    highlights: [
      'Deployed face mask detection system for safety compliance.',
      'Implemented real-time monitoring for security purposes.',
      'Built monitoring dashboard for security guards.',
    ],
    technologies: ['Python', 'Numpy', 'Keras', 'Seaborn', 'Tensorflow', 'SciKit Learn'],
    color: 'from-teal-500 to-cyan-500',
  },
];

export default function Highlights() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = activeFilter === 'all'
    ? featuredProjects
    : featuredProjects.filter(project => project.category === activeFilter);

  return (
    <section id="highlights" className="min-h-screen w-full relative flex items-center" style={{ minWidth: '100vw' }}>
      <div className="w-full h-full flex flex-col px-8 md:px-16 relative z-10 py-20">
        {/* Section Number */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute top-8 left-8 md:left-16 text-sm font-medium text-white/50"
        >
          05 // 07
        </motion.div>

        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="mb-20"
          >
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none tracking-tighter text-white">
              PROJECTS
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl">
              Production-grade conversational AI systems, full-stack applications, and research projects delivered across enterprise and academic environments.
            </p>
          </motion.div>

        {/* Filter Buttons - Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-start gap-6 mb-16"
        >
          {projects.map((project) => (
            <motion.button
              key={project.id}
              onClick={() => setActiveFilter(project.id)}
              className={`text-sm font-medium transition-all tracking-wider uppercase ${
                activeFilter === project.id
                  ? 'text-white font-bold border-b-2 border-white/60 pb-1'
                  : 'text-white/60 hover:text-white/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {project.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid - Larger, more prominent */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {filteredProjects.map((project, index) => {
            // All cards are white with dark text
            const bgColor = 'bg-white';
            const textColor = 'text-black';
            const textSecondary = 'text-black/70';
            const borderColor = 'border-black/10';
            const techBg = 'bg-black/5';
            const techText = 'text-black';
            
            return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
              style={{ minHeight: '600px' }}
              whileHover={{ scale: 1.01 }}
            >
              <div className={`h-full flex flex-col rounded-3xl overflow-hidden ${bgColor} hover:scale-[1.01] transition-transform shadow-lg border ${borderColor}`}>
                <div className="p-6 md:p-8 h-full flex flex-col">
                  <div className="mb-4 md:mb-6">
                    {/* Icon/Logo */}
                    <div className="mb-4 flex items-center gap-3">
                      {project.icon && (
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${project.color} bg-opacity-10 flex-shrink-0`}>
                          {(() => {
                            const IconComponent = project.icon;
                            return <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-black" />;
                          })()}
                        </div>
                      )}
                      {project.featured && (
                        <span className={`text-xs font-medium ${textSecondary} tracking-wider uppercase`}>
                          Featured Project
                        </span>
                      )}
                    </div>
                    <div className={`text-xs ${textSecondary} mb-2 md:mb-3 font-medium tracking-wider`}>
                      {project.period} · {project.company}
                    </div>
                    <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 leading-tight ${textColor}`}>{project.title}</h3>
                    <p className={`text-sm md:text-base ${textSecondary} mb-3 md:mb-4 leading-relaxed`}>{project.description}</p>
                    {(project as any).proves && (
                      <p className={`text-xs md:text-sm ${textSecondary} mb-4 md:mb-6 italic font-medium`}>
                        This proves: {(project as any).proves}
                      </p>
                    )}
                  </div>
                
                  <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6 flex-grow">
                    {project.highlights.slice(0, 3).map((highlight, hIndex) => (
                      <li key={hIndex} className={`text-xs md:text-sm ${textColor} flex items-start gap-2`}>
                        <span className={`${textColor} mt-1 flex-shrink-0`}>—</span>
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                    {project.technologies.slice(0, 8).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className={`px-2 md:px-3 py-1 text-[10px] md:text-xs ${techBg} rounded-full ${techText} whitespace-nowrap font-medium`}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 8 && (
                      <span className={`px-2 md:px-3 py-1 text-[10px] md:text-xs ${techBg} rounded-full ${techText}`}>
                        +{project.technologies.length - 8}
                      </span>
                    )}
                  </div>
                
                  {/* Links Section */}
                  <div className={`flex flex-wrap gap-3 mt-auto pt-4 md:pt-6 border-t ${borderColor}`}>
                    {project.github && (
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 text-xs md:text-sm ${textColor} hover:opacity-70 transition-colors font-medium`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github size={14} className="md:w-4 md:h-4" />
                        GitHub
                        <ExternalLink size={12} className="md:w-3 md:h-3" />
                      </motion.a>
                    )}
                    {project.researchPapers && project.researchPapers.length > 0 && (
                      <>
                        {project.researchPapers.map((paper, paperIdx) => (
                          <motion.a
                            key={paperIdx}
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 text-xs md:text-sm ${textColor} hover:opacity-70 transition-colors font-medium`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FileText size={14} className="md:w-4 md:h-4" />
                            {paper.label}
                            <ExternalLink size={12} className="md:w-3 md:h-3" />
                          </motion.a>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}

