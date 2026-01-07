'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const coreCompetencies = [
  'I build LLM applications with careful prompt engineering, context design, and tool calling patterns',
  'I design and implement RAG pipelines—from intelligent chunking strategies to embedding optimization and vector retrieval',
  'I orchestrate AI agents using LangChain and LangGraph, creating reliable multi-step workflows',
  'I maintain quality through evaluation harnesses: offline test suites, regression gates, and human review loops',
  'I integrate with enterprise systems: REST/GraphQL APIs, workflow platforms, and business tools',
  'I deliver full-stack solutions using React, TypeScript, Node.js, and Python',
  'I have hands-on experience with ServiceNow Virtual Agent and NLU systems in production environments',
  'I ensure reliability through CI/CD pipelines, observability tooling, and monitoring systems',
];

export default function About() {
  return (
    <section id="about" className="min-h-screen w-full relative flex items-center" style={{ minWidth: '100vw' }}>
      <div className="w-full h-full flex flex-col px-8 md:px-16 relative z-10 py-20">
        {/* Section Number */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute top-8 left-8 md:left-16 text-sm font-medium text-white/50"
        >
          02 // 07
        </motion.div>

        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none tracking-tighter text-white">
              ABOUT
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-8">
              I bridge the gap between cutting-edge AI technology and real-world human needs, transforming complex systems into intuitive conversations.
            </p>
          </motion.div>

          {/* Core Competencies - Highlighted Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-12 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-6 md:p-8 border border-white/20 backdrop-blur-sm"
          >
            <div className="mb-4">
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">Core Competencies</h3>
              <p className="text-sm md:text-base text-white/70">What I bring to every project.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              {coreCompetencies.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0 mt-1" />
                  <p className="text-sm md:text-base text-white/90 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                I bridge the gap between cutting-edge AI technology and real-world human needs. My work at Capital Group transformed how 40,000+ employees interact with IT support, turning complex systems into intuitive conversations that actually solve problems.
              </p>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                What drives me? Seeing the moment when technology becomes invisible, when a chatbot understands context, when automation feels natural, when complex workflows become simple conversations.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                I've built this across Fortune 500 companies, universities, and startups, always with one goal: making technology work for people, not the other way around.
              </p>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                From architecting enterprise AI platforms to crafting elegant React systems, I combine deep technical expertise with a passion for user experience.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
