'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';

// Disable SSR for Hero to prevent hydration mismatches
const Hero = dynamic(() => import('@/components/Hero'), {
  ssr: false,
  loading: () => (
    <section id="hero" className="min-h-screen w-full bg-[#1a1a1a] p-6 md:p-12 relative" style={{ paddingTop: '120px' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Loading placeholder for first card - matches SC logo card structure */}
          <div className="md:col-span-4 bg-[#F5F5F5] rounded-3xl p-4 aspect-square relative flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <div className="text-8xl md:text-9xl font-bold text-black tracking-tighter mb-2">SC</div>
              <div className="text-xs md:text-sm text-black/60 font-medium tracking-wider uppercase">Shreyas Chate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  ),
});

// Disable SSR for Navigation to prevent hydration mismatches with Framer Motion
const Navigation = dynamic(() => import('@/components/Navigation'), {
  ssr: false,
  loading: () => null, // Return null during loading to prevent hydration issues
});

// Lazy load heavy components with intersection observer for better performance
const About = dynamic(() => import('@/components/About'), { 
  ssr: false,
  loading: () => <div className="min-h-screen w-full bg-[#1a1a1a]" />
});
const Expertise = dynamic(() => import('@/components/Expertise'), { 
  ssr: false,
  loading: () => <div className="min-h-screen w-full bg-[#1a1a1a]" />
});
const Experience = dynamic(() => import('@/components/Experience'), { 
  ssr: false,
  loading: () => <div className="min-h-screen w-full bg-[#1a1a1a]" />
});
const Highlights = dynamic(() => import('@/components/Highlights'), { 
  ssr: false,
  loading: () => <div className="min-h-screen w-full bg-[#1a1a1a]" />
});
const Recognition = dynamic(() => import('@/components/Recognition'), { 
  ssr: false,
  loading: () => <div className="min-h-screen w-full bg-[#1a1a1a]" />
});
const Contact = dynamic(() => import('@/components/Contact'), { 
  ssr: false,
  loading: () => <div className="min-h-screen w-full bg-[#1a1a1a]" />
});
const AIWidget = dynamic(() => import('@/ai-widget'), { 
  ssr: false,
  loading: () => null
});

// Lazy load component wrapper with intersection observer
function LazySection({ children, id }: { children: React.ReactNode; id: string }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={ref} id={id}>
      {shouldLoad ? children : <div className="min-h-screen w-full bg-[#1a1a1a]" />}
    </div>
  );
}

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch - ensure client-side only
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track current section using Intersection Observer for accurate detection
  useEffect(() => {
    if (!mounted) return;

    const sectionMap: { [key: string]: number } = {
      'hero': 0,
      'about': 1,
      'expertise': 2,
      'experience': 3,
      'highlights': 4,
      'recognition': 5,
      'contact': 6,
    };

    // Function to find all section elements
    const findSections = () => {
      const sectionElements: { element: HTMLElement; index: number }[] = [];
      
      // Prioritize actual section elements over div wrappers
      const sections = document.querySelectorAll('section[id]');
      sections.forEach((section) => {
        const id = section.id;
        if (sectionMap[id] !== undefined) {
          sectionElements.push({ element: section as HTMLElement, index: sectionMap[id] });
        }
      });

      // If no sections found, check divs (for lazy loaded sections that haven't rendered their section yet)
      if (sectionElements.length < 7) {
        const divs = document.querySelectorAll('div[id]');
        divs.forEach((div) => {
          const id = div.id;
          if (sectionMap[id] !== undefined && !sectionElements.some(se => se.index === sectionMap[id])) {
            sectionElements.push({ element: div as HTMLElement, index: sectionMap[id] });
          }
        });
      }

      // Sort by index
      sectionElements.sort((a, b) => a.index - b.index);
      return sectionElements;
    };

    let sectionElements = findSections();
    const intersectingSections = new Map<number, number>();

    const updateActiveSection = () => {
      let activeIndex = 0;
      let maxRatio = 0;

      if (intersectingSections.size > 0) {
        // Find section with highest intersection ratio
        intersectingSections.forEach((ratio, index) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            activeIndex = index;
          }
        });
      } else {
        // Fallback: use scroll position to find active section
        const scrollPosition = window.scrollY + 200; // Offset for header
        let closestIndex = 0;
        let minDistance = Infinity;

        sectionElements.forEach(({ element, index }) => {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          
          // Check if scroll position is within this section
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            const distance = Math.abs(scrollPosition - (elementTop + elementBottom) / 2);
            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = index;
            }
          }
        });

        activeIndex = closestIndex;
        
        // If at top of page, always show hero
        if (window.scrollY < 200) {
          activeIndex = 0;
        }
      }

      setCurrentSection((prevSection) => {
        if (prevSection !== activeIndex) {
          return activeIndex;
        }
        return prevSection;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          const sectionIndex = sectionMap[sectionId];
          
          if (sectionIndex !== undefined) {
            if (entry.isIntersecting) {
              intersectingSections.set(sectionIndex, entry.intersectionRatio);
            } else {
              intersectingSections.delete(sectionIndex);
            }
          }
        });
        updateActiveSection();
      },
      {
        root: null,
        rootMargin: '-25% 0px -50% 0px', // Trigger when section is in upper portion of viewport
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
      }
    );

    // Observe all current sections
    sectionElements.forEach(({ element }) => {
      observer.observe(element);
    });

    // Initial check
    updateActiveSection();

    // Re-check sections periodically as they load (for lazy loaded sections)
    const checkInterval = setInterval(() => {
      const newSections = findSections();
      if (newSections.length > sectionElements.length) {
        // New sections found, observe them
        newSections.forEach(({ element, index }) => {
          if (!sectionElements.some(se => se.index === index)) {
            sectionElements.push({ element, index });
            observer.observe(element);
          }
        });
        sectionElements.sort((a, b) => a.index - b.index);
      }
      updateActiveSection();
    }, 500);

    // Also update on scroll as fallback
    const handleScroll = () => {
      updateActiveSection();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      clearInterval(checkInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mounted]);

  // Show loading state until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <main className="min-h-screen w-full relative bg-[#1a1a1a]">
        {/* Navigation will be null on server, so don't render it here */}
        <section id="hero" className="min-h-screen w-full bg-[#1a1a1a] p-6 md:p-12 relative" style={{ paddingTop: '120px' }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
              <div className="md:col-span-4 bg-[#F5F5F5] rounded-3xl p-4 aspect-square relative flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-8xl md:text-9xl font-bold text-black tracking-tighter mb-2">SC</div>
                  <div className="text-xs md:text-sm text-black/60 font-medium tracking-wider uppercase">Shreyas Chate</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full relative bg-[#1a1a1a]">
      <Navigation currentSection={currentSection} />
      
      {/* Hero Section - Load immediately */}
      <Hero />

      {/* Below-the-fold sections - Lazy loaded with intersection observer */}
      <LazySection id="about">
        <Suspense fallback={<div className="min-h-screen w-full bg-[#1a1a1a]" />}>
          <About />
        </Suspense>
      </LazySection>

      <LazySection id="expertise">
        <Suspense fallback={<div className="min-h-screen w-full bg-[#1a1a1a]" />}>
          <Expertise />
        </Suspense>
      </LazySection>

      <LazySection id="experience">
        <Suspense fallback={<div className="min-h-screen w-full bg-[#1a1a1a]" />}>
          <Experience />
        </Suspense>
      </LazySection>

      <LazySection id="highlights">
        <Suspense fallback={<div className="min-h-screen w-full bg-[#1a1a1a]" />}>
          <Highlights />
        </Suspense>
      </LazySection>

      <LazySection id="recognition">
        <Suspense fallback={<div className="min-h-screen w-full bg-[#1a1a1a]" />}>
          <Recognition />
        </Suspense>
      </LazySection>

      <LazySection id="contact">
        <Suspense fallback={<div className="min-h-screen w-full bg-[#1a1a1a]" />}>
          <Contact />
        </Suspense>
      </LazySection>

      {/* AI Widget - Floating Assistant - Lazy loaded */}
      <Suspense fallback={null}>
        <AIWidget />
      </Suspense>
    </main>
  );
}

