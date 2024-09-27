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
  let isLong = 1; // 是否使用长半径

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
    const minRadiusShort = 80;
    const maxRadiusShort = 90;
    const minRadiusLong = 160;
    const maxRadiusLong = 180;
    const angleRange = Math.PI / 36; // 每个图标摆动的角度范围 (正负角度)

    iconElements.forEach((icon, i) => {
      const initialAngle = (i / iconElements.length) * Math.PI * 2; // 每个图标的初始角度
      let currentAngle = initialAngle; // 初始化角度
      let currentRadius = isLong === 1 ? gsap.utils.random(minRadiusLong, maxRadiusLong) : gsap.utils.random(minRadiusShort, maxRadiusShort); // 随机初始半径
      const size = isLong === 1 ? 100 : 80; // 根据 isLong 决定图标的大小
      isLong *= -1; // 切换半径范围
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
          x: centerX + initialX - size / 2, // 使用动态大小的一半
          y: centerY + initialY - size / 2, // 使用动态大小的一半
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
          const radiusFactor = isLong === 1 ? 0.3 : 0.1; // 控制半径的浮动范围
          currentRadius = initialRadius + Math.sin(time * Math.PI * 2) * 20; // 使 radius 在当前范围内浮动

          const newX = centerX + Math.cos(currentAngle) * currentRadius;
          const newY = centerY + Math.sin(currentAngle) * currentRadius;

          // 更新图标位置
          icon.style.transform = `translate(${newX - size / 2}px, ${newY - size / 2}px)`; // 使用动态大小的一半

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
              stroke="#3798ff"
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
          backgroundColor: "#3798ff",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
        }}
      ></div>

      {/* 每个游戏图标，使用动态加载的图片 */}
      {imageKeys.map((imageKey, index) => {
        // 每次遍历时，交替改变isLong的值来控制图片的大小
        let size = isLong === 1 ? 100 : 80;
        isLong *= -1; // 切换isLong

        return (
          <div key={index} className="game-icon" style={{ position: "absolute", cursor: "pointer" }}>
            <div className="game-cover">
              <Image
                src={images[imageKey]}
                alt={`Game Cover ${index}`}
                style={{
                  width: `${size}px`, // 动态设置图片的大小
                  height: `${size}px`,
                  borderRadius: "50%",
                  border: "3px solid black",
                  userSelect: "none",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GameGallery;
