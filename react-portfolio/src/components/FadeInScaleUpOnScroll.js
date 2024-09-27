import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FadeInScaleUpOnScroll = ({ children, start = "top 20%", end = "bottom top", scaleStart = 0.8, scaleEnd = 1, duration = 0.2 }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const element = sectionRef.current;

    // Initial animation when the component is loaded
    gsap.fromTo(
      element,
      { scale: scaleStart, opacity: 0 },
      { scale: scaleEnd, opacity: 1, duration: duration, ease: 'power3.out' }
    );

    // Create ScrollTrigger instance and store it in a variable
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: element,
      start: start, // Default: when top of section hits 80% of viewport height
      end: end,     // Default: when bottom of section hits top of viewport
      scrub: true,  // Smooth transition with scrolling
      markers: true,  // Enable markers for debugging
      onUpdate: (self) => {
        const progress = self.progress; // Progress is between 0 and 1
        gsap.to(element, {
          opacity: 1 - 1.5 * progress,
          scale: 1 - 0.25 * progress, // Shrinks and fades as you scroll
          ease: 'power2.out',
        });
      },
    });

    // Clean up ScrollTrigger instance when component unmounts
    return () => {
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill(); // Properly kill the specific instance
      }
    };
  }, [start, end, duration]);

  return (
    <div ref={sectionRef} className="fade-in-scale-up-section">
      {children}
    </div>
  );
};

export default FadeInScaleUpOnScroll;
