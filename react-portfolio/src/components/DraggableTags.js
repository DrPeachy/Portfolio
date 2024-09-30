import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './DraggableTags.css';

const DraggableTags = ({ tags, colors, background, index, textureUrl = "", width = 500, height = 470, playLink = "#" }) => {
  const containerRef = useRef(null);
  const MINDISTANCE = 70;

  useEffect(() => {
    if (!containerRef.current) return;

    const groups = containerRef.current.querySelectorAll(`.blob-group-${index}`);
    groups.forEach((group, i) => {
      gsap.fromTo(
        group,
        {
          rotation: 0,
        },
        {
          rotation: gsap.utils.random(-30, 30),
          transformOrigin: `${gsap.utils.random(30, 70)}% ${gsap.utils.random(30, 70)}%`,
          duration: gsap.utils.random(8, 13),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        }
      );
    });
  }, [tags, index]);
  // Utility function to get a random offset for variability in placement
  const getRandomOffset = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Calculate grid positions for the circles
  const calculatePositions = (numItems, canvasWidth, canvasHeight, radius) => {
    const positions = [];
    const cols = Math.ceil(Math.sqrt(numItems));
    const rows = Math.ceil(numItems / cols);
    const xSpacing = canvasWidth / (cols + 1);
    const ySpacing = canvasHeight / (rows + 1);

    let index = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (index >= numItems) break;
        const cx = (col + 1) * xSpacing + getRandomOffset(-radius / 2, radius / 2);
        const cy = (row + 1) * ySpacing + getRandomOffset(-radius / 2, radius / 2);
        positions.push({ cx, cy });
        index++;
      }
    }
    return positions;
  };

  // Calculate positions for the circles
  const positions = calculatePositions(tags.length + 1, width, height, 65);

  // Utility function to get a random item from an array
  const getRandomItemFromArray = (array) => array[Math.floor(Math.random() * array.length)];

  //
  const onPlayClick = (e, link) => {
    e.preventDefault();
    console.log("Play clicked");
    window.open(link, '_blank');
  };

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
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" id={`loader-${index}`} width={width} height={height}

      >
        <defs>
          <filter id={'goo'}>
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="15" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10"
              result="goo"
            />
            <feBlend in2="goo" in="SourceGraphic" result="mix" />
          </filter>
          <linearGradient id={`MyGradient-${index}`}>
            <stop offset="0%" stopColor="#ebabff" />
            <stop offset="70%" stopColor="#3798ff" />
            <stop offset="100%" stopColor="#a8d2ff" />
          </linearGradient>
        </defs>
        <mask id={`maska-${index}`}>
          <g className="blobs">
            {tags.map((tag, i) => {
              // Determine circle radius based on tag length
              const radius = Math.max(55, Math.min(tag.length * 8, 80)); // Set radius between 20 and 80 based on tag length

              // Use pre-calculated positions
              const { cx, cy } = positions[i];

              const color = getRandomItemFromArray(colors);

              return (
                <g key={i} className={`blob-group-${index}`} style={{ transform: `translate(${cx}px, ${cy}px)` }}>
                  <circle
                    className="blob"
                    r={radius}
                    fill={color} // Random color from provided colors list
                  />
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="22"
                    fill="#ffffff"
                  >
                    {tag.length <= radius / 4 ? tag : tag.substring(0, radius / 4) + '...'}
                  </text>
                </g>
              );
            })}
            {/* Additional "play" button circle */}
            {(() => {
              // Calculate position for the "play" button that is not too close to other elements
              const { cx, cy } = positions[tags.length];

              return (
                <g
                  className={`blob-group-${index}-play`}
                  style={{ transform: `translate(${cx}px, ${cy}px)`, cursor: 'pointer', pointerEvents: 'auto' }}
                  onClick={onPlayClick}
                  key="play-button"
                >
                  <circle
                    className="blob-play"
                    r={60}
                    fill="#111111"
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    onClick={() => onPlayClick(playLink)}
                  />
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="22"
                    fill="#ffffff"
                  >
                    play
                  </text>
                </g>
              );
            })()}
          </g>
        </mask>
        <rect x="0" y="0"
          mask={`url(#maska-${index})`}
          fill={`url(#MyGradient-${index})`}
          width={width}
          height={height}
          style={{ pointerEvents: 'none' }}
        />

        {/* 添加透明的可点击图层 */}
        <g className="clickable-layer">
          {(() => {
            const { cx, cy } = positions[tags.length];

            return (
              <circle
                key="play-click-layer"
                cx={cx}
                cy={cy}
                r={60}
                fill="transparent"
                style={{ pointerEvents: 'auto' }}
                onClick={(e) => onPlayClick(e, playLink)}
              />
            );
          })()}
        </g>
      </svg>
    </div>
  );
};

export default DraggableTags;
