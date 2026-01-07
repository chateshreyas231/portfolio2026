'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Portfolio', href: '#hero', sectionIndex: 0 },
  { name: 'About', href: '#about', sectionIndex: 1 },
  { name: 'Expertise', href: '#expertise', sectionIndex: 2 },
  { name: 'Experience', href: '#experience', sectionIndex: 3 },
  { name: 'Projects', href: '#highlights', sectionIndex: 4 },
  { name: 'Recognition', href: '#recognition', sectionIndex: 5 },
  { name: 'Contact', href: '#contact', sectionIndex: 6 },
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
    // Always scroll vertically to the section
    const sectionIds = ['hero', 'about', 'expertise', 'experience', 'highlights', 'recognition', 'contact'];
    const sectionId = sectionIds[sectionIndex];
    
    let targetElement: HTMLElement | null = null;
    
    if (sectionId) {
      // Find section by ID
      targetElement = document.getElementById(sectionId);
    }
    
    // Fallback: find by index if ID doesn't work
    if (!targetElement) {
      const allSections = document.querySelectorAll('section[id]');
      if (allSections[sectionIndex]) {
        targetElement = allSections[sectionIndex] as HTMLElement;
      }
    }
    
    if (targetElement) {
      const headerOffset = 100;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // Use scrollIntoView for smooth scrolling
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Also try window.scrollTo as fallback
      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    } else {
      console.warn(`Could not find section with index ${sectionIndex}`);
    }
  };

  // CRITICAL: Return null on server to prevent any hydration mismatch
  // This component should ONLY render on client due to ssr: false, but this is extra safety
  if (typeof window === 'undefined' || !mounted) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9998] transition-all duration-300 pointer-events-auto ${
        isScrolled ? 'border-b border-gray-800 py-4' : 'py-6'
      }`}
      style={{ 
        pointerEvents: 'auto',
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
      suppressHydrationWarning
    >
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center justify-between">
          <a
            href="#"
            className="text-2xl font-bold text-white flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span>SC</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => {
              const isActive = currentSection === item.sectionIndex;
              return (
                <button
                  key={item.name}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scrollToSection(item.sectionIndex);
                  }}
                  className={`text-sm font-medium transition-all relative px-2 py-1 pointer-events-auto cursor-pointer ${
                    isActive 
                      ? 'text-white font-bold' 
                      : 'text-white/70 hover:text-white'
                  }`}
                  style={{ pointerEvents: 'auto', zIndex: 9999 }}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-1 bg-white transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 rounded" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden bg-[#1a1a1a] border border-gray-800 mt-4 mx-6 overflow-hidden rounded-lg transition-all"
          style={{ zIndex: 10000 }}
        >
          {navItems.map((item) => {
            const isActive = currentSection === item.sectionIndex;
            return (
              <button
                key={item.name}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  scrollToSection(item.sectionIndex);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-6 py-3 transition-all pointer-events-auto cursor-pointer text-white ${
                  isActive 
                    ? 'font-bold bg-white/10 border-l-4 border-white shadow-sm' 
                    : 'hover:bg-white/5 hover:border-l-2 hover:border-white/30 border-l-2 border-transparent'
                }`}
                style={{ 
                  pointerEvents: 'auto', 
                  zIndex: 10001,
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff'
                }}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}

