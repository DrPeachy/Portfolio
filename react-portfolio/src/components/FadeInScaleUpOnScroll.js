import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FadeInScaleUpOnScroll = ({
  children,
  start = "top 85%", // 修改：当元素顶部到达屏幕 85% 处（即刚进入屏幕底部）就开始
  scaleStart = 0.9,  // 修改：0.8 有点太小了，0.9 更雅致
  scaleEnd = 1,
  duration = 0.6,    // 修改：稍微慢一点点，更有质感
  style = {},
}) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const element = sectionRef.current;

    // 核心修改：将 ScrollTrigger 直接集成到动画配置中
    // 这样不用手写 onUpdate 计算数学公式，GSAP 会自动处理
    const anim = gsap.fromTo(
      element,
      { 
        scale: scaleStart, 
        opacity: 0,
        y: 50 // 额外加餐：加一点点向上的位移，更有“浮现”的感觉
      }, 
      {
        scale: scaleEnd, 
        opacity: 1, 
        y: 0,
        duration: duration, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: start,      // 触发位置
          toggleActions: "play none none reverse", // 关键策略：进入播放，离开反向播放(可选)
          // play none none reverse 意思是：向下滚动看到时播放，向上滚动回去时倒放(变透明)
          // 如果你只想播放一次不消失，改成: "play none none none"
          markers: false, // 调试时设为 true
        }
      }
    );

    return () => {
      // 清理动画和触发器
      anim.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [start, duration, scaleStart, scaleEnd]);

  return (
    <div 
      ref={sectionRef} 
      className="fade-in-scale-up-section"
      style={{
        // 初始状态必须设为透明，防止 GSAP 加载前闪烁
        opacity: 0, 
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default FadeInScaleUpOnScroll;