import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
// 引入刚才写的 3D 背景
import ThreeBackground from './ThreeBackground';

// === Styled Components ===

const HeroContainer = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  
  /* === 核心修正 === */
  /* 1. 抵消 index.css 中的 body margin-top: 50px */
  margin-top: -50px; 
  
  /* 2. 视觉重心修正 (Optical Centering) */
  /* 几何中心通常看起来偏低，稍微往上提 8vh 让视觉更平衡 */
  padding-bottom: 8vh; 
`;

// 文字层容器
const ContentWrapper = styled.div`
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* 允许鼠标穿透去玩 3D 背景 */
  mix-blend-mode: multiply; /* 正片叠底，让文字更好地融入背景纹理 */
`;

// 遮罩容器：用于实现"从下往上浮出"的切割效果
const TextMask = styled.div`
  overflow: hidden;
  position: relative;
  line-height: 0.85; /* 极度紧凑的行距，更有设计感 */
  padding: 10px 0; /* 给一点空间防止切到字体边缘 */
`;

const MainTitle = styled.h1`
  font-family: ${props => props.theme.fonts.thin}; 
  /* 响应式巨大字号：最小 4rem，最大 11rem，随屏幕宽度变化 */
  font-size: clamp(4rem, 13vw, 11rem); 
  color: #1a1a1a; /* 纯粹的深灰，不要纯黑 */
  text-transform: uppercase;
  margin: 0;
  letter-spacing: -0.04em; /* 负字间距，让字母紧挨着，更现代 */
  transform: translateY(100%); /* 初始状态：藏在下面 */
  opacity: 0;
`;

// 副标题容器
const SubWrapper = styled.div`
  margin-top: 4vh;
  overflow: hidden; /* 同样用于遮罩动画 */
`;

const SubTitle = styled.p`
  font-family: ${props => props.theme.fonts.medium}; /* 用稍微粗一点的字重做对比 */
  font-size: 0.9rem;
  letter-spacing: 0.6em; /* 极宽的字间距 */
  text-transform: uppercase;
  color: ${props => props.theme.colors.primary}; /* 电光蓝点缀 */
  margin: 0;
  transform: translateY(100%);
  opacity: 0;
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  opacity: 0; /* 初始隐藏 */
  /* 确保滚动提示不受 padding-bottom 影响，始终在底部 */
  transform: translateY(0); 
`;

const MouseIcon = styled.div`
  width: 20px;
  height: 32px;
  border: 2px solid #1a1a1a;
  border-radius: 12px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 6px;
    background-color: #1a1a1a;
    border-radius: 2px;
    animation: scrollWheel 2s infinite;
  }

  @keyframes scrollWheel {
    0% { top: 6px; opacity: 1; }
    100% { top: 18px; opacity: 0; }
  }
`;

const HeroSection = () => {
  const line1Ref = useRef(null); // CHARLES
  const line2Ref = useRef(null); // REALM
  const subRef = useRef(null);   // SUBTITLE
  const scrollRef = useRef(null); // 鼠标图标
  const { t } = useTranslation();

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    // 1. 文字上浮进场 (Staggered Reveal)
    tl.to([line1Ref.current, line2Ref.current], {
      y: 0,
      opacity: 1,
      duration: 1.8,
      stagger: 0.2, // "REALM" 比 "CHARLES" 晚 0.2秒 出来
      ease: "power4.out" // 极速冲出然后缓慢刹车
    })
    // 2. 副标题进场
    .to(subRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power3.out"
    }, "-=1.2")
    // 3. 滚动提示淡入
    .to(scrollRef.current, {
      opacity: 0.6,
      duration: 1
    }, "-=1");

  }, []);

  return (
    <HeroContainer>
      {/* 3D 背景 */}
      <ThreeBackground />

      <ContentWrapper>
        {/* 第一行：CHARLES */}
        <TextMask>
          <MainTitle ref={line1Ref}>
            {t("home.hero2_first", "CHARLES")} {/* 建议在 i18n 里拆分这两个词，或者这里直接写死 */}
          </MainTitle>
        </TextMask>

        {/* 第二行：REALM */}
        <TextMask>
          <MainTitle ref={line2Ref}>
            {t("home.hero2_second", "REALM")}
          </MainTitle>
        </TextMask>

        {/* 副标题 */}
        <SubWrapper>
          <SubTitle ref={subRef}>
            {t("home.hero1") || "UNITY DEVELOPER // TECH ARTIST"}
          </SubTitle>
        </SubWrapper>
      </ContentWrapper>

      {/* 底部滚动提示 */}
      <ScrollIndicator ref={scrollRef}>
        <MouseIcon />
      </ScrollIndicator>

    </HeroContainer>
  );
};

export default HeroSection;