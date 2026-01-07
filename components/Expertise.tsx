'use client';

import { motion } from 'framer-motion';
import { Brain, Code, Cloud, Wrench, Database, Cpu, Zap, Layers, GitBranch, Shield, Server } from 'lucide-react';

const expertiseAreas = [
  {
    icon: Brain,
    title: 'AI Platform Thinking',
    description: 'Link LLMs, knowledge bases, and business rules into cohesive experiences. ServiceNow, Amelia AI, LangChain, LangGraph, and RAG pipelines are part of my daily toolkit.',
    technologies: ['ServiceNow', 'LangChain', 'RAG', 'Amelia AI'],
  },
  {
    icon: Code,
    title: 'Design-led Engineering',
    description: 'React, React Native, Node.js, and TypeScript are my canvas. I choreograph UI, data, and automation so every conversation feels intentional and measurable.',
    technologies: ['React', 'TypeScript', 'Node.js', 'React Native'],
  },
  {
    icon: Cloud,
    title: 'Enterprise Reliability',
    description: 'CI/CD, observability, security, and governance travel with the work. From Capital Group to Volkswagen, I embed scale and trust into every release.',
    technologies: ['CI/CD', 'AWS', 'Azure', 'Security'],
  },
];

export default function Expertise() {
  return (
    <section id="expertise" className="min-h-screen w-full relative flex items-center" style={{ minWidth: '100vw' }}>
      <div className="w-full h-full flex flex-col px-8 md:px-16 relative z-10 py-20">
        {/* Section Number */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute top-8 left-8 md:left-16 text-sm font-medium text-white/50"
        >
          03 // 07
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
              EXPERTISE
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl">A comprehensive toolkit spanning AI platforms, modern web technologies, and cloud infrastructure.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-20">
            {[
              { area: expertiseAreas[0], color: 'bg-[#E9D5FF]' },
              { area: expertiseAreas[1], color: 'bg-[#DBEAFE]' },
              { area: expertiseAreas[2], color: 'bg-[#FED7AA]' },
            ].map(({ area, color }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${color} rounded-3xl p-6 md:p-8 hover:scale-[1.02] transition-transform`}
              >
                <area.icon className="w-10 h-10 md:w-12 md:h-12 text-black mb-4 md:mb-6" />
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-black">{area.title}</h3>
                <p className="text-sm md:text-base text-black/90 mb-4 md:mb-6 leading-relaxed">{area.description}</p>
                <div className="flex flex-wrap gap-2">
                  {area.technologies.map((tech, i) => (
                    <span key={i} className="px-2 md:px-3 py-1 text-xs bg-white/50 rounded-full text-black font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        {/* Technology Stack - Grouped Categories */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-12 text-left tracking-tighter text-white">TECHNOLOGY STACK</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {[
              { name: 'ServiceNow', icon: Server },
              { name: 'LangChain', icon: Brain },
              { name: 'LangGraph', icon: Layers },
              { name: 'OpenAI GPT', icon: Zap },
              { name: 'Amelia AI', icon: Brain },
              { name: 'React', icon: Code },
              { name: 'TypeScript', icon: Code },
              { name: 'Node.js', icon: Server },
              { name: 'React Native', icon: Code },
              { name: 'Python', icon: Cpu },
              { name: 'TensorFlow', icon: Brain },
              { name: 'AWS', icon: Cloud },
              { name: 'Azure', icon: Cloud },
              { name: 'GraphQL', icon: GitBranch },
              { name: 'Redux', icon: Layers },
              { name: 'MariaDB', icon: Database },
              { name: 'GitHub Actions', icon: GitBranch },
              { name: 'Jest', icon: Shield },
              { name: 'D3.js', icon: Code },
              { name: 'Hugging Face', icon: Brain },
              { name: 'PyTorch', icon: Brain },
              { name: 'OpenAI API', icon: Zap },
              { name: 'REST APIs', icon: GitBranch },
              { name: 'CI/CD', icon: GitBranch },
              { name: 'Docker', icon: Server },
              { name: 'Webpack', icon: Wrench },
            ].map((tech, index) => {
              // Different shades of white: pure white, bone white, yellow white, cream, ivory, pearl white, off-white
              const whiteShades = [
                'bg-white',           // Pure white
                'bg-[#FAF9F6]',       // Bone white
                'bg-[#FFFEF0]',       // Yellow white
                'bg-[#FFFDD0]',       // Cream
                'bg-[#FFFFF0]',       // Ivory
                'bg-[#F8F8FF]',       // Ghost white
                'bg-[#FDF5E6]',       // Old lace
                'bg-[#FFF8DC]',       // Cornsilk
                'bg-[#F5F5DC]',       // Beige
                'bg-[#FAF0E6]',       // Linen
              ];
              const bgColor = whiteShades[index % whiteShades.length];
              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className={`${bgColor} rounded-2xl p-3 md:p-4 flex flex-col items-center justify-center hover:scale-105 transition-all group cursor-pointer border border-black/5`}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <tech.icon className="w-6 h-6 md:w-8 md:h-8 text-black/80 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] md:text-xs font-medium text-black/80 text-center">{tech.name}</span>
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

