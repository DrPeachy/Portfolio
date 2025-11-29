import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import GameGallery from "./GameGallery";
import { PageWrapper } from "./styled/Layouts"; // 别忘了用这个我们刚才写的通用容器

// === Styled Components ===

const AboutLayout = styled.div`
  display: grid;
  /* 左侧 40%，右侧 60% */
  grid-template-columns: 1fr 1.5fr; 
  gap: 5rem;
  padding-top: 80px; /* 给 Navbar 留位置 */
  align-items: center; /* 垂直居中对齐 */

  @media (max-width: 960px) {
    grid-template-columns: 1fr; /* 手机平板变单列 */
    gap: 3rem;
    text-align: center; /* 手机端文字居中可能更好看 */
  }
`;

const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem; /* 每个段落之间的间距 */
`;

const SectionWrapper = styled.section`
  /* 这里可以加一些进入动画的 hook class */
`;

const MainTitle = styled.h1`
  font-family: ${({theme}) => theme.fonts.thin};
  font-size: 4rem;
  color: ${({theme}) => theme.colors.text.main};
  margin-bottom: 1.5rem;
  letter-spacing: -2px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SubTitle = styled.h2`
  font-family: ${({theme}) => theme.fonts.bold};
  font-size: 2rem;
  color: ${({theme}) => theme.colors.text.main}; /* 用你的主色强调小标题 */
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Paragraph = styled.p`
  font-family: ${({theme}) => theme.fonts.book}; /* 用 Book 字重，比 Thin 好读 */
  font-size: 1.1rem;
  line-height: 1.8;
  color: ${({theme}) => theme.colors.text.secondary}; /* 不要纯黑，深灰更有质感 */
  white-space: pre-line;
  
  /* 首字下沉效果（可选，很杂志风） */
  /*
  &::first-letter {
    font-size: 3em;
    float: left;
    margin-right: 0.2em;
    line-height: 0.8;
  }
  */
`;

// === Component ===

const About = () => {
  const { t } = useTranslation();
  const aboutSections = t("about", { returnObjects: true });

  return (
    <PageWrapper>
      <AboutLayout>
        
        {/* 左侧：画廊 */}
        <div style={{ position: 'relative', width: '100%' }}>
          <GameGallery />
        </div>

        {/* 右侧：文字内容 */}
        <ContentColumn>
          {Object.entries(aboutSections).map(([sectionKey, sectionData], index) => (
            <SectionWrapper key={index} className={`about-section ${sectionKey}-section`}>
              {index === 0 ? (
                <MainTitle>{sectionData.title}</MainTitle>
              ) : (
                <SubTitle>{sectionData.title}</SubTitle>
              )}
              <Paragraph>
                {sectionData.content}
              </Paragraph>
            </SectionWrapper>
          ))}
        </ContentColumn>

      </AboutLayout>
    </PageWrapper>
  );
};

export default About;