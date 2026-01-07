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
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[9998] transition-all duration-300 pointer-events-auto py-4 md:py-5"
      style={{ 
        pointerEvents: 'auto',
      }}
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div 
          className={`rounded-3xl px-6 md:px-10 py-6 md:py-7 transition-all duration-500 ${
            isScrolled 
              ? 'shadow-2xl border border-white/20' 
              : 'shadow-lg border border-white/10'
          }`}
          style={{
            background: isScrolled 
              ? 'rgba(26, 26, 26, 0.98)' 
              : 'rgba(26, 26, 26, 0.85)',
            backdropFilter: `blur(${isScrolled ? 24 : 16}px)`,
            WebkitBackdropFilter: `blur(${isScrolled ? 24 : 16}px)`,
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo with enhanced styling */}
            <motion.a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(0);
              }}
              className="relative group flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FEF9C3] via-[#DBEAFE] to-[#E9D5FF] rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/10">
                  <span className="text-3xl md:text-4xl font-bold text-white tracking-tighter">SC</span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-base md:text-lg text-white/70 font-semibold">Shreyas Chate</div>
              </div>
            </motion.a>

            {/* Desktop Navigation - Enhanced */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
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
                    className="relative px-6 py-3.5 text-base font-medium transition-all rounded-xl pointer-events-auto cursor-pointer overflow-hidden group"
                    style={{ pointerEvents: 'auto', zIndex: 9999 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Active state background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavDesktop"
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color}`}
                        style={{ zIndex: -1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    
                    {/* Hover state */}
                    {!isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ zIndex: -1 }}
                      />
                    )}
                    
                    {/* Text with glow effect on active */}
                    <span 
                      className={`relative z-10 transition-all ${
                        isActive 
                          ? 'text-black font-bold drop-shadow-md' 
                          : 'text-white/70 group-hover:text-white font-medium'
                      }`}
                    >
                      {item.name}
                    </span>
                    
                    {/* Active indicator dot */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Tablet Navigation - Compact */}
            <div className="hidden md:flex lg:hidden items-center gap-2">
              {navItems.slice(0, 5).map((item) => {
                const isActive = currentSection === item.sectionIndex;
                return (
                  <motion.button
                    key={item.name}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.sectionIndex);
                    }}
                    className={`relative px-4 py-2.5 text-sm rounded-xl transition-all ${
                      isActive 
                        ? `bg-gradient-to-r ${item.color} text-black font-bold` 
                        : 'text-white/70 hover:text-white hover:bg-white/10 font-medium'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-white p-3 rounded-xl hover:bg-white/10 transition-colors relative group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FEF9C3] to-[#E9D5FF] rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity" />
              <div className="relative">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu - Enhanced */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9997] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.3
              }}
              className="md:hidden absolute top-full left-4 right-4 mt-3 rounded-3xl overflow-hidden shadow-2xl z-[9999]"
              style={{
                background: 'rgba(26, 26, 26, 0.98)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <div className="p-3">
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
                      className={`relative w-full text-left px-5 py-4 rounded-2xl transition-all pointer-events-auto cursor-pointer mb-1.5 overflow-hidden group ${
                        isActive 
                          ? 'text-black font-bold' 
                          : 'text-white/80 hover:text-white font-medium'
                      }`}
                      style={{ 
                        pointerEvents: 'auto', 
                        zIndex: 10001,
                      }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {/* Active background */}
                      {isActive && (
                        <motion.div
                          layoutId="activeMobileNav"
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color}`}
                          style={{ zIndex: -1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      
                      {/* Hover background */}
                      {!isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100"
                          style={{ zIndex: -1 }}
                        />
                      )}
                      
                      <span className="relative z-10 flex items-center gap-3">
                        <span className={`text-xs font-mono ${
                          isActive ? 'text-black/60' : 'text-white/40'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1">{item.name}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-2 h-2 bg-black rounded-full"
                          />
                        )}
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
