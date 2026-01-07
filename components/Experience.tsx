'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const experiences = [
  {
    period: 'Jul 2024 – Present',
    title: 'Chatbot & Conversational AI Engineer',
    company: 'Red River Technology (Capital Group)',
    location: 'Chicago, IL',
    technologies: ['ServiceNow', 'Amelia AI', 'LangChain', 'Analytics', 'Vector Database'],
    achievements: [
      'Built grounded RAG pipelines with LangChain and LangGraph, integrating vector retrieval and knowledge bases for accurate, context-aware responses.',
      'Integrated conversational AI with enterprise APIs, ServiceNow workflows, and governance dashboards for production deployment.',
      'Implemented evaluation harnesses with regression gates and monitoring pipelines, optimizing latency, cost, and reliability.',
      'Shipped full-stack UI and backend services with CI/CD, maintaining high uptime for enterprise-scale deployments.',
    ],
  },
  {
    period: 'Mar 2022 – Jun 2024',
    title: 'Information Technology Consultant',
    company: 'University of Wisconsin Milwaukee',
    location: 'Milwaukee, WI',
    technologies: ['Help Desk Ops', 'React', 'Azure', 'MariaDB'],
    achievements: [
      'Built production chatbot system with React and Node.js, integrating with Azure identity services and ServiceNow workflows for secure, scalable support automation.',
      'Designed knowledge base integrations and dialogue flows that enabled self-service for support inquiries, reducing ticket volume.',
      'Implemented evaluation and monitoring systems for chatbot performance, establishing best practices for AI-assisted support operations.',
    ],
  },
  {
    period: 'Aug 2021 – Aug 2022',
    title: 'Software Engineer',
    company: 'Volkswagen IT Services',
    location: 'Pune, India',
    technologies: ['React', 'Node.js', 'GraphQL', 'CI/CD','ServiceNow', 'AWS'],
    achievements: [
      'Built scalable React platforms and microservices with REST and GraphQL integrations, powering global operations.',
      'Optimized API integrations and asset delivery for improved performance and developer productivity.',
      'Established testing frameworks, CI/CD pipelines, and analytics dashboards for reliable production releases.',
    ],
  },
  {
    period: 'Sept 2019 – July 2021',
    title: 'Software Developer Intern/Co-op',
    company: 'VibrantMinds Technologies',
    location: 'Pune, India',
    technologies: ['React Native', 'React', 'Redux', 'Webpack', 'Animations', 'Testing'],
    achievements: [
      'Built cross-platform React Native applications with modern patterns, animations, and performance optimizations.',
      'Created responsive single-page applications using React best practices for maintainable, scalable code.',
      'Established testing frameworks and performance optimization practices for reliable production deployments.',
    ],
  },
];

const education = [
  {
    period: '2022 – 2024',
    degree: 'Masters of Science in Computer Science',
    school: 'University of Wisconsin Milwaukee',
    location: 'Milwaukee, WI, USA',
    details: 'GPA: 3.4/4',
    courses: [
      'COMPSCI 552G - Advanced Object-Oriented Programming',
      'COMPSCI 711 - Introduction to Machine Learning',
      'COMPSCI 720 - Computational Models Decision Making',
      'COMPSCI 723 - Natural Language Processing',
      'COMPSCI 725 - Robot Motion Planning',
      'COMPSCI 743 - Intelligent User Interfaces',
      'COMPSCI 790 - Advanced Topics in Computer Science (Introduction to Research Computing)',
      'COMPSCI 790 - Advanced Topics in Computer Science (Immersive Technologies and 3D User Interfaces)',
    ],
  },
  {
    period: '2015 – 2019',
    degree: 'Bachelors of Engineering in Information Technology',
    school: 'Savitribai Phule Pune University',
    location: 'Pune, India',
    details: 'GPA: 8.2/10',
    courses: [
      '110003 - Fundamentals of Programming',
      '214441 - Computer Organization and Architecture',
      '214442 - Computational Models Decision Making',
      '214445 - Problem Solving and Object Oriented Programming',
      '214452 - Data Structure and Files',
      '314441 - Theory of Computation',
      '314442 - Database Management Systems',
      '314452 - Design Analysis and Algorithm',
      '314453 - Cloud Computing',
      '314454 - Data Science and Big Data Analytics',
      '414453 - Information and Cybersecurity',
      '414454 - Machine Learning',
      '414455 - Software Design',
      '414456E - Business Analytics',
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="min-h-screen w-full relative flex items-center" style={{ minWidth: '100vw' }}>
      <div className="w-full h-full flex flex-col px-8 md:px-16 relative z-10 py-20">
        {/* Section Number */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute top-8 left-8 md:left-16 text-sm font-medium text-white/50"
        >
          04 // 07
        </motion.div>

        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="mb-20"
          >
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none tracking-tighter text-white">
              EXPERIENCE
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl">
              A journey through enterprise AI platforms, modern web technologies, and cloud infrastructure across Fortune 500 companies and innovative startups.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
            {experiences.map((exp, index) => {
              const colors = ['bg-[#E9D5FF]', 'bg-[#DBEAFE]', 'bg-[#FED7AA]', 'bg-[#A7F3D0]'];
              const color = colors[index % colors.length];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${color} rounded-3xl p-5 md:p-6 flex flex-col hover:scale-[1.02] transition-transform`}
                  style={{ 
                    width: '100%',
                    minHeight: '400px'
                  }}
                >
                <div className="text-xs text-black/70 mb-3 md:mb-4 font-medium tracking-wider uppercase">
                  {exp.period}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 leading-tight text-black">{exp.title}</h3>
                <div className="text-sm md:text-base text-black mb-2 font-medium">{exp.company}</div>
                <div className="text-xs md:text-sm text-black/70 mb-4 md:mb-6">{exp.location}</div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {exp.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 md:px-3 py-1 text-[10px] md:text-xs bg-white/50 rounded-full text-black font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
            })}
          </div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mt-20"
        >
          <h3 className="text-4xl md:text-5xl font-bold mb-12 text-left tracking-tighter">
            EDUCATION
          </h3>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {education.map((edu, index) => {
              const colors = ['bg-[#FEF9C3]', 'bg-[#BFDBFE]'];
              const color = colors[index % colors.length];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${color} rounded-3xl p-6 md:p-8 hover:scale-[1.02] transition-transform`}
                >
                <div className="text-xs text-black/70 mb-3 md:mb-4 font-medium tracking-wider uppercase">{edu.period}</div>
                <h4 className="text-xl md:text-2xl font-bold mb-2 text-black">{edu.degree}</h4>
                <div className="text-base md:text-lg text-black mb-2">{edu.school}</div>
                {edu.location && (
                  <div className="text-xs md:text-sm text-black/70 mb-3 md:mb-4 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {edu.location}
                  </div>
                )}
                <div className="text-xs md:text-sm text-black/80 mb-4 md:mb-6 font-semibold">{edu.details}</div>
                <div className="text-xs md:text-sm text-black/80">
                  <div className="font-bold mb-2 md:mb-3 text-black">Relevant Coursework:</div>
                  <ul className="space-y-1 md:space-y-2">
                    {edu.courses.map((course, courseIndex) => (
                      <li key={courseIndex} className="flex items-start gap-2">
                        <span className="text-black mt-1">—</span>
                        <span>{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
            })}
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
