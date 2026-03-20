import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import styled, { useTheme } from "styled-components";

// === Styled Components ===
const CursorWrapper = styled.div`
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
`;

const MainDot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
`;

const Ring = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border: 1.5px solid ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0.6;
`;

const Cursor = () => {
  const theme = useTheme();

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    const checkIsTouch = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(hover: none)").matches
      );
    };
    setIsTouchDevice(checkIsTouch());
  }, []);

  const mainDot = useRef(null);
  const ring = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // ========================================================
  // 1. 鼠标跟随逻辑 (RAF Loop)
  // ========================================================
  useEffect(() => {
    if (isTouchDevice) return; // 如果是触屏，不绑定事件，节约性能

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (mainDot.current) {
        gsap.set(mainDot.current, { x: e.clientX, y: e.clientY });
      }
    };

    document.addEventListener("mousemove", onMouseMove);

    const loop = () => {
      if (!ring.current) return;
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
  }, [isTouchDevice]);

  // ========================================================
  // 2. 状态动画逻辑
  // ========================================================
  useEffect(() => {
    const dot = mainDot.current;
    const r = ring.current;

    // ✅ 安全检查：如果因为 return null 导致 DOM 不存在，直接跳过 GSAP 动画，防止报错
    if (!dot || !r) return; 

    let targetDotState = {};
    let targetRingState = {};

    if (isClicked) {
      if (isHovered) {
        targetDotState = { scale: 0, opacity: 0 };
        targetRingState = {
          scale: 1.2,
          borderWidth: 0,
          backgroundColor: theme.colors.primary,
          opacity: 0.3,
        };
      } else {
        targetDotState = { scale: 0.8, opacity: 1 };
        targetRingState = {
          scale: 0.8,
          borderWidth: 1.5,
          backgroundColor: "transparent",
          opacity: 0.6,
        };
      }
    } else if (isHovered) {
      targetDotState = { scale: 0, opacity: 0 };
      targetRingState = {
        scale: 1.5,
        borderWidth: 0,
        backgroundColor: theme.colors.primary,
        opacity: 0.2,
      };
    } else {
      targetDotState = { scale: 1, opacity: 1 };
      targetRingState = {
        scale: 1,
        borderWidth: 1.5,
        backgroundColor: "transparent",
        opacity: 0.6,
      };
    }

    gsap.to(dot, { ...targetDotState, duration: 0.3, overwrite: true });
    gsap.to(r, { ...targetRingState, duration: 0.3, overwrite: true });
  }, [isHovered, isClicked, theme]);

  // ========================================================
  // 3. 事件委托逻辑
  // ========================================================
  useEffect(() => {
    if (isTouchDevice) return; // 触屏设备不监听这些

    const isInteractive = (target) => {
      const el = target.closest("a, button, input, textarea, .clickable-layer");
      return !!el;
    };

    const handleMouseOver = (e) => {
      if (isInteractive(e.target)) {
        setIsHovered(true);
        e.target.closest("a, button, input, textarea, .clickable-layer").style.cursor = "none";
      }
    };

    const handleMouseOut = (e) => {
      if (isInteractive(e.target)) {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

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
  }, [isTouchDevice]);

  // ✅ 核心修复：Early return 必须放在所有的 Hook 声明之后！
  if (isTouchDevice) {
    return null; 
  }

  return (
    <CursorWrapper>
      <Ring ref={ring} />
      <MainDot ref={mainDot} />
    </CursorWrapper>
  );
};

export default Cursor;