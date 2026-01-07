'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Portfolio', href: '#hero', sectionIndex: 0, color: 'from-[#FEF9C3] to-[#DBEAFE]' },
  { name: 'About', href: '#about', sectionIndex: 1, color: 'from-[#DBEAFE] to-[#E9D5FF]' },
  { name: 'Expertise', href: '#expertise', sectionIndex: 2, color: 'from-[#E9D5FF] to-[#FED7AA]' },
  { name: 'Experience', href: '#experience', sectionIndex: 3, color: 'from-[#FED7AA] to-[#A7F3D0]' },
  { name: 'Projects', href: '#highlights', sectionIndex: 4, color: 'from-[#A7F3D0] to-[#FEF9C3]' },
  { name: 'Recognition', href: '#recognition', sectionIndex: 5, color: 'from-[#DBEAFE] to-[#E9D5FF]' },
  { name: 'Contact', href: '#contact', sectionIndex: 6, color: 'from-[#E9D5FF] to-[#FED7AA]' },
];

interface NavigationProps {
  currentSection: number;
}

export default function Navigation({ currentSection }: NavigationProps) {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  const scrollToSection = (sectionIndex: number) => {
    const sectionIds = ['hero', 'about', 'expertise', 'experience', 'highlights', 'recognition', 'contact'];
    const sectionId = sectionIds[sectionIndex];
    
    let targetElement: HTMLElement | null = null;
    
    if (sectionId) {
      targetElement = document.getElementById(sectionId);
    }
    
    if (!targetElement) {
      const allSections = document.querySelectorAll('section[id]');
      if (allSections[sectionIndex]) {
        targetElement = allSections[sectionIndex] as HTMLElement;
      }
    }
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      setTimeout(() => {
        const headerOffset = 100;
        const elementPosition = targetElement!.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  if (typeof window === 'undefined' || !mounted) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[9998] transition-all duration-300 pointer-events-auto py-3 md:py-4"
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div 
          className={`rounded-2xl px-4 md:px-6 py-3 md:py-4 transition-all duration-300 ${
            isScrolled 
              ? 'shadow-lg border border-white/15' 
              : 'shadow-md border border-white/8'
          }`}
          style={{
            background: isScrolled 
              ? 'rgba(26, 26, 26, 0.95)' 
              : 'rgba(26, 26, 26, 0.80)',
            backdropFilter: `blur(${isScrolled ? 20 : 12}px)`,
            WebkitBackdropFilter: `blur(${isScrolled ? 20 : 12}px)`,
          }}
        >
          <div className="flex items-center justify-between">
            {/* Minimal Logo - No background, no name */}
            <motion.a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(0);
              }}
              className="relative flex items-center cursor-pointer"
              style={{
                background: 'transparent',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span 
                className="text-2xl md:text-3xl font-bold text-white tracking-tighter"
                style={{
                  background: 'transparent',
                  backdropFilter: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                }}
              >
                SC
              </span>
            </motion.a>

            {/* Desktop Navigation - Minimal */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3">
              {navItems.map((item) => {
                const isActive = currentSection === item.sectionIndex;
                return (
                  <motion.button
                    key={item.name}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      scrollToSection(item.sectionIndex);
                    }}
                    className="relative px-4 py-2 text-sm font-medium transition-all rounded-lg pointer-events-auto cursor-pointer overflow-hidden"
                    style={{ pointerEvents: 'auto', zIndex: 9999 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Active state background - minimal */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavDesktop"
                        className={`absolute inset-0 rounded-lg bg-gradient-to-r ${item.color}`}
                        style={{ zIndex: -1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    
                    {/* Hover state - minimal */}
                    {!isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ zIndex: -1 }}
                      />
                    )}
                    
                    {/* Text */}
                    <span 
                      className={`relative z-10 transition-colors ${
                        isActive 
                          ? 'text-black font-semibold' 
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Tablet Navigation - Minimal */}
            <div className="hidden md:flex lg:hidden items-center gap-1.5">
              {navItems.slice(0, 5).map((item) => {
                const isActive = currentSection === item.sectionIndex;
                return (
                  <motion.button
                    key={item.name}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.sectionIndex);
                    }}
                    className={`relative px-3 py-1.5 text-xs rounded-lg transition-all ${
                      isActive 
                        ? `bg-gradient-to-r ${item.color} text-black font-semibold` 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.button>
                );
              })}
            </div>

            {/* Mobile Menu Button - Minimal */}
            <motion.button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu - Minimal */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9997] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel - Minimal */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-4 right-4 mt-2 rounded-2xl overflow-hidden shadow-xl z-[9999]"
              style={{
                background: 'rgba(26, 26, 26, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <div className="p-2">
                {navItems.map((item, index) => {
                  const isActive = currentSection === item.sectionIndex;
                  return (
                    <motion.button
                      key={item.name}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scrollToSection(item.sectionIndex);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`relative w-full text-left px-4 py-3 rounded-xl transition-all pointer-events-auto cursor-pointer mb-1 overflow-hidden ${
                        isActive 
                          ? 'text-black font-semibold' 
                          : 'text-white/80 hover:text-white'
                      }`}
                      style={{ 
                        pointerEvents: 'auto', 
                        zIndex: 10001,
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      {/* Active background */}
                      {isActive && (
                        <motion.div
                          layoutId="activeMobileNav"
                          className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color}`}
                          style={{ zIndex: -1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      
                      {/* Hover background */}
                      {!isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100"
                          style={{ zIndex: -1 }}
                        />
                      )}
                      
                      <span className="relative z-10 flex items-center gap-2">
                        <span className={`text-xs font-mono ${
                          isActive ? 'text-black/50' : 'text-white/30'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1">{item.name}</span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
