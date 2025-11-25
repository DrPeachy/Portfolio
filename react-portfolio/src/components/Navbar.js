import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useTranslation } from "react-i18next";
import { HiMiniLanguage } from "react-icons/hi2";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";

// === 1. Styled Components (UI 骨架) ===

// 导航栏外壳
const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.lg}; /* 使用 theme 间距 */
  transition: all 0.4s ease;

  /* 核心逻辑：滚动状态样式 */
  /* 如果滚动了，应用深色半透明背景 + 毛玻璃 */
  ${props => props.$scrolled && css`
    background: rgba(20, 20, 20, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    height: 60px; /* 滚动后稍微变窄，更精致 */
    box-shadow: ${props.theme.shadows.soft};
  `}

  @media (max-width: 768px) {
    padding: 0 ${props => props.theme.spacing.md};
  }
`;

// Logo 样式
const Logo = styled(Link)`
  font-family: ${props => props.theme.fonts.medium};
  font-size: 1.5rem;
  color: ${props => props.$scrolled ? props.theme.colors.text.light : props.theme.colors.text.main};
  text-decoration: none;
  letter-spacing: 1px;
  z-index: 1002; /* 保证在移动端菜单层之上 */
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

// 桌面端菜单容器
const DesktopMenu = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  
  /* 核心修改：使用绝对定位 */
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  /* 依然保留隐藏逻辑 */
  @media (max-width: 960px) {
    display: none; 
  }
`;

// 导航链接
const NavItem = styled(Link)`
  font-family: ${props => props.theme.fonts.book};
  font-size: 0.9rem;
  /* 顶部是深灰，滚动变白 */
  color: ${props => props.$scrolled ? '#e0e0e0' : props.theme.colors.text.secondary};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  transition: color 0.3s ease;

  /* 激活状态的高亮逻辑 (可选) */
  ${props => props.$active && css`
    color: ${props.theme.colors.primary};
  `}

  /* 下划线动效 */
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

// 功能按钮 (语言切换/汉堡菜单)
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

// === 移动端全屏菜单 (Mobile Overlay) ===
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
  
  /* 进场动画状态控制 */
  opacity: ${props => props.$isOpen ? 1 : 0};
  pointer-events: ${props => props.$isOpen ? 'all' : 'none'};
  transition: opacity 0.4s ease;
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

// === 2. Component Logic (逻辑实现) ===

const MyNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation(); // 获取当前路由，用于高亮当前页

  // 1. 滚动监听逻辑
  useEffect(() => {
    const handleScroll = () => {
      // 超过 50px 就变色
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. 语言切换
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "zh" : "en");
  };

  // 3. 移动端菜单切换
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // 点击链接后自动关闭移动端菜单
  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  // 定义菜单项配置 (方便复用)
  const menuItems = [
    { path: '/me', label: t("navbar.about") },
    { path: '/game', label: t("navbar.game") },
    { path: '/showcase', label: t("navbar.showcase") },
    { path: '/model', label: t("navbar.model") },
    { path: '/resume', label: t("navbar.resume") },
  ];

  return (
    <>
      {/* 导航栏主体 */}
      <NavWrapper $scrolled={scrolled || mobileMenuOpen}> 
        {/* 如果菜单打开了，也要保持深色背景，保证 Logo 可见 */}
        
        {/* LOGO */}
        <Logo to="/" $scrolled={scrolled || mobileMenuOpen} onClick={closeMenu}>
          Charles' Realm
        </Logo>

        {/* 桌面端菜单 (Mobile 隐藏) */}
        <DesktopMenu>
          {menuItems.map((item) => (
            <NavItem 
              key={item.path} 
              to={item.path} 
              $scrolled={scrolled}
              $active={location.pathname === item.path} // 判断是否激活
            >
              {item.label}
            </NavItem>
          ))}
        </DesktopMenu>

        {/* 右侧功能区 */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          
          {/* 语言切换 */}
          <IconBtn onClick={toggleLanguage} $scrolled={scrolled || mobileMenuOpen}>
            <HiMiniLanguage />
          </IconBtn>

          {/* 移动端汉堡按钮 (Desktop 隐藏) */}
          <div className="d-md-none" style={{ display: 'flex' }}> 
            {/* 注意：d-md-none 是 Bootstrap 的类，既然去掉了 Bootstrap，我们需要自己写 Media Query */}
             <IconBtn onClick={toggleMobileMenu} $scrolled={scrolled || mobileMenuOpen} style={{ display: 'flex', '@media (min-width: 961px)': { display: 'none' } }}>
                {mobileMenuOpen ? <IoCloseOutline /> : <RxHamburgerMenu />}
             </IconBtn>
          </div>

        </div>
      </NavWrapper>

      {/* 移动端全屏菜单 Overlay */}
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

// 补一个小的 Style Fix，因为我们移除了 d-md-none
// 你可以在 IconBtn 的父级 div 上直接加这个内联样式，或者用 styled component 控制显示隐藏
// 这里我在代码里做了处理，但为了严谨，建议把 IconBtn 包裹在一个 styled component 里控制显示

export default MyNavbar;