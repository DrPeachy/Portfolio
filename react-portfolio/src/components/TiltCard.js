import React, { useRef, useState } from 'react';
import styled from 'styled-components';

// === Styled Components ===

const CardContainer = styled.div`
  width: 100%;
  /* 这里可以控制卡片的宽高比，或者由内部图片撑开 */
  position: relative;
  perspective: 1000px; /* 3D 视差的关键 */
  z-index: 1;
`;

const CardBody = styled.div`
  position: relative;
  width: 100%;
  border-radius: 20px;
  overflow: hidden; /* 必须 hidden，否则扫光会溢出 */
  
  /* 玻璃质感边框 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  
  /* 阴影 */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
  
  /* 3D 变换设置 */
  transform-style: preserve-3d;
  transform: rotateX(0) rotateY(0);
  /* 默认有过渡，鼠标进入时通过 JS 移除过渡以实现实时跟随 */
  transition: transform 0.5s ease-out, box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 30px 60px -12px rgba(55, 152, 255, 0.3); /* 悬停时阴影变蓝 */
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  /* 图片稍微放大一点，防止倾斜时露出边缘，或者增强深度感 */
  transform: scale(1.05); 
  transition: transform 0.5s ease;
  
  ${CardBody}:hover & {
    transform: scale(1.1); /* 悬停时图片稍微放大 */
  }
`;

// 流光层 (Shine Effect)
const Shine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg, 
    rgba(255, 255, 255, 0) 0%, 
    rgba(255, 255, 255, 0) 40%, 
    rgba(255, 255, 255, 0.2) 50%, 
    rgba(255, 255, 255, 0) 60%, 
    rgba(255, 255, 255, 0) 100%
  );
  transform: translateX(-100%);
  transition: transform 0.6s;
  pointer-events: none; /* 让鼠标事件穿透 */
  z-index: 2;

  ${CardBody}:hover & {
    transform: translateX(100%); /* 悬停时扫光 */
    transition: transform 0.8s;
  }
`;

// === Component Logic ===

const TiltCard = ({ src, alt }) => {
  const cardRef = useRef(null);
  // 记录鼠标进入状态，用于切换 transition 属性
  // (进入时要关掉 transition 才能跟手，离开时要打开 transition 才能平滑复位)
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // 计算鼠标相对于卡片中心的坐标
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // 计算旋转角度 (除以系数控制灵敏度，数值越大旋转越小)
    // rotateY 控制左右倾斜 (鼠标在右，向右倾，即 Y 轴旋转)
    // rotateX 控制上下倾斜 (鼠标在下，向下倾，即 X 轴旋转负值)
    const rotateX = (mouseY / rect.height) * -15; 
    const rotateY = (mouseX / rect.width) * 15;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    // 进入时加一点延迟再清除 transition，防止突变，但为了响应快通常直接清除
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (cardRef.current) {
      // 复位
      cardRef.current.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    }
  };

  return (
    <CardContainer>
      <CardBody
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
            // 关键逻辑：hover 时移除 transition 以便实时跟手，不 hover 时加上 transition 实现平滑复位
            transition: isHovering ? 'none' : 'transform 0.5s ease-out, box-shadow 0.3s ease'
        }}
      >
        <StyledImage src={src} alt={alt} />
        <Shine />
      </CardBody>
    </CardContainer>
  );
};

export default TiltCard;