'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowUpRight, Github, Linkedin, Code, Brain, Zap, Server, Gamepad2, Video, BookOpen, ExternalLink, Map, Network, FileText, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { metrics } from '@/data/metrics';

// Lazy load PacmanGame component
const PacmanGame = dynamic(() => import('./PacmanGame'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-8"><div className="text-white">Loading game...</div></div>
});

// Tool icons with Lucide icons
const tools = [
  { name: 'ServiceNow', icon: Server, color: 'text-purple-600' },
  { name: 'LangChain', icon: Brain, color: 'text-blue-600' },
  { name: 'React', icon: Code, color: 'text-cyan-600' },
  { name: 'Python', icon: Zap, color: 'text-yellow-600' },
  { name: 'TypeScript', icon: Code, color: 'text-blue-500' },
];

const socialMedia = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/chateshreyas231' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/shreyas-chate/' },
];


export default function Hero() {
  const [emailCopied, setEmailCopied] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const welcomeShownRef = useRef(false);

  // Prevent body scroll and disable all interactions when game modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    let preventTabHandler: ((e: KeyboardEvent) => void) | null = null;
    
    if (showGameModal) {
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Disable all pointer events on body
      document.body.style.pointerEvents = 'none';
      
      // Add class to body to indicate game is open (for widget blur)
      document.body.classList.add('game-modal-open');
      
      // Disable keyboard navigation (Tab key)
      preventTabHandler = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          e.preventDefault();
        }
      };
      document.addEventListener('keydown', preventTabHandler);
    } else {
      // Re-enable everything
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.pointerEvents = '';
      document.body.classList.remove('game-modal-open');
    }
    
    return () => {
      // Cleanup on unmount
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.pointerEvents = '';
        document.body.classList.remove('game-modal-open');
        if (preventTabHandler) {
          document.removeEventListener('keydown', preventTabHandler);
        }
      }
    };
  }, [showGameModal]);

  useEffect(() => {
    // Show welcome message once when component mounts
    if (welcomeShownRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      setShowWelcomeMessage(true);
      welcomeShownRef.current = true;
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 5000);
    }, 1000); // Show after 1 second delay

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const copyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('connect@shreyaschate.dev');
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  return (
    <section id="hero" className="min-h-screen w-full bg-[#1a1a1a] p-6 md:p-12 relative" style={{ paddingTop: '120px' }}>
      {/* Section Number */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-8 left-8 md:left-16 text-sm font-medium text-gray-400 z-10"
      >
        01 // 07
      </motion.div>
      <div className="max-w-7xl mx-auto">
        {/* Card Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          
          {/* Row 1: Left - Profile Picture Card (SC) with Logo - 1st Position */}
          {/* CRITICAL: This card must ONLY contain the SC logo text - NO 3D models, NO images, NO conditional rendering */}
          <div
            className="md:col-span-4 bg-[#F5F5F5] rounded-3xl p-4 overflow-hidden aspect-square relative flex items-center justify-center"
            style={{ 
              position: 'relative', 
              zIndex: 1, 
              opacity: 1,
              isolation: 'isolate' // Create new stacking context to prevent any overlays
            }}
          >
            <div 
              className="w-full h-full rounded-2xl relative flex items-center justify-center" 
              style={{ 
                position: 'relative', 
                zIndex: 10,
                isolation: 'isolate'
              }}
            >
              {/* SC Logo - ALWAYS visible, NO conditional rendering, NO 3D models */}
              <div 
                className="flex flex-col items-center justify-center" 
                style={{ 
                  zIndex: 99999,
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  isolation: 'isolate',
                  pointerEvents: 'none' // Prevent any interactions that might trigger 3D models
                }}
              >
                <div 
                  className="text-8xl md:text-9xl font-bold tracking-tighter mb-2 select-none" 
                  style={{ 
                    color: '#000000',
                    textShadow: 'none',
                    opacity: 1,
                    visibility: 'visible',
                    display: 'block',
                    position: 'relative',
                    zIndex: 99999,
                    backgroundColor: 'transparent',
                    mixBlendMode: 'normal',
                    fontFamily: 'inherit',
                    lineHeight: '1'
                  }}
                >
                  SC
                </div>
                <div 
                  className="text-xs md:text-sm font-medium tracking-wider uppercase select-none" 
                  style={{ 
                    color: 'rgba(0, 0, 0, 0.6)',
                    textShadow: 'none',
                    opacity: 1,
                    visibility: 'visible',
                    display: 'block',
                    position: 'relative',
                    zIndex: 99999,
                    backgroundColor: 'transparent',
                    mixBlendMode: 'normal',
                    fontFamily: 'inherit'
                  }}
                >
                  Shreyas Chate
                </div>
              </div>
              
              {/* Welcome Message Popup */}
              <AnimatePresence>
                {showWelcomeMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-50 bg-black/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/20 min-w-[200px]"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-sm font-medium">Hello, how you doing? 👋</p>
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                      <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-black/90"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Row 1: Middle - Shreyas Chate Card (2nd Position) - Bigger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-5 bg-[#FED7AA] rounded-3xl p-6 md:p-8 relative group"
          >
            <div className="absolute top-4 right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={16} className="text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-3 md:mb-4 leading-tight">
              Conversational AI Engineer — LLMs, RAG, and agentic chatbots in production.
            </h1>
            <p className="text-base md:text-lg text-black/90 leading-relaxed mb-3">
              I build grounded, tool-using assistants that integrate with real systems and ship with evaluation, safety, and observability. My work spans enterprise environments (including ServiceNow) and cloud-native stacks.
            </p>
          </motion.div>

          {/* Row 1: Right - CTA Card (3rd Position) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-3 bg-[#FEF9C3] rounded-3xl p-6 md:p-8 flex flex-col justify-between relative group"
          >
            <div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-3 md:mb-4 leading-tight">
                Have an idea? Let&apos;s ship it.
              </h3>
            </div>
            <div className="mt-6">
              <button
                onClick={copyEmail}
                className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/70 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                <Mail size={16} />
                {emailCopied ? 'Copied!' : 'Copy email'}
              </button>
            </div>
            <div className="absolute bottom-4 right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={16} className="text-white" />
            </div>
          </motion.div>

          {/* Row 2: Left - Tools & Social (Stacked) */}
          <div className="md:col-span-4 flex flex-col gap-4">
            {/* Tools Card (Teal) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#A7F3D0] rounded-3xl p-6 flex items-center justify-center gap-3 flex-wrap"
            >
              {tools.map((tool, idx) => {
                const IconComponent = tool.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1" title={tool.name}>
                    <div className="w-12 h-12 bg-white/50 rounded-lg flex items-center justify-center">
                      <IconComponent size={24} className={tool.color} />
                    </div>
                    <span className="text-xs text-black/70 font-medium">{tool.name}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* Social Media Card (Blue) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#DBEAFE] rounded-3xl p-6 flex items-center justify-center gap-6"
            >
              {socialMedia.map((social, idx) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 hover:scale-110 transition-transform group"
                    title={social.name}
                  >
                    <div className="w-12 h-12 bg-white/50 rounded-lg flex items-center justify-center">
                      <IconComponent size={24} className="text-blue-600 group-hover:text-blue-800" />
                    </div>
                    <span className="text-xs text-black/70 font-medium">{social.name}</span>
                  </a>
                );
              })}
            </motion.div>
          </div>

          {/* Row 2: Right - AnythingAI.space Featured Project Card (4th Position) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-8 bg-[#E9D5FF] rounded-3xl p-6 md:p-8 flex flex-col justify-between relative group overflow-hidden"
          >
            <div className="absolute top-4 right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <ExternalLink size={16} className="text-white" />
            </div>
            
            <div className="relative z-10">
              <a
                href="https://anythingai.space"
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-4"
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={32} className="text-black" />
                  <div>
                    <div className="text-xs text-black/70 font-medium mb-1">Featured Project</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-black leading-tight hover:underline">
                      AnythingAI.space
                    </h3>
                  </div>
                </div>
              </a>
              
              <p className="text-black/80 text-sm md:text-base mb-4 leading-relaxed">
                Learn AI the right way—curated roadmaps, interactive mind maps, and production guides you can apply immediately.
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <a
                  href="https://anythingai.space/roadmaps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/50 rounded-lg p-2 flex items-center gap-2 hover:bg-white/70 transition-colors"
                >
                  <Map size={16} className="text-black" />
                  <span className="text-xs text-black font-medium">Roadmaps</span>
                </a>
                <a
                  href="https://anythingai.space/mindmaps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/50 rounded-lg p-2 flex items-center gap-2 hover:bg-white/70 transition-colors"
                >
                  <Network size={16} className="text-black" />
                  <span className="text-xs text-black font-medium">Mind Maps</span>
                </a>
                <a
                  href="https://anythingai.space/tutorials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/50 rounded-lg p-2 flex items-center gap-2 hover:bg-white/70 transition-colors"
                >
                  <FileText size={16} className="text-black" />
                  <span className="text-xs text-black font-medium">Tutorials / Production Guides</span>
                </a>
                <a
                  href="https://anythingai.space/architecture"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/50 rounded-lg p-2 flex items-center gap-2 hover:bg-white/70 transition-colors"
                >
                  <Code size={16} className="text-black" />
                  <span className="text-xs text-black font-medium">Production Guides</span>
                </a>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {['RAG', 'LLMs', 'Agents', 'MLOps'].map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-white/50 rounded-full text-black font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-black/70">
                <div className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-black" />
                  <span>Curated sources</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-black" />
                  <span>Quality checked</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-black/10 relative z-10">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-black/60">2024 - Present</span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/chateshreyas231/anythingai.space"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-black font-medium flex items-center gap-1 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github size={12} />
                    GitHub
                  </a>
                  <a
                    href="https://anythingai.space"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-black font-medium flex items-center gap-1 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit Site <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Row 3: Image Grid Card (Purple) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="md:col-span-4 bg-[#E9D5FF] rounded-3xl p-4 aspect-square"
          >
            <div className="grid grid-cols-2 gap-2 h-full">
              {[
                { title: 'Design', icon: '✏️' },
                { title: 'Ideation', icon: '💡' },
                { title: 'Media', icon: '🎬' },
                { title: 'UI/UX', icon: '🎨' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/50 rounded-xl flex flex-col items-center justify-center gap-2 p-4 hover:bg-white/70 transition-colors">
                  <div className="text-3xl">{item.icon}</div>
                  <div className="text-xs text-black/70 font-medium">{item.title}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Row 3: Game Tech Card (Orange) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="md:col-span-3 bg-[#FED7AA] rounded-3xl p-6 flex flex-col items-center justify-center gap-4 relative group"
          >
            <div className="absolute top-4 right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={16} className="text-white" />
            </div>
            <Gamepad2 size={48} className="text-black mb-2" />
            <h3 className="text-xl font-bold text-black text-center">Game Development</h3>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {['Unity 3D', 'C#', 'VR/AR', 'Oculus'].map((tech, idx) => (
                <span key={idx} className="px-3 py-1 text-xs bg-white/50 rounded-full text-black font-medium">
                  {tech}
                </span>
              ))}
            </div>
            <button
              onClick={() => setShowGameModal(true)}
              className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 border border-black/10"
            >
              <Gamepad2 size={20} />
              Play Pacman
            </button>
          </motion.div>

          {/* Row 3: Creative Tech Card (Purple) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="md:col-span-2 bg-[#E9D5FF] rounded-3xl p-6 flex flex-col items-center justify-center gap-4 relative group"
          >
            <div className="absolute top-4 right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={16} className="text-white" />
            </div>
            <Video size={40} className="text-black mb-2" />
            <h3 className="text-lg font-bold text-black text-center">Creative Tech</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Video', '3D', 'Motion'].map((tech, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-white/50 rounded-full text-black font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Row 3: Stats Card (Blue) - Quadrant Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="md:col-span-3 bg-[#BFDBFE] rounded-3xl p-4 md:p-6 relative group"
          >
            <div className="absolute top-4 right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <ArrowUpRight size={16} className="text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4 h-full">
              {/* Top Left Quadrant */}
              <div className="bg-white/60 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center border-2 border-white/80 hover:bg-white/80 transition-all">
                <div className="text-xl md:text-2xl font-bold text-black mb-2 leading-none">{metrics.employeesServed}</div>
                <div className="text-xs md:text-sm text-black/70 font-medium">Employees Served</div>
              </div>
              
              {/* Top Right Quadrant */}
              <div className="bg-white/60 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center border-2 border-white/80 hover:bg-white/80 transition-all">
                <div className="text-xl md:text-2xl font-bold text-black mb-2 leading-none">{metrics.intentRecognitionBoost}</div>
                <div className="text-xs md:text-sm text-black/70 font-medium">Intent Recognition Boost</div>
              </div>
              
              {/* Bottom Left Quadrant */}
              <div className="bg-white/60 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center border-2 border-white/80 hover:bg-white/80 transition-all">
                <div className="text-xl md:text-2xl font-bold text-black mb-2 leading-none">{metrics.yearsExperience}</div>
                <div className="text-xs md:text-sm text-black/70 font-medium">Experience</div>
              </div>
              
              {/* Bottom Right Quadrant */}
              <div className="bg-white/60 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center border-2 border-white/80 hover:bg-white/80 transition-all">
                <div className="text-xl md:text-2xl font-bold text-black mb-2 leading-none">{metrics.projectsCount}</div>
                <div className="text-xs md:text-sm text-black/70 font-medium">Projects</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Game Modal with Backdrop Blur */}
      <AnimatePresence>
        {showGameModal && (
          <>
            {/* Backdrop with blur - covers entire screen and blocks all interactions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[9998]"
              onClick={() => setShowGameModal(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowGameModal(false);
                }
              }}
              style={{ pointerEvents: 'auto' }}
              tabIndex={-1}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto' }}
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Gamepad2 size={24} className="md:w-8 md:h-8 text-black" />
                    <h2 className="text-lg md:text-2xl font-bold text-black">Pacman Game</h2>
                  </div>
                  <button
                    onClick={() => setShowGameModal(false)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    aria-label="Close"
                  >
                    <span className="text-2xl text-gray-600">×</span>
                  </button>
                </div>
                
                {/* Game Container */}
                <div className="flex-1 overflow-auto p-4 md:p-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="w-full max-w-md">
                    <PacmanGame />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
