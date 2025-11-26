import React from "react";
import styled from "styled-components";
import { useTranslation } from 'react-i18next';
import FadeInScaleUpOnScroll from './FadeInScaleUpOnScroll';
import ResumeCard from './ResumeCard';
import { PageWrapper } from './styled/Layouts';

// 引入 PDF 文件
import ResumeUS from "../resumes/resume - US25.3.29.pdf";
import ResumeCN from "../resumes/resume - CN2025-3-24.pdf";

// 引入预览图 (如果没有，请先用 null 占位，或者制作截图)
// import PreviewUS from "../img/resumes/preview-us.jpg";
// import PreviewCN from "../img/resumes/preview-cn.jpg";
const PreviewUS = null; // 暂时用 null，显示默认图标
const PreviewCN = null;

// === Styled Components ===

const ResumeContainer = styled(PageWrapper)`
  padding-bottom: 100px;
  min-height: 100vh;
  gap: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
  max-width: 600px;
`;

const Title = styled.h1`
  font-family: ${props => props.theme.fonts.thin};
  font-size: 4rem;
  color: ${props => props.theme.colors.text.main};
  text-transform: uppercase;
  margin-bottom: 20px;
  letter-spacing: 5px;
`;

const Description = styled.p`
  font-family: ${props => props.theme.fonts.book};
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.6;
`;

const CardsGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 100px; /* 两个简历之间的宽间距 */
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: 960px) {
    gap: 60px;
    flex-direction: column;
  }
`;

const Resume = () => {
  const { t } = useTranslation();

  return (
    <ResumeContainer id="resume-section">
      
      <FadeInScaleUpOnScroll start="top 90%">
        <Header>
          <Title>{t('resume.title')}</Title>
          <Description>
            {t('resume.instructions')}
          </Description>
        </Header>
      </FadeInScaleUpOnScroll>

      <CardsGrid>
        <FadeInScaleUpOnScroll start="top 85%" delay={0}>
          <ResumeCard 
            title={t('resume.english')}
            pdfLink={ResumeUS} 
            previewImg={PreviewUS} 
          />
        </FadeInScaleUpOnScroll>

        <FadeInScaleUpOnScroll start="top 85%" delay={0.2}>
          <ResumeCard 
            title="Chinese Version" 
            pdfLink={ResumeCN} 
            previewImg={PreviewCN} 
          />
        </FadeInScaleUpOnScroll>
      </CardsGrid>

    </ResumeContainer>
  );
};

export default Resume;