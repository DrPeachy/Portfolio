import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

// 复用我们之前做好的高级组件
import ProjectGallery from './ProjectGallery';
import { PageWrapper } from './styled/Layouts';
import FadeInScaleUpOnScroll from './FadeInScaleUpOnScroll';

gsap.registerPlugin(ScrollTrigger);

// === Styled Components ===

const ModelContainer = styled(PageWrapper)`
  padding-top: 120px;
  padding-bottom: 100px;
`;

// 页面大标题
const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;
`;

const Title = styled.h1`
  font-family: ${props => props.theme.fonts.thin};
  font-size: 4rem;
  color: ${props => props.theme.colors.text.main};
  text-transform: uppercase;
  letter-spacing: 10px;
  margin-bottom: 10px;
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`;

const Subtitle = styled.p`
  font-family: ${props => props.theme.fonts.light};
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.2rem;
  letter-spacing: 2px;
`;

// 网格布局：桌面端双列，移动端单列
const ModelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 4rem; /* 卡片之间的间距 */
  
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

// 单个模型展示卡片
const ModelCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ModelInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border-left: 3px solid ${props => props.theme.colors.primary};
  padding-left: 15px;
`;

const ModelName = styled.h3`
  font-family: ${props => props.theme.fonts.medium};
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.main};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ImageCount = styled.span`
  font-family: ${props => props.theme.fonts.book};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  background: rgba(0,0,0,0.05);
  padding: 4px 10px;
  border-radius: 20px;
`;

// === Logic ===

// 动态导入逻辑 (保持你原有的逻辑不变)
const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => {
    // item 类似于 "./Chocobo_Alpha_01.jpg"
    const fileName = item.replace('./', '');
    const modelName = fileName.split('_')[0]; // 提取 "Chocobo"
    
    if (!images[modelName]) {
      images[modelName] = [];
    }
    images[modelName].push(r(item));
  });
  return images;
};

// 预加载图片
const imagesData = importAll(require.context('../img/models', false, /\.(png|jpe?g|svg)$/));

const Model = () => {
  const { t } = useTranslation();
  const [loadedCount, setLoadedCount] = useState(0);

  // 计算图片总数，用于 ScrollTrigger 刷新逻辑
  const totalImages = useMemo(() => {
    return Object.values(imagesData).reduce((acc, arr) => acc + arr.length, 0);
  }, []);

  // 这是一个简单的预加载监听器，虽然 ProjectGallery 内部也有处理，
  // 但为了确保页面高度稳定后再刷新 ScrollTrigger，保留这个逻辑是好的。
  useEffect(() => {
    // 模拟等待图片加载（实际在 ProjectGallery 里渲染）
    // 由于 ProjectGallery 是懒加载的，这里我们简单延迟一下刷新
    const timer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ModelContainer>
      
      {/* 1. 页面头部 */}
      <FadeInScaleUpOnScroll start="top 90%">
        <PageHeader>
          <Title>3D <span>{t('model.title')}</span></Title>
          <Subtitle>{t('model.subTitle')}</Subtitle>
        </PageHeader>
      </FadeInScaleUpOnScroll>

      {/* 2. 模型网格 */}
      <ModelGrid>
        {Object.keys(imagesData).map((modelName, index) => {
          const modelImages = imagesData[modelName];
          
          return (
            <FadeInScaleUpOnScroll key={modelName} start="top 85%" delay={index * 0.1}>
              <ModelCard>
                {/* A. 模型信息头 */}
                <ModelInfo>
                  <ModelName>
                    {t(`model.modeldata.${modelName}`) || modelName}
                  </ModelName>
                  <ImageCount>{modelImages.length} {t('model.element')}</ImageCount>
                </ModelInfo>

                {/* B. 复用画廊组件 (自带轮播 + 灯箱) */}
                <ProjectGallery images={modelImages} />
                
              </ModelCard>
            </FadeInScaleUpOnScroll>
          );
        })}
      </ModelGrid>

    </ModelContainer>
  );
};

export default Model;