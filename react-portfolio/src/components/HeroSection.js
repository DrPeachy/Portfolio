import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FadeInScaleUpOnScroll from './FadeInScaleUpOnScroll';

gsap.registerPlugin(ScrollTrigger); // Register ScrollTrigger with gsap

const HeroSection = () => {
  const heroRef = useRef(null);
  const headerRef = useRef(null);
  const subHeaderRef = useRef(null);
  const lineRef = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Hero section animations (initial load)
    tl.fromTo(
      heroRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
    );

    // Animate the main header text
    tl.fromTo(
      headerRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
      "-=1"
    );

    // Animate sub-header text
    tl.fromTo(
      subHeaderRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
      "-=1"
    );

    // Animate the line
    tl.fromTo(
      lineRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.out' },
      "-=0.8"
    );

    // Animate the paragraph text
    tl.fromTo(
      paragraphRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
      "-=0.5"
    );

    // ScrollTrigger to fade and scale out hero section on scroll
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top", // Start when the top of the hero hits the top of the viewport
      end: "bottom top", // End when the bottom of the hero hits the top of the viewport
      scrub: true, // Smooth animation linked to scroll progress
      onUpdate: (self) => {
        const progress = self.progress; // Progress is between 0 and 1
        gsap.to(heroRef.current, {
          opacity: 1 - progress,
          scale: 1 - 0.2 * progress, // Shrinks as it fades out
          ease: "power2.out",
        });
      },
    });

  }, []);

  return (
    <FadeInScaleUpOnScroll>
      <div className="section col-md-12" style={{ height: '90vh' }}>
        <div
          ref={heroRef}
          className="jumbotron jumbotron-fluid row flex-column justify-content-center align-items-center mx-1 my-2"
          id="hero-section"
          style={{ height: '80vh', backgroundColor: '#e8e8e8' }}
        >
          <h1
            ref={subHeaderRef}
            className="display-4 text-center sub-header"
          >
            Welcome to
          </h1>
          <h1
            ref={headerRef}
            className="display-1 text-center main-header"
          >
            Charles' Realm
          </h1>
          <hr
            ref={lineRef}
            className="my-4"
            style={{ width: '80%', transformOrigin: 'center' }}
          />
          <p
            ref={paragraphRef}
            className="lead text-center"
            style={{ fontSize: 'calc(1.2em + 1vw)' }}
          >
            Everything you need to know about <b>me</b>
          </p>
        </div>
      </div>
    </FadeInScaleUpOnScroll>
  );
};

export default HeroSection;
