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
const PreviewUS = null; 
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
  /* === 核心修改 === */
  /* 之前的 600px 太窄了，改为 900px，让文字横向延展 */
  max-width: 900px; 
  width: 100%;
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
  /* 之前添加的 pre-line，用于支持 \n 换行 */
  white-space: pre-line; 
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
            title={t('resume.chinese')}
            pdfLink={ResumeCN} 
            previewImg={PreviewCN} 
          />
        </FadeInScaleUpOnScroll>
      </CardsGrid>

    </ResumeContainer>
  );
};

export default Resume;