import React from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaGithub } from 'react-icons/fa';
import ProjectGallery from './ProjectGallery';
import { PageWrapper } from './styled/Layouts'; // 使用之前定义的通用容器
import FadeInScaleUpOnScroll from './FadeInScaleUpOnScroll';

// === Styled Components ===

const ShowcaseContainer = styled(PageWrapper)`
  padding-top: 120px; /* 给 Navbar 留空间 */
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 150px; /* 项目之间的垂直间距 */
`;

const ProjectRow = styled.div`
  display: grid;
  /* 核心修改 1: 调整比例 */
  /* 文字占 0.8 (更紧凑)，图片占 1.2 (更宽敞) */
  grid-template-columns: 0.8fr 1.2fr; 
  gap: 4rem; /* 核心修改 2: 减小间距，减少中间的"空隙感" */
  align-items: center;

  /* 手机端单列 */
  @media (max-width: 960px) {
    grid-template-columns: 1fr; 
    gap: 3rem;
  }

  /* 偶数行反转模式 (图片在左，文字在右) */
  ${props => props.$reversed && css`
    /* 交换比例: 左边大(图片)，右边小(文字) */
    grid-template-columns: 1.2fr 0.8fr;
    
    /* 核心修改 3: 使用 order 交换位置，而不是 direction: rtl */
    & > :first-child {
      order: 2; /* 文字去右边 */
    }
    & > :last-child {
      order: 1; /* 图片去左边 */
    }
  `}
`;

// 文字区域
const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start; /* 左对齐 */
  width: 100%; /* 确保填满 Grid 单元格 */
`;

const ProjectTitle = styled.h2`
  font-family: ${props => props.theme.fonts.thin};
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.main};
  letter-spacing: -1px;
  line-height: 1;
  text-transform: uppercase;
`;

const ProjectDesc = styled.p`
  font-family: ${props => props.theme.fonts.book};
  font-size: 1rem;
  line-height: 1.8;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 2rem;
  /* 可选：如果文字太少，可以限制最大宽度让它自动换行，看起来更"块状" */
  /* max-width: 90%; */
`;

// 赛博风格按钮
const ProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 30px;
  border: 1px solid ${props => props.theme.colors.text.main};
  color: ${props => props.theme.colors.text.main};
  text-transform: uppercase;
  font-family: ${props => props.theme.fonts.medium};
  font-size: 0.9rem;
  letter-spacing: 2px;
  border-radius: 50px;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  z-index: 1;

  /* 悬停效果：电光蓝填充 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.theme.colors.primary};
    z-index: -1;
    transform: translateX(-100%);
    transition: transform 0.4s ease;
  }

  &:hover {
    color: #fff;
    border-color: ${props => props.theme.colors.primary};
    transform: translateX(10px); /* 微微右移 */
    &::before {
      transform: translateX(0);
    }
  }
`;

// 装饰性序号
const IndexNumber = styled.div`
  font-family: ${props => props.theme.fonts.bold};
  font-size: 8rem;
  color: rgba(0,0,0,0.03); /* 极淡的背景字 */
  position: absolute;
  top: -4rem;
  left: -2rem;
  z-index: -1;
  line-height: 1;
  pointer-events: none;
`;

// === Data Management ===

const staticShowcaseData = {
  PBRrendering: {
    link: 'https://github.com/VChhh/PBR_Final_Project',
    imagesFolderName: 'PBR',
    localizationKey: 'PBR'
  },
  ShaderPlayground: {
    link: 'https://github.com/DrPeachy/ShaderPlayground',
    imagesFolderName: 'Shader',
    localizationKey: 'Shader'
  },
  ResumeSaver: {
    link: 'https://github.com/DrPeachy/ResumeSaver',
    imagesFolderName: 'ResumeSaver',
    localizationKey: 'Resume'
  },
  RayTracing: {
    link: 'https://github.com/nyu-cs-gy-6533-fall-2022/assignment-5-final-project-team-gg',
    imagesFolderName: 'RayTracing',
    localizationKey: 'RayTracing'
  }
};

const importAllImages = () => {
  try {
    const context = require.context('../img/showcase', true, /\.(png|jpe?g|svg)$/);
    let imagesByFolder = {};
    context.keys().forEach((key) => {
      const parts = key.split('/');
      const folderName = parts[1];
      if (!imagesByFolder[folderName]) {
        imagesByFolder[folderName] = [];
      }
      imagesByFolder[folderName].push(context(key));
    });
    return imagesByFolder;
  } catch (error) {
    console.error("预加载图片失败:", error);
    return {};
  }
};

const allShowcaseImages = importAllImages();

// === Main Component ===

const Showcase = () => {
  const { t } = useTranslation();

  return (
    <ShowcaseContainer>
      {Object.keys(staticShowcaseData).map((key, index) => {
        const project = staticShowcaseData[key];
        const images = allShowcaseImages[project.imagesFolderName] || [];
        // 偶数行反转布局
        const isReversed = index % 2 !== 0; 

        return (
          <FadeInScaleUpOnScroll key={key} start="top 80%">
            <ProjectRow $reversed={isReversed}>
              
              {/* 1. 文字信息区 */}
              <InfoColumn>
                <div style={{ position: 'relative' }}>
                    <IndexNumber>{String(index + 1).padStart(2, '0')}</IndexNumber>
                    <ProjectTitle>{t(project.localizationKey)}</ProjectTitle>
                </div>
                
                <ProjectDesc>
                    {/* 如果你的 i18n 有 description，可以在这里加 */}
                    {t(`${project.localizationKey}_desc`) || "A detailed exploration of graphics programming techniques and visual fidelity."}
                </ProjectDesc>

                <ProjectLink href={project.link} target="_blank" rel="noopener noreferrer">
                  <FaGithub style={{ fontSize: '1.1em' }}/> 
                  <span>View Source Code</span>
                </ProjectLink>
              </InfoColumn>

              {/* 2. 自定义画廊区 */}
              <div style={{ width: '100%' }}>
                <ProjectGallery images={images} />
              </div>

            </ProjectRow>
          </FadeInScaleUpOnScroll>
        );
      })}
    </ShowcaseContainer>
  );
};

export default Showcase;