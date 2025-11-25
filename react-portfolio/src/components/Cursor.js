import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import styled, { useTheme } from "styled-components";

// === Styled Components ===

const CursorWrapper = styled.div`
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
`;

// 1. 核心小圆点
const MainDot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); 
`;

// 2. 跟随大圆圈
const Ring = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border: 1.5px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0.6;
`;

const Cursor = () => {
  const theme = useTheme();
  const mainDot = useRef(null);
  const ring = useRef(null);
  
  // 坐标记录
  const mousePos = useRef({ x: -100, y: -100 }); // 初始移出屏幕外
  const ringPos = useRef({ x: -100, y: -100 });

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // ========================================================
  // 1. 鼠标跟随逻辑 (RAF Loop)
  // ========================================================
  useEffect(() => {
    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      // Dot 立即跟随
      if (mainDot.current) {
        gsap.set(mainDot.current, { x: e.clientX, y: e.clientY });
      }
    };

    document.addEventListener("mousemove", onMouseMove);

    const loop = () => {
      if (!ring.current) return;
      // 弹性跟随算法
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;
      gsap.set(ring.current, { x: ringPos.current.x, y: ringPos.current.y });
      requestAnimationFrame(loop);
    };
    
    const rafId = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ========================================================
  // 2. 状态动画逻辑 (统一管理，避免冲突)
  // ========================================================
  useEffect(() => {
    const dot = mainDot.current;
    const r = ring.current;

    // 定义不同状态下的样式配置
    let targetDotState = {};
    let targetRingState = {};

    if (isClicked) {
      // === CLICK 状态 ===
      if (isHovered) {
        // 如果是在悬停时点击：保持半透明填充，稍微缩小
        targetDotState = { scale: 0, opacity: 0 };
        targetRingState = {
          scale: 1.2, // 比普通 Hover (1.5) 小一点，产生按压感
          borderWidth: 0,
          backgroundColor: theme.colors.primary,
          opacity: 0.3, // 点击时稍微加深一点
        };
      } else {
        // 普通点击：两个都缩小
        targetDotState = { scale: 0.8, opacity: 1 };
        targetRingState = {
          scale: 0.8,
          borderWidth: 1.5,
          backgroundColor: "transparent",
          opacity: 0.6,
        };
      }
    } else if (isHovered) {
      // === HOVER 状态 ===
      targetDotState = { scale: 0, opacity: 0 }; // 隐藏小圆点
      targetRingState = {
        scale: 1.5,
        borderWidth: 0,
        backgroundColor: theme.colors.primary,
        opacity: 0.2, // 变淡
      };
    } else {
      // === NORMAL 状态 ===
      targetDotState = { scale: 1, opacity: 1 };
      targetRingState = {
        scale: 1,
        borderWidth: 1.5,
        backgroundColor: "transparent",
        opacity: 0.6,
      };
    }

    // 统一执行动画，overwrite: true 确保之前的状态被完全覆盖
    gsap.to(dot, { ...targetDotState, duration: 0.3, overwrite: true });
    gsap.to(r, { ...targetRingState, duration: 0.3, overwrite: true });

  }, [isHovered, isClicked, theme]);

  // ========================================================
  // 3. 事件委托逻辑 (Event Delegation)
  // ========================================================
  useEffect(() => {
    // 检查元素是否可交互
    const isInteractive = (target) => {
      const el = target.closest("a, button, input, textarea, .clickable-layer");
      return !!el; // 如果找到了就返回 true
    };

    const handleMouseOver = (e) => {
      if (isInteractive(e.target)) {
        setIsHovered(true);
        // 可选：强制设置 CSS cursor 避免系统光标闪烁
        e.target.closest("a, button, input, textarea, .clickable-layer").style.cursor = 'none';
      }
    };

    const handleMouseOut = (e) => {
      if (isInteractive(e.target)) {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    // 监听 document 而不是 specific elements
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <CursorWrapper>
      <Ring ref={ring} />
      <MainDot ref={mainDot} />
    </CursorWrapper>
  );
};

export default Cursor;