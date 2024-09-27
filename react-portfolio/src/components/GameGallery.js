import React, { useRef, useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { gsap } from "gsap";

// 动态导入所有图片
const importAll = (r) => {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace('./', '')] = r(item);
  });
  return images;
};

// 导入文件夹中的所有图片 (jpg 和 png)
const images = importAll(require.context('../img/gameGallery', false, /\.(png|jpe?g)$/));

const GameGallery = () => {
  const containerRef = useRef(null);
  const [imageKeys, setImageKeys] = useState(Object.keys(images));

  useEffect(() => {
    const container = containerRef.current;

    // 获取容器的中心位置
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    // 计算每个图标的随机摆动中心
    const iconElements = document.querySelectorAll(".game-icon");
    const svgLines = document.querySelectorAll(".game-line"); // 获取 SVG 线元素
    const minRadius = 150; // 最小半径
    const maxRadius = 250; // 最大半径
    const angleRange = Math.PI / 20; // 每个图标摆动的角度范围 (正负角度)

    iconElements.forEach((icon, i) => {
      const initialAngle = (i / iconElements.length) * Math.PI * 2; // 每个图标的初始角度
      let currentAngle = initialAngle; // 初始化角度
      let currentRadius = gsap.utils.random(minRadius, maxRadius); // 随机初始半径
      let initialRadius = currentRadius; // 保存初始半径

      const initialX = Math.cos(currentAngle) * currentRadius;
      const initialY = Math.sin(currentAngle) * currentRadius;

      // 创建 Timeline
      const timeline = gsap.timeline();

      // 初始扩散动画
      timeline.fromTo(
        icon,
        { x: centerX, y: centerY, opacity: 0, scale: 0.5 },
        {
          x: centerX + initialX - 50,
          y: centerY + initialY - 50,
          opacity: 1,
          scale: 1,
          delay: i * 0.1,
          duration: 1.5,
          ease: "power3.out",
          onUpdate: function () {
            const progress = this.progress(); // 获取当前进度
            // 更新连线的终点位置
            svgLines[i].setAttribute("x2", centerX + initialX * progress);
            svgLines[i].setAttribute("y2", centerY + initialY * progress);
          },
        }
      );

      // GSAP sine-based 摆动效果，在扩散动画完成后开始
      timeline.to(icon, {
        duration: 20, // 控制摆动周期
        repeat: -1,
        ease: "power3.out", // 使用正弦函数进行摆动
        onUpdate: function () {
          // 使用 sine wave 模拟角度和半径的动态变化
          const time = this.progress(); // GSAP 的进度值
          // 注意：currentRadius 是从扩散后的半径开始的
          currentAngle = initialAngle + Math.sin(time * Math.PI * 2) * angleRange;
          currentRadius =  initialRadius + Math.sin(time * Math.PI * 2) * (maxRadius - minRadius) * 0.1; // 使 radius 在当前范围内浮动

          const newX = centerX + Math.cos(currentAngle) * currentRadius;
          const newY = centerY + Math.sin(currentAngle) * currentRadius;

          // 更新图标位置
          icon.style.transform = `translate(${newX - 50}px, ${newY - 50}px)`;

          // 更新连线的终点位置
          svgLines[i].setAttribute("x2", newX);
          svgLines[i].setAttribute("y2", newY);
        },
      });
    });
  }, [imageKeys]); // 在图片导入完成后执行

  return (
    <div ref={containerRef} className="game-gallery" style={{ position: "relative", width: "100%", height: "500px" }}>
      {/* SVG 画布，用于绘制中心点与图标的连线 */}
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        {imageKeys.map((_, index) => {
          return (
            <line
              key={index}
              x1="50%" y1="50%" // 中心点
              x2="50%" y2="50%" // 我们将在 useEffect 中更新 x2, y2
              className={`game-line line-${index}`} // 给连线加一个特定的类名，避免冲突
              stroke="black"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      {/* 中心点 */}
      <div
        className="center-point"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "5px",
          height: "5px",
          backgroundColor: "#000",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
        }}
      ></div>

      {/* 每个游戏图标，使用动态加载的图片 */}
      {imageKeys.map((imageKey, index) => (
        <div key={index} className="game-icon" style={{ position: "absolute", cursor: "pointer" }}>
          <div className="game-cover">
            <Image
              src={images[imageKey]}
              alt={`Game Cover ${index}`}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                border: "2px solid black",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameGallery;
