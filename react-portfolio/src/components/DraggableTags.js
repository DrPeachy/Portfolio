import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './DraggableTags.css';

const DraggableTags = ({ tags, colors, background, index, textureUrl = "", width = 500, height = 350 }) => {
  const containerRef = useRef(null);
  const MINDISTANCE = 80;
  let existingPoints = [];

  useEffect(() => {
    if (!containerRef.current) return;

    const groups = document.querySelectorAll(`.blob-group-${index}`);

    groups.forEach((group, i) => {
      const startRotation = i * 90;
      const endRotation = i * 90 + 360;

      gsap.fromTo(
        group,
        {
          attr: {
            transform: `rotate(${startRotation}) translate(8, 0.1) rotate(${-startRotation})`
          }
        },
        {
          duration: 4,
          attr: {
            transform: `rotate(${endRotation}) translate(8, 0.1) rotate(${-endRotation})`
          },
          ease: 'none',
          repeat: -1
        }
      );
    });
  }, [tags]);

  // Utility function to get a random number in a range
  const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Utility function to get a random item from an array
  const getRandomItemFromArray = (array) => array[Math.floor(Math.random() * array.length)];

  // Unility function to check if distance between two points is less than a given value
  const isClose = (x1, y1, x2, y2, distance) => Math.hypot(x2 - x1, y2 - y1) < distance;

  return (
    <div
      ref={containerRef}
      className="loading_cont"
      style={{
        background: background || 'transparent', // Use background prop or default to transparent
      }}
    >
      {textureUrl && (
        <div
          className="texture-overlay"
          style={{
            background: `url(${textureUrl}) repeat center center`,
          }}
        ></div>
      )}
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="loader">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in2="goo" in="SourceGraphic" result="mix" />
          </filter>
          <linearGradient id="MyGradient">
            <stop offset="5%" stopColor="#40204c" />
            <stop offset="40%" stopColor="#a3225c" />
            <stop offset="100%" stopColor="#e24926" />
          </linearGradient>
        </defs>
        <mask id="maska">
          <g className="blobs">
            {tags.map((tag, index) => {
              // Determine circle radius based on tag length
              const radius = Math.max(20, Math.min(tag.length * 8, 80)); // Set radius between 20 and 80 based on tag length

              // Calculate random positions within the container dimensions until far enough from existing points, adjusted by radius to keep circles inside
              let cx, cy;
              do {
                cx = getRandomInRange(radius, width - radius);
                cy = getRandomInRange(radius, height - radius);
              } while (existingPoints.some((point) => isClose(cx, cy, point.cx, point.cy, MINDISTANCE)));

              // Add new point to existing points
              existingPoints.push({ cx, cy });

              const color = getRandomItemFromArray(colors);

              return (
                <g key={index} className={`blob-group-${index}`} transform="rotate(0) translate(0, 0) rotate(0)">
                  <circle
                    className="blob"
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={color} // Random color from provided colors list
                  />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize={Math.min(radius / 2, 20)} // Font size relative to radius but with a max of 20
                    fill="#ffffff"
                    pointerEvents="none" // This ensures the text doesn't interfere with the circle's hover or click events
                  >
                    {tag.length <= radius / 4 ? tag : tag.substring(0, radius / 4) + '...'}
                  </text>
                </g>
              );
            })}
          </g>
        </mask>
        <rect x="0" y="0" mask="url(#maska)" fill="url(#MyGradient)" width={width} height={height} />
      </svg>
    </div>
  );
};

export default DraggableTags;
