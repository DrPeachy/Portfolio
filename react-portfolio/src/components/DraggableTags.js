import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { theme } from './theme';

// === Styled Components ===
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
  border-radius: 20px;
`;

const DraggableTags = ({ tags, colors, width = 500, height = 470, playLink = "#" }) => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const { t } = useTranslation();
  
  const blobsRef = useRef([]);
  const linesRef = useRef(null); // 用于绘制连线的 canvas 或者 SVG group

  // 初始化数据
  useEffect(() => {
    const newBlobs = tags.map((tag, i) => ({
      id: i,
      tag: tag,
      // 初始位置：分散在画布周围，而不是挤在中间
      x: Math.random() * width,
      y: Math.random() * height,
      // 初始速度：极慢，营造漂浮感
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      radius: Math.max(35, Math.min(tag.length * 7, 55)),
      color: colors[i % colors.length],
      phase: Math.random() * Math.PI * 2,
      opacity: 0, // 初始透明，用于入场动画
      scale: 0    // 初始缩小
    }));

    // Play 按钮 (核心节点)
    newBlobs.push({
      id: 'play',
      tag: t("game.play"),
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      radius: 50,
      color: '#1a1a1a',
      isPlay: true,
      phase: 0,
      opacity: 0,
      scale: 0
    });

    blobsRef.current = newBlobs;

    // 入场动画：一个个弹出来
    newBlobs.forEach((blob, i) => {
      gsap.to(blob, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: i * 0.1,
        ease: "back.out(1.7)",
        onUpdate: () => {
           // 这是一个 hack，为了让 gsap 更新 plain object 的属性也能触发 react 重绘？
           // 其实不需要，因为我们在下面的 RAF 里会读取这些值
        }
      });
    });

  }, [tags, width, height, colors, t]);

  // 物理引擎循环
  useEffect(() => {
    const svg = containerRef.current.querySelector('svg');
    const linesGroup = svg.querySelector('.lines-group');
    let animationFrameId;

    const update = () => {
      if (!blobsRef.current.length) return;

      // 清空连线
      while (linesGroup.firstChild) {
        linesGroup.removeChild(linesGroup.firstChild);
      }

      blobsRef.current.forEach((blob, i) => {
        // --- 1. 物理计算 ---
        
        // 基础漂浮 (Perlin Noise 替代品)
        blob.vx += Math.sin(Date.now() * 0.001 + blob.phase) * 0.002;
        blob.vy += Math.cos(Date.now() * 0.001 + blob.phase) * 0.002;

        // 边界力 (软边界)
        const margin = blob.radius + 10;
        if (blob.x < margin) blob.vx += 0.02;
        if (blob.x > width - margin) blob.vx -= 0.02;
        if (blob.y < margin) blob.vy += 0.02;
        if (blob.y > height - margin) blob.vy -= 0.02;

        // Play 按钮始终回归中心
        if (blob.isPlay) {
            blob.vx += (width / 2 - blob.x) * 0.005;
            blob.vy += (height / 2 - blob.y) * 0.005;
        }

        // 鼠标交互 (平滑吸引)
        const dx = mousePos.x - blob.x;
        const dy = mousePos.y - blob.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 250; // 感应半径

        if (dist < maxDist) {
          // 距离越近，吸力越强，但设有上限防止抽搐
          const force = (maxDist - dist) / maxDist; 
          blob.vx += dx * force * 0.0005; 
          blob.vy += dy * force * 0.0005;
        }

        // 互斥力 (碰撞避免)
        blobsRef.current.forEach((other, j) => {
          if (i === j) return;
          const idx = blob.x - other.x;
          const idy = blob.y - other.y;
          const idist = Math.sqrt(idx * idx + idy * idy);
          const minDist = blob.radius + other.radius + 5; // 留点缝隙

          if (idist < minDist) {
            const angle = Math.atan2(idy, idx);
            const tx = Math.cos(angle) * 0.05; 
            const ty = Math.sin(angle) * 0.05;
            blob.vx += tx;
            blob.vy += ty;
          } else if (idist < 150 && !blob.isPlay && !other.isPlay) {
             // --- 连线逻辑 ---
             // 如果两个普通 Tag 靠得近，画一条线
             const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
             line.setAttribute("x1", blob.x);
             line.setAttribute("y1", blob.y);
             line.setAttribute("x2", other.x);
             line.setAttribute("y2", other.y);
             // 距离越近线越明显
             const opacity = (150 - idist) / 150 * 0.2; 
             line.setAttribute("stroke", "#3798ff");
             line.setAttribute("stroke-width", "1");
             line.setAttribute("stroke-opacity", opacity);
             linesGroup.appendChild(line);
          }
        });

        // 阻力
        blob.vx *= 0.95;
        blob.vy *= 0.95;

        // 更新位置
        blob.x += blob.vx;
        blob.y += blob.vy;

        // --- 2. 渲染更新 ---
        const group = svg.getElementById(`blob-${blob.id}`);
        if (group) {
          // 使用 transform 移动 group
          group.setAttribute('transform', `translate(${blob.x}, ${blob.y}) scale(${blob.scale})`);
          group.style.opacity = blob.opacity;
          
          // 只有 Play 按钮有呼吸效果
          if (blob.isPlay) {
             const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.05;
             // 我们不能直接改 scale，因为上面用了 scale 属性做入场动画
             // 所以我们操作内部的特定元素，比如外圈
             const outerRing = group.querySelector('.play-pulse');
             if(outerRing) {
                 outerRing.setAttribute('transform', `scale(${pulse})`);
             }
          }
        }
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos, width, height]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  const onPlayClick = (link) => {
    window.open(link, '_blank');
  };

  return (
    <Container
      ref={containerRef}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        {/* 连线层在最下面 */}
        <g className="lines-group"></g>

        {/* 球体层 */}
        {blobsRef.current.map((blob) => (
          <g 
            key={blob.id} 
            id={`blob-${blob.id}`} 
            style={{ cursor: blob.isPlay ? 'pointer' : 'default' }}
            onClick={blob.isPlay ? () => onPlayClick(playLink) : undefined}
          >
            {/* 普通 Tag 样式 */}
            {!blob.isPlay && (
              <>
                <circle
                  r={blob.radius}
                  fill={theme.colors.bg}
                  stroke={theme.colors.primary}
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                <text
                  dy=".35em"
                  textAnchor="middle"
                  style={{
                    fontFamily: theme.fonts.medium,
                    fontSize: '14px',
                    fill: '#1a1a1a',
                    pointerEvents: 'none',
                    letterSpacing: '1px'
                  }}
                >
                  {blob.tag}
                </text>
              </>
            )}

            {/* Play 按钮样式 */}
            {blob.isPlay && (
              <>
                {/* 呼吸光环 */}
                <circle 
                    className="play-pulse"
                    r={blob.radius + 5} 
                    fill="none" 
                    stroke={theme.colors.primary}
                    strokeWidth="1" 
                    strokeOpacity="0.3"
                />
                {/* 核心实心圆 */}
                <circle
                  r={blob.radius}
                  fill="#1a1a1a"
                  stroke={theme.colors.primary}
                  strokeWidth="2"
                />
                <text
                  dy=".35em"
                  textAnchor="middle"
                  style={{
                    fontFamily: theme.fonts.bold,
                    fontSize: '18px',
                    fill: theme.colors.text.light,
                    pointerEvents: 'none',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                  }}
                >
                  {blob.tag}
                </text>
              </>
            )}
          </g>
        ))}
      </svg>
    </Container>
  );
};

export default DraggableTags;