import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

const Cursor = () => {
  const cursorRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false); // 用于记录是否处于 hover 状态
  const [isClicked, setIsClicked] = useState(false); // 新增 isClicked 状态，防止动画冲突

  // 用于更新光标位置
  const moveCursor = (e) => {
    const cursor = cursorRef.current;
    const { clientX: x, clientY: y } = e;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  };

  // 用于鼠标悬停的动画效果
  const hoverCursor = () => {
    if (isClicked) return; // 如果正在点击状态，跳过 hover 动画
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

  // 用于鼠标离开的动画效果
  const unhoverCursor = () => {
    if (isClicked) return; // 如果正在点击状态，跳过 unhover 动画
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

  // 用于点击时的动画效果
  const mouseDown = () => {
    setIsClicked(true); // 设置点击状态为 true
    const cursor = cursorRef.current;
    gsap.to(cursor, {
      scale: isHovered ? 1.8 : 0.8, // 如果是悬停状态则保持悬停的大小，否则变大
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const mouseUp = () => {
    setIsClicked(false); // 恢复点击状态为 false
    const cursor = cursorRef.current;
    gsap.to(cursor, {
      scale: isHovered ? 2.2 : 1, // 如果是悬停状态则保持悬停的大小，否则回到普通大小
      duration: 0.2,
      ease: "power2.out",
    });
  };

  // 监听鼠标移动和悬停事件
  useEffect(() => {
    const cursor = cursorRef.current;
    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mousedown", mouseDown);
    document.addEventListener("mouseup", mouseUp);

    const interactiveElements = document.querySelectorAll("a, button");

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", hoverCursor);
      el.addEventListener("mouseleave", unhoverCursor);
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mousedown", mouseDown);
      document.removeEventListener("mouseup", mouseUp);
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
            fillOpacity: 0.57,
            strokeWidth: 8,
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
            strokeWidth: 8,
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
            strokeWidth: 8,
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
