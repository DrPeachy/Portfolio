import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

const Cursor = () => {
  const cursorRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false); // For hover state
  const [isClicked, setIsClicked] = useState(false); // For click state
  const [isOutside, setIsOutside] = useState(false); // New state for detecting when cursor is outside the page

  // Update cursor position
  const moveCursor = (e) => {
    const cursor = cursorRef.current;
    const { clientX: x, clientY: y } = e;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  };

  // Handle cursor hover animations
  const hoverCursor = () => {
    if (isClicked) return; // Skip hover animation if clicked
    setIsHovered(true);
    const cursor = cursorRef.current;
    gsap.to(cursor, {
      scale: 2,
      rotate: 45,
      duration: 0.2,
      ease: "power2.out",
    });
    gsap.to("#cursor-ellipse", {
      fill: "rgb(55, 152, 255)",
      duration: 0.2,
      ease: "power2.out",
    });
    gsap.to("#cursor-line1", {
      attr: { y1: 175, y2: 225 },
      duration: 0.2,
      ease: "power2.out",
    });
    gsap.to("#cursor-line2", {
      attr: { x1: 225, x2: 175 },
      duration: 0.2,
      ease: "power2.out",
    });
  };

  // Handle cursor unhover animations
  const unhoverCursor = () => {
    if (isClicked) return; // Skip unhover animation if clicked
    setIsHovered(false);
    const cursor = cursorRef.current;
    gsap.to(cursor, {
      scale: 1,
      rotate: 0,
      duration: 0.2,
      ease: "power2.out",
    });
    gsap.to("#cursor-ellipse", {
      fill: "rgb(216, 216, 216)",
      duration: 0.2,
      ease: "power2.out",
    });
    gsap.to("#cursor-line1", {
      attr: { y1: 195.739, y2: 204.261 },
      duration: 0.2,
      ease: "power2.out",
    });
    gsap.to("#cursor-line2", {
      attr: { x1: 204.261, x2: 195.739 },
      duration: 0.2,
      ease: "power2.out",
    });
  };

  // Handle mouse down animations
  const mouseDown = () => {
    setIsClicked(true); // Set click state to true
    const cursor = cursorRef.current;
    gsap.to(cursor, {
      scale: isHovered ? 1.8 : 0.8, // If hovered, keep hover size, else shrink
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const mouseUp = () => {
    setIsClicked(false); // Reset click state
    const cursor = cursorRef.current;
    gsap.to(cursor, {
      scale: isHovered ? 2.2 : 1, // If hovered, return to hover size, else normal size
      duration: 0.2,
      ease: "power2.out",
    });
  };

  // Handle mouse leave (fade out)
  const mouseLeave = () => {
    setIsOutside(true); // Set outside state to true
    const cursor = cursorRef.current;
    gsap.to(cursor, {
      opacity: 0, // Fade out
      duration: 0.5,
      ease: "power2.out",
    });
  };

  // Handle mouse enter (fade in)
  const mouseEnter = () => {
    setIsOutside(false); // Reset outside state
    const cursor = cursorRef.current;
    gsap.to(cursor, {
      opacity: 1, // Fade in
      duration: 0.5,
      ease: "power2.out",
    });
  };

  // Add event listeners for mouse movement, click, and hover events
  useEffect(() => {
    const cursor = cursorRef.current;
    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mousedown", mouseDown);
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("mouseleave", mouseLeave); // Add mouse leave event
    document.addEventListener("mouseenter", mouseEnter); // Add mouse enter event
    // add mouse leave and enter for pdf
    document.querySelector("#resume-section")?.addEventListener("mouseenter", mouseLeave);
    document.querySelector("#resume-section")?.addEventListener("mouseleave", mouseEnter);

    const interactiveElements = document.querySelectorAll("a, button, .clickable-layer");

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", hoverCursor);
      el.addEventListener("mouseleave", unhoverCursor);
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mousedown", mouseDown);
      document.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("mouseleave", mouseLeave); // Remove mouse leave event
      document.removeEventListener("mouseenter", mouseEnter); // Remove mouse enter event
      // remove mouse leave for pdf
      document.querySelector("#resume-section")?.removeEventListener("mouseenter", mouseLeave);
      document.querySelector("#resume-section")?.removeEventListener("mouseleave", mouseEnter);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", hoverCursor);
        el.removeEventListener("mouseleave", unhoverCursor);
      });
    };
  }, [isHovered, isClicked]);

  return (
    <div id="cursor" className="cursor" ref={cursorRef}>
      <svg viewBox="140 140 120 120" xmlns="http://www.w3.org/2000/svg">
        <ellipse
          id="cursor-ellipse"
          style={{
            fill: "rgb(216, 216, 216)",
            stroke: "rgb(0, 0, 0)",
            fillOpacity: 0.3,
            strokeWidth: 6,
          }}
          cx="200"
          cy="200"
          rx="53.219"
          ry="53.219"
        />
        <line
          id="cursor-line1"
          style={{
            stroke: "rgb(0, 0, 0)",
            strokeLinecap: "round",
            strokeWidth: 5,
          }}
          x1="200"
          y1="195.739"
          x2="200"
          y2="204.261"
        />
        <line
          id="cursor-line2"
          style={{
            stroke: "rgb(0, 0, 0)",
            strokeLinecap: "round",
            strokeWidth: 5,
          }}
          x1="204.261"
          y1="200"
          x2="195.739"
          y2="200"
        />
      </svg>
    </div>
  );
};

export default Cursor;
