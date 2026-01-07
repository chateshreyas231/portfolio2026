'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear status when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.project,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success
      setSubmitStatus({
        type: 'success',
        message: data.message || 'Your message has been sent successfully! I\'ll get back to you soon.',
      });
      setFormData({ name: '', email: '', project: '' });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: '' });
      }, 5000);

    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again or contact me directly at connect@shreyaschate.dev',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="min-h-screen w-full relative flex items-center" style={{ minWidth: '100vw' }}>
      <div className="w-full h-full flex flex-col px-8 md:px-16 relative z-10 py-20">
        {/* Section Number */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute top-8 left-8 md:left-16 text-sm font-medium text-white/50"
        >
          07 // 07
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
              CONTACT
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl">
              Portfolio walkthroughs, product collaborations, or simply exchanging ideas, my inbox is open.
            </p>
          </motion.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="space-y-4 md:space-y-6"
          >
            <div className="space-y-4 md:space-y-6">
              <div>
                <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-black/90 tracking-tighter">CONTACT</h4>
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-[#DBEAFE] rounded-3xl p-5 md:p-6 hover:scale-[1.02] transition-transform">
                    <div className="flex items-start gap-3 md:gap-4">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-black mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-base md:text-lg text-black mb-1">Chicago, Illinois</div>
                        <div className="text-xs md:text-sm text-black/70">open to hybrid & remote collaborations</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#A7F3D0] rounded-3xl p-5 md:p-6 hover:scale-[1.02] transition-transform">
                    <div className="flex items-start gap-3 md:gap-4">
                      <Mail className="w-5 h-5 md:w-6 md:h-6 text-black mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-black/70 mb-2 font-medium tracking-wider uppercase">Primary inbox</div>
                        <a href="mailto:connect@shreyaschate.dev" className="text-base md:text-lg font-bold text-black hover:underline">
                          connect@shreyaschate.dev
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#FEF9C3] rounded-3xl p-5 md:p-6">
                <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-black tracking-tighter">CONNECT</h4>
                <div className="flex gap-4 md:gap-6 mb-3 md:mb-4">
                  <motion.a
                    href="https://github.com/chateshreyas231"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-black hover:text-black/80 transition-colors font-medium tracking-wider uppercase"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    GitHub
                  </motion.a>
                  <span className="text-black/50">·</span>
                  <motion.a
                    href="https://www.linkedin.com/in/shreyas-chate/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-black hover:text-black/80 transition-colors font-medium tracking-wider uppercase"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    LinkedIn
                  </motion.a>
                </div>
                <p className="text-xs md:text-sm text-black/70">
                  Prefer async updates? I share build notes and system sketches on LinkedIn and GitHub projects.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="bg-[#E9D5FF] rounded-3xl p-6 md:p-8 relative z-10 pointer-events-auto hover:scale-[1.01] transition-transform"
          >
            <div className="space-y-6 relative z-10">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-black mb-2 pointer-events-none">
                  Your name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="How should I greet you?"
                  className="w-full px-4 py-3 border border-black/20 bg-white/80 rounded-xl text-black placeholder-black/50 focus:outline-none focus:border-black/40 focus:bg-white cursor-text pointer-events-auto relative z-10 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-black mb-2 pointer-events-none">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Where should I reply?"
                  className="w-full px-4 py-3 border border-black/20 bg-white/80 rounded-xl text-black placeholder-black/50 focus:outline-none focus:border-black/40 focus:bg-white cursor-text pointer-events-auto relative z-10 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="project" className="block text-sm font-semibold text-black mb-2 pointer-events-none">
                  Project or idea
                </label>
                <textarea
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  placeholder="Share the context, goals, or dream outcome…"
                  rows={6}
                  className="w-full px-4 py-3 border border-black/20 bg-white/80 rounded-xl text-black placeholder-black/50 focus:outline-none focus:border-black/40 focus:bg-white cursor-text pointer-events-auto relative z-10 transition-colors resize-none"
                  required
                />
              </div>
              {/* Status Message */}
              {submitStatus.type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 border border-black/20 rounded-xl flex items-center gap-3 ${
                    submitStatus.type === 'success'
                      ? 'bg-white/90 text-black'
                      : 'bg-white/90 text-black'
                  }`}
                >
                  {submitStatus.type === 'success' ? (
                    <CheckCircle2 size={20} className="flex-shrink-0 text-green-600" />
                  ) : (
                    <AlertCircle size={20} className="flex-shrink-0 text-red-600" />
                  )}
                  <p className="text-sm font-medium text-black">{submitStatus.message}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black py-4 px-6 font-semibold rounded-xl hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                style={{ color: '#ffffff', fontWeight: 600 }}
                whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                whileTap={!isSubmitting ? { scale: 0.99 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" style={{ color: '#ffffff' }} />
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>Sending...</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>Send Message</span>
                    <Send size={18} style={{ color: '#ffffff' }} />
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        </div>
        </div>
      </div>
    </section>
  );
}

