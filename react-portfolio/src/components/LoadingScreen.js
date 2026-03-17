import React, { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import styled, { keyframes } from 'styled-components';

// ==============================================
// 🛠️ 配置区域
// ==============================================
// 最小展示时间，确保即使加载极快，用户也能感受到酷炫的动画
const MIN_LOAD_TIME = 800; 

// ==============================================
// 🎨 动画定义 (保持不变)
// ==============================================
const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.02); filter: brightness(1.1); }
  100% { transform: scale(1); filter: brightness(1); }
`;

// ==============================================
// 💅 样式组件 (保持不变)
// ==============================================
const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: ${props => props.theme.colors.bg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${props => (props.$finished ? 0 : 1)};
  pointer-events: ${props => (props.$finished ? 'none' : 'auto')};
  transition: opacity 1s cubic-bezier(0.77, 0, 0.175, 1);
`;

const HugeNumber = styled.h1`
  font-family: ${props => props.theme.fonts.bold};
  font-size: 18vw; 
  line-height: 0.9;
  margin: 0;
  padding: 0;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary},  
    ${props => props.theme.colors.secondary}, 
    ${props => props.theme.colors.primary}
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: 
    ${gradientFlow} 3s ease infinite,
    ${pulse} 2s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(55, 152, 255, 0.3));
  user-select: none;
`;

const SubText = styled.div`
  font-family: ${props => props.theme.fonts.book};
  margin-top: 1rem;
  font-size: 1rem;
  color: ${props => props.theme.colors.primary};
  letter-spacing: 0.8em;
  text-transform: uppercase;
  font-weight: bold;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 10px;
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

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: ${props => props.theme.colors.primary};
  width: ${props => props.$progress}%;
  transition: width 0.1s linear; /* 加快进度条反应速度 */
  box-shadow: ${props => props.theme.shadows.neon}; 
`;

// ==============================================
// 🚀 核心组件逻辑
// ==============================================
export default function LoadingScreen() {
  // 解构出 total，用来判断是否根本没有物理资源需要加载
  const { progress, total } = useProgress();
  
  // 新增：分离出一个专门用于显示的进度 state
  const [displayProgress, setDisplayProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  // 核心改动 1：使用缓动动画让数字滚到目标值
  useEffect(() => {
    // 如果没有任何外部资产 (total === 0)，说明瞬间加载完毕，目标值直接设为 100
    // 如果有外部资产，则目标值跟随真实的 Three.js progress
    const targetProgress = total === 0 ? 100 : progress;

    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        const diff = targetProgress - prev;
        
        // 当显示的数字非常接近目标值时，直接让它等于目标值
        if (diff <= 0.5) {
          return targetProgress;
        }
        
        // 否则，每次跳动剩余差距的 15%，形成一个非常高级的 "Ease-Out" 减速滚动效果
        return prev + diff * 0.15;
      });
    }, 30); // 约 33fps 的刷新率，足够丝滑

    return () => clearInterval(interval);
  }, [progress, total]);

  // 核心改动 2：监听显示进度，到达 100 后触发消失动画
  useEffect(() => {
    if (displayProgress === 100) {
      const timer = setTimeout(() => {
        setFinished(true);
      }, MIN_LOAD_TIME);
      
      return () => clearTimeout(timer);
    }
  }, [displayProgress]);

  return (
    <Container $finished={finished}>
      <HugeNumber>
        {/* 使用 Math.floor 确保显示的都是整数 */}
        {Math.floor(displayProgress)}
      </HugeNumber>
      
      <SubText>
        Loading Assets
      </SubText>
      
      <ProgressBar $progress={displayProgress} />
    </Container>
  );
}