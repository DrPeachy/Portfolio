import React, { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import styled, { keyframes } from 'styled-components';

// ==============================================
// 🛠️ 配置区域
// ==============================================
const MIN_LOAD_TIME = 1000; 

// ==============================================
// 🎨 动画定义
// ==============================================

// 1. 流光动画：电光蓝 -> 浅蓝 -> 电光蓝
const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// 2. 脉冲放大：配合 Gotham 的力量感，做一个有力的心跳
const pulse = keyframes`
  0% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.02); filter: brightness(1.1); }
  100% { transform: scale(1); filter: brightness(1); }
`;

// ==============================================
// 💅 样式组件 (适配 Theme)
// ==============================================

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  
  /* 使用主题定义的背景色 (Concrete Gray) */
  /* 注意：为了无缝衔接，请确保你的 ThreeBackground 背景色最好也是这个，或者接近这个 */
  background-color: ${props => props.theme.colors.bg};
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  opacity: ${props => (props.$finished ? 0 : 1)};
  pointer-events: ${props => (props.$finished ? 'none' : 'auto')};
  transition: opacity 1s cubic-bezier(0.77, 0, 0.175, 1); /* 更利落的贝塞尔曲线 */
`;

// 巨大的数字 - 核心视觉点
const HugeNumber = styled.h1`
  /* 1. 使用主题定义的粗体 (Gotham-Bold) */
  font-family: ${props => props.theme.fonts.bold};
  
  /* 2. 巨大字号 */
  font-size: 18vw; 
  line-height: 0.9;
  margin: 0;
  padding: 0;
  
  /* 3. 电光蓝渐变填充 */
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary},  /* #3798ff */
    ${props => props.theme.colors.secondary}, /* #a8d2ff */
    ${props => props.theme.colors.primary}
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  
  /* 4. 动画 */
  animation: 
    ${gradientFlow} 3s ease infinite,
    ${pulse} 2s ease-in-out infinite;

  /* 5. 投影：使用 neon 风格的阴影 */
  filter: drop-shadow(0 0 20px rgba(55, 152, 255, 0.3));
  
  /* 防止选中 */
  user-select: none;
`;

// 装饰性文字
const SubText = styled.div`
  /* 使用主题定义的常规字体 */
  font-family: ${props => props.theme.fonts.book};
  
  margin-top: 1rem;
  font-size: 1rem;
  
  /* 使用主色调 */
  color: ${props => props.theme.colors.primary};
  
  letter-spacing: 0.8em; /* 极宽的字间距，营造高级工业感 */
  text-transform: uppercase;
  font-weight: bold;
  opacity: 0.8;
  
  display: flex;
  align-items: center;
  gap: 10px;

  /* 闪烁的光标效果 */
  &::after {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    background-color: ${props => props.theme.colors.primary};
    animation: blink 0.8s infinite;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

// 底部极细线条进度条
const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: ${props => props.theme.colors.primary};
  width: ${props => props.$progress}%;
  transition: width 0.2s linear;
  box-shadow: ${props => props.theme.shadows.neon}; /* 使用主题定义的霓虹阴影 */
`;

export default function LoadingScreen() {
  const { active, progress } = useProgress();
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // 加载完成且进度条跑满
    if (!active && progress === 100) {
      const timer = setTimeout(() => {
        setFinished(true);
      }, MIN_LOAD_TIME);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  return (
    <Container $finished={finished}>
      <HugeNumber>
        {Math.round(progress)}
      </HugeNumber>
      
      <SubText>
        Loading Assets
      </SubText>
      
      {/* 如果你想让进度条张扬一点，可以是底部的通栏线条 */}
      <ProgressBar $progress={progress} />
    </Container>
  );
}