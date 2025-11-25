import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import styled from "styled-components";

// === Styled Components ===
const GalleryContainer = styled.div`
  position: relative;
  width: 100%;
  height: 600px; /* 给够高度，不然粒子会飞出去 */
  overflow: visible; /* 允许粒子稍微飞出边界一点点 */
  
  /* 移动端高度适配 */
  @media (max-width: 768px) {
    height: 400px;
  }
`;

const CenterPoint = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background-color: #3798ff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #3798ff; /* 加一点发光效果 */
  z-index: 10;
`;

const GameIcon = styled.div`
  position: absolute;
  cursor: pointer;
  z-index: 2;
  
  img {
    border-radius: 50%;
    border: 2px solid #1a1a1a; /* 改细一点的黑色边框，更有质感 */
    object-fit: cover;
    user-select: none;
    transition: transform 0.3s ease, border-color 0.3s ease;
    background: #fff; /* 防止透明图片透底 */
  }

  &:hover img {
    border-color: #3798ff; /* 悬停变色 */
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(55, 152, 255, 0.4);
  }
`;

// === Helper ===
const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => {
    images[item.replace('./', '')] = r(item);
  });
  return images;
};

const images = importAll(require.context('../img/gameGallery', false, /\.(png|jpe?g)$/));

const GameGallery = () => {
  const containerRef = useRef(null);
  const [imageKeys] = useState(Object.keys(images));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 核心优化：只查找当前组件内的元素，防止全局冲突
    const iconElements = container.querySelectorAll(".game-icon");
    const svgLines = container.querySelectorAll(".game-line");
    
    // 动态获取中心点（支持响应式）
    const updateCenter = () => {
      return { 
        x: container.offsetWidth / 2, 
        y: container.offsetHeight / 2 
      };
    };
    
    let { x: centerX, y: centerY } = updateCenter();

    // 动画配置参数
    const config = {
      short: { min: 80, max: 100 },
      long: { min: 170, max: 190 }, // 稍微调大了半径，显得更舒展
      angleRange: Math.PI / 36
    };

    iconElements.forEach((icon, i) => {
      // 逻辑优化：通过 index 决定长短，而不是外部变量
      const isLong = i % 2 === 0; 
      const radiusConfig = isLong ? config.long : config.short;
      const size = isLong ? 100 : 70; // 这里的 size 只用于动画计算逻辑

      const initialAngle = (i / iconElements.length) * Math.PI * 2;
      let currentAngle = initialAngle;
      let currentRadius = gsap.utils.random(radiusConfig.min, radiusConfig.max);
      let initialRadius = currentRadius;

      // 计算初始偏移量
      const initialX = Math.cos(currentAngle) * currentRadius;
      const initialY = Math.sin(currentAngle) * currentRadius;

      const timeline = gsap.timeline();

      // 1. 扩散入场动画
      timeline.fromTo(
        icon,
        { x: centerX, y: centerY, opacity: 0, scale: 0 },
        {
          x: centerX + initialX - size / 2, // 修正中心点偏移
          y: centerY + initialY - size / 2,
          opacity: 1,
          scale: 1,
          delay: i * 0.05, // 加快一点出场速度
          duration: 1.2,
          ease: "back.out(1.7)", // 加上回弹效果，更有动感
          onUpdate: function () {
             const progress = this.progress();
             // 保护性检查：确保 line 存在
             if (svgLines[i]) {
                svgLines[i].setAttribute("x2", centerX + initialX * progress);
                svgLines[i].setAttribute("y2", centerY + initialY * progress);
             }
          }
        }
      );

      // 2. 悬浮呼吸动画
      timeline.to(icon, {
        duration: gsap.utils.random(19, 21), // 随机化周期，看起来更自然
        repeat: -1,
        ease: "sine.inOut",
        onUpdate: function () {
          const time = this.progress();
          currentAngle = initialAngle + Math.sin(time * Math.PI * 2) * config.angleRange;
          currentRadius = initialRadius + Math.sin(time * Math.PI * 2) * 15;

          const newX = centerX + Math.cos(currentAngle) * currentRadius;
          const newY = centerY + Math.sin(currentAngle) * currentRadius;

          // 使用 transform 直接移动，性能更好
          icon.style.transform = `translate(${newX - size / 2}px, ${newY - size / 2}px)`;

          if (svgLines[i]) {
             svgLines[i].setAttribute("x2", newX);
             svgLines[i].setAttribute("y2", newY);
          }
        },
      });
    });

    // 清理动画，防止组件卸载后内存泄漏
    return () => {
      gsap.globalTimeline.clear(); 
    };
  }, [imageKeys]);

  return (
    <GalleryContainer ref={containerRef}>
      {/* SVG 连线层 */}
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: 'none' }}>
        {imageKeys.map((_, index) => (
          <line
            key={index}
            className={`game-line line-${index}`}
            x1="50%" y1="50%" 
            x2="50%" y2="50%"
            stroke="#3798ff"
            strokeWidth="1"
            strokeOpacity="0.4" // 让线稍微淡一点，不要抢了图片的风头
          />
        ))}
      </svg>

      <CenterPoint />

      {/* 图片层 */}
      {imageKeys.map((imageKey, index) => {
        const isLong = index % 2 === 0;
        const size = isLong ? 120 : 80; // 对应上面逻辑的大小

        return (
          <GameIcon 
            key={index} 
            className="game-icon"
            style={{ width: size, height: size }} // 设置容器大小
          >
            <img
              src={images[imageKey]}
              alt={`Game ${index}`}
              style={{ width: '100%', height: '100%' }} // 图片填满容器
            />
          </GameIcon>
        );
      })}
    </GalleryContainer>
  );
};

export default GameGallery;