import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useTranslation } from "react-i18next";
import { HiMiniLanguage } from "react-icons/hi2";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";

// === 1. Styled Components (UI 骨架) ===

const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  /* 高度单独控制，背景样式移交给了下方的 NavBackground */
  height: ${props => props.$scrolled ? '60px' : '80px'};
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.lg}; 
  transition: height 0.4s ease, padding 0.4s ease; /* 只过渡高度和边距 */

  @media (max-width: 768px) {
    padding: 0 ${props => props.theme.spacing.md};
  }
`;

// 🌟 新增：专门负责背景、毛玻璃和波浪遮罩的层
const NavBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  /* 高度比 NavWrapper 稍微多出 15px，让波浪“悬垂”在内容区下方，防止裁掉文字 */
  height: calc(100% + 15px);
  z-index: -1;
  pointer-events: none; /* 关键：防止悬垂的 15px 挡住下方网页内容的点击 */
  
  background: ${props => props.$scrolled ? 'rgba(20, 20, 20, 0.35)' : 'transparent'};
  backdrop-filter: ${props => props.$scrolled ? 'blur(12px)' : 'none'};
  -webkit-backdrop-filter: ${props => props.$scrolled ? 'blur(12px)' : 'none'};
  
  /* 在被 Mask 切割的层上，不能用 box-shadow，必须用 drop-shadow filter 来生成跟随波浪形状的阴影 */
  filter: ${props => props.$scrolled ? `drop-shadow(0 10px 15px rgba(0,0,0,0.3))` : 'none'};
  transition: background 0.4s ease, backdrop-filter 0.4s ease, filter 0.4s ease;

  /* === 动态波浪遮罩核心 === */
  /* 使用内联 SVG 画出一个顶部平整、底部起伏的完美正弦波 */
  mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cpath d='M0,0 L0,88 Q25,100 50,88 T100,88 L100,0 Z' fill='black'/%3E%3C/svg%3E");
  mask-size: 800px 100%; /* 一个波浪的物理宽度设为 800px */
  mask-repeat: repeat-x; /* 水平无限平铺 */
  
  -webkit-mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cpath d='M0,0 L0,88 Q25,100 50,88 T100,88 L100,0 Z' fill='black'/%3E%3C/svg%3E");
  -webkit-mask-size: 800px 100%;
  -webkit-mask-repeat: repeat-x;

  /* 动画：让 mask 的背景图持续向左滚动，刚好滚动一个 mask-size 的距离，形成完美无缝循环 */
  animation: waveFlow 12s linear infinite;

  @keyframes waveFlow {
    0% {
      mask-position: 0 0;
      -webkit-mask-position: 0 0;
    }
    100% {
      mask-position: -800px 0; /* 跟 mask-size 保持一致 */
      -webkit-mask-position: -800px 0;
    }
  }
`;

const Logo = styled(Link)`
  font-family: ${props => props.theme.fonts.book};
  font-size: 1.5rem;
  color: ${props => props.$scrolled ? props.theme.colors.text.light : props.theme.colors.text.main};
  text-decoration: none;
  letter-spacing: 1px;
  z-index: 1002;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const DesktopMenu = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 960px) {
    display: none; 
  }
`;

const NavItem = styled(Link)`
  font-family: ${props => props.theme.fonts.book};
  font-size: 0.9rem;
  color: ${props => props.$scrolled ? '#e0e0e0' : props.theme.colors.text.secondary};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  transition: color 0.3s ease;

  ${props => props.$active && css`
    color: ${props.theme.colors.primary};
  `}

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: ${props => props.theme.colors.primary};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${props => props.theme.colors.primary};
    &::after {
      width: 100%;
    }
  }
`;

const IconBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$scrolled ? '#fff' : '#000'};
  transition: color 0.3s ease;
  z-index: 1002;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(15px);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  
  opacity: ${props => props.$isOpen ? 1 : 0};
  pointer-events: ${props => props.$isOpen ? 'all' : 'none'};
  transition: opacity 0.4s ease;
`;

const MobileMenuToggle = styled.div`
  display: flex;
  align-items: center;

  @media (min-width: 961px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  font-family: ${props => props.theme.fonts.thin};
  font-size: 2rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: scale(1.1);
  }
`;

// === 2. Component Logic ===

const MyNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "zh" : "en");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { path: '/me', label: t("navbar.about") },
    { path: '/game', label: t("navbar.game") },
    { path: '/showcase', label: t("navbar.showcase") },
    { path: '/model', label: t("navbar.model") },
    { path: '/resume', label: t("navbar.resume") },
  ];

  return (
    <>
      <NavWrapper $scrolled={scrolled || mobileMenuOpen}> 
        
        {/* 🌟 背景渲染层：将波浪动画放置在底层 */}
        <NavBackground $scrolled={scrolled || mobileMenuOpen} />

        <Logo to="/" $scrolled={scrolled || mobileMenuOpen} onClick={closeMenu}>
          Charles' Realm
        </Logo>

        <DesktopMenu>
          {menuItems.map((item) => (
            <NavItem 
              key={item.path} 
              to={item.path} 
              $scrolled={scrolled || mobileMenuOpen}
              $active={location.pathname === item.path} 
            >
              {item.label}
            </NavItem>
          ))}
        </DesktopMenu>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <IconBtn onClick={toggleLanguage} $scrolled={scrolled || mobileMenuOpen}>
            <HiMiniLanguage />
          </IconBtn>

          <MobileMenuToggle>
            <IconBtn onClick={toggleMobileMenu} $scrolled={scrolled || mobileMenuOpen}>
              {mobileMenuOpen ? <IoCloseOutline /> : <RxHamburgerMenu />}
            </IconBtn>
          </MobileMenuToggle>
        </div>
      </NavWrapper>

      <MobileMenuOverlay $isOpen={mobileMenuOpen}>
        {menuItems.map((item) => (
          <MobileNavLink key={item.path} to={item.path} onClick={closeMenu}>
            {item.label}
          </MobileNavLink>
        ))}
      </MobileMenuOverlay>
    </>
  );
};

export default MyNavbar;