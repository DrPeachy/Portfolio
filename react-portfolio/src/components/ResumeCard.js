import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { FaEye, FaDownload, FaFilePdf } from 'react-icons/fa';
import { t } from 'i18next';

// === Styled Components ===

const CardContainer = styled.div`
  position: relative;
  
  /* === 核心修复 === */
  /* 1. 宽度控制：稍微减小最小宽度限制，让它在窄屏幕上更灵活 */
  width: 100%;
  min-width: 300px; 
  max-width: 450px; /* 稍微调小最大宽度，更容易并排 */
  
  /* 2. 比例与透视 */
  aspect-ratio: 1 / 1; /* A4 纸比例 */
  perspective: 1000px;
  cursor: pointer;
  margin: 0 auto;

  /* 3. 移动端兜底 */
  @media (max-width: 400px) {
    min-width: 100%;
  }

  @media (max-width: 768px) {
    max-width: 340px; /* 手机上不要太宽 */
    margin: 0 auto 60px auto; /* 居中且保持底部间距 */
  }
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 12px; 
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease;
  border: 1px solid rgba(0,0,0,0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23000000' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 2;
  }

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 40px 80px rgba(55, 152, 255, 0.4);
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ResumeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; 
  transform: scale(1);
  transition: transform 0.6s ease;

  ${CardInner}:hover & {
    transform: scale(1.1);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 10, 0.85); 
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 5;

  ${CardInner}:hover & {
    opacity: 1;
  }
`;

const ActionBtn = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 15px 35px; 
  border-radius: 50px;
  font-family: ${props => props.theme.fonts.bold};
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: 1.5px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  width: 80%;
  max-width: 240px;
  transform: translateY(20px);
  opacity: 0;

  ${CardInner}:hover & {
    transform: translateY(0);
    opacity: 1;
  }

  &.primary {
    background: ${props => props.theme.colors.primary};
    color: #fff;
    box-shadow: 0 10px 30px ${props => props.theme.colors.primary}60;
    transition-delay: 0.1s;
    
    &:hover {
      transform: scale(1.05) translateY(-2px);
      box-shadow: 0 15px 40px ${props => props.theme.colors.primary};
    }
  }

  &.secondary {
    border: 2px solid rgba(255,255,255,0.5);
    color: #fff;
    background: transparent;
    transition-delay: 0.2s;
    
    &:hover {
      background: rgba(255,255,255,0.1);
      border-color: #fff;
      transform: scale(1.05) translateY(-2px);
    }
  }
`;

const Label = styled.div`
  position: absolute;
  bottom: -60px; /* 往下挪一点，给两行文字留空间 */
  left: 50%;
  transform: translateX(-50%);
  width: 100%; /* 确保占满宽度以便居中 */
  text-align: center;
  
  font-family: ${props => props.theme.fonts.book};
  color: ${props => props.theme.colors.text.main};
  font-size: 1.2rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  
  /* === 核心修复 === */
  /* 允许换行，防止长标题被切断 */
  white-space: normal; 
  line-height: 1.4;
  
  opacity: 0.8;
  transition: opacity 0.3s ease;

  ${CardContainer}:hover & {
    opacity: 1;
    color: ${props => props.theme.colors.primary};
  }
`;

// === Component ===

const ResumeCard = ({ title, pdfLink, previewImg }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateX = (mouseY / rect.height) * -5; 
    const rotateY = (mouseX / rect.width) * 5;
    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }
  };

  return (
    <CardContainer onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <CardInner ref={cardRef}>
        {previewImg ? (
            <ResumeImage src={previewImg} alt={title} />
        ) : (
            <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#ccc'}}>
                <FaFilePdf size={80} />
                <p style={{marginTop: '20px', fontFamily: 'Gotham-Book', fontSize: '1.2rem'}}> {t('resume.pdfPreview')} </p>
            </div>
        )}

        <Overlay>
          <ActionBtn href={pdfLink} target="_blank" className="primary">
            <FaEye /> {t('resume.buttons.preview')}
          </ActionBtn>
          
          <ActionBtn href={pdfLink} download className="secondary">
            <FaDownload /> {t('resume.buttons.download')}
          </ActionBtn>
        </Overlay>
      </CardInner>
      
      <Label>{title}</Label>
    </CardContainer>
  );
};

export default ResumeCard;