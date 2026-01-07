'use client';

import { motion } from 'framer-motion';
import { Award, Trophy, CheckCircle } from 'lucide-react';

const awards = [
  {
    type: 'Award',
    title: 'Winner – Best Overall Hack',
    event: 'AEC+ Tech Innovate Hackathon 2025',
    description: 'AntHill CO₂ analysis platform combining LLM forecasting with action-ready dashboards for architecture teams.',
    icon: Trophy,
  },
  {
    type: 'Award',
    title: 'Best Research Paper',
    event: 'ICETEMS-2021',
    description: 'Electricity Theft Detection using smart meter data, machine learning, and visual analytics.',
    icon: Award,
  },
];

const certifications = [
  {
    category: 'ServiceNow Certifications',
    items: [
      'Certified System Administrator',
      'Certified Application Developer',
    ],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      'AWS Cloud Practitioner',
      'Azure AI-900',
      'Azure AI-102',
      'PagerDuty Certified DevOps Professional',
    ],
  },
  {
    category: 'Engineering',
    items: [
      'Certified Full-Stack React Native Developer',
      'GitHub Actions · CI/CD tooling',
      'Sentry observability',
    ],
  },
];

export default function Recognition() {
  return (
    <section id="recognition" className="min-h-screen w-full relative flex items-center" style={{ minWidth: '100vw' }}>
      <div className="w-full h-full flex flex-col px-8 md:px-16 relative z-10 py-20">
        {/* Section Number */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute top-8 left-8 md:left-16 text-sm font-medium text-white/50"
        >
          06 // 07
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
              RECOGNITION
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl">
              Awards, certifications, and milestones highlighting a career rooted in curiosity, experimentation, and reliable delivery.
            </p>
          </motion.div>

        {/* Awards Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-12 text-left tracking-tighter">AWARDS</h3>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-20">
            {awards.map((award, index) => {
              const colors = ['bg-[#FED7AA]', 'bg-[#E9D5FF]'];
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
                <div className="flex items-start gap-4 md:gap-6">
                  <award.icon className="w-10 h-10 md:w-12 md:h-12 text-black flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-black/70 mb-2 font-medium tracking-wider uppercase">{award.type}</div>
                    <h4 className="text-xl md:text-2xl font-bold mb-2 text-black">{award.title}</h4>
                    <div className="text-sm text-black/70 mb-3 md:mb-4">{award.event}</div>
                    <p className="text-sm md:text-base text-black/90 leading-relaxed">{award.description}</p>
                  </div>
                </div>
              </motion.div>
            );
            })}
          </div>
        </motion.div>

        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-12 text-left tracking-tighter">CERTIFICATIONS</h3>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {certifications.map((cert, index) => {
              const colors = ['bg-[#DBEAFE]', 'bg-[#A7F3D0]', 'bg-[#BFDBFE]'];
              const color = colors[index % colors.length];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${color} rounded-3xl p-6 md:p-8 hover:scale-[1.02] transition-transform`}
                >
                  <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-black">{cert.category}</h4>
                  <ul className="space-y-2 md:space-y-3">
                    {cert.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-black">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-black mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
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

