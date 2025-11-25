import React from 'react';
import styled from 'styled-components';
import { FaGithub, FaSteam, FaLinkedin, FaItchIo } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// === Styled Components ===

const FooterWrapper = styled.footer`
  /* 关键布局：
     width: 100% 确保撑满
     padding: 上下留足呼吸感，左右适配 theme
     background: 稍微深一点的背景，区分内容区
  */
  width: 100%;
  padding: 4rem 0 2rem 0; 
  background-color: transparent; /* 或者 rgba(0,0,0,0.05) */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  
  /* 加上一点上边距，防止贴着上面的组件 */
  margin-top: auto; 
  /* margin-top: auto 是 Flex 布局里的魔法，
     如果父容器是 min-height: 100vh flex-col，
     这行代码会自动把 Footer 推到最下面 
  */
`;

const IconsContainer = styled.div`
  display: flex;
  gap: 3rem; /* 图标之间的间距 */
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

const SocialLink = styled.a`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text.main}; /* 跟随主题 */
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${props => props.theme.colors.primary}; /* 悬停变电光蓝 */
    transform: translateY(-5px); /* 微微上浮 */
  }
`;

const Copyright = styled.p`
  font-family: ${props => props.theme.fonts.book};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  opacity: 0.8;
  margin: 0;
`;

// === Component ===

const Footer = () => {
  const { t } = useTranslation();

  return (
    <FooterWrapper>
      <IconsContainer>
        <SocialLink 
          href="https://github.com/DrPeachy" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </SocialLink>
        
        <SocialLink 
          href="https://steamcommunity.com/id/1067838263/" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Steam"
        >
          <FaSteam />
        </SocialLink>

        <SocialLink 
          href="https://www.linkedin.com/in/p1067838263" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </SocialLink>

        <SocialLink 
          href="https://1067838263.itch.io/" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Itch.io"
        >
          <FaItchIo />
        </SocialLink>
      </IconsContainer>

      <Copyright>
        {t('footer.copyright')}
      </Copyright>
    </FooterWrapper>
  );
};

export default Footer;