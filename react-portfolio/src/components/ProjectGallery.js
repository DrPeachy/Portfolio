import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from 'react-icons/fa';

// === Styled Components ===

const GalleryWrapper = styled.div`
  position: relative;
  width: 100%;
  /* 1. 强制统一比例：16:9 */
  aspect-ratio: 16 / 9; 
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: border-color 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Slide = styled.img`
  width: 100%;
  height: 100%;
  /* 2. 强制填充：Cover 模式会裁剪图片以填满容器，保证整齐 */
  object-fit: cover; 
  flex-shrink: 0;
  filter: grayscale(20%);
  transition: filter 0.5s ease, transform 0.5s ease;
  cursor: zoom-in; /* 鼠标提示可放大 */
  
  ${GalleryWrapper}:hover & {
    filter: grayscale(0%);
  }
`;

// 放大提示图标
const ZoomHint = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  pointer-events: none; /* 让点击穿透到图片 */

  ${GalleryWrapper}:hover & {
    opacity: 1;
    transform: scale(1);
  }
`;

// 底部控制栏
const ControlsBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2; /* 确保在图片之上 */
`;

const Counter = styled.div`
  font-family: ${props => props.theme.fonts.book};
  color: #fff;
  font-size: 0.9rem;
  letter-spacing: 2px;
  
  span {
    color: ${props => props.theme.colors.primary};
    font-weight: bold;
  }
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ControlBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 50px;
  left: 0;
  height: 2px;
  background: ${props => props.theme.colors.primary};
  width: 0%;
  z-index: 10;
  box-shadow: 0 0 10px ${props => props.theme.colors.primary};
`;

const EmptyState = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-family: ${props => props.theme.fonts.thin};
`;

// === Lightbox Styles (Portal) ===
const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(5, 5, 5, 0.95); /* 深黑背景 */
  backdrop-filter: blur(15px);
  z-index: 10000; /* 保证在最顶层 */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0; /* 初始隐藏 */
`;

const LargeImage = styled.img`
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 0 50px rgba(0,0,0,0.8);
  transform: scale(0.9); /* 初始缩小 */
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    transform: rotate(90deg);
  }
`;

// === Component ===

const ProjectGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const lightboxRef = useRef(null);
  const largeImgRef = useRef(null);

  // 切换图片逻辑
  const goToSlide = (index) => {
    if (index < 0 || index >= images.length) return;
    setCurrentIndex(index);
    
    gsap.to(containerRef.current, {
      xPercent: -100 * index,
      duration: 0.8,
      ease: "power3.out"
    });

    gsap.to(progressRef.current, {
      width: `${((index + 1) / images.length) * 100}%`,
      duration: 0.5,
      ease: "power2.inOut"
    });
  };

  useEffect(() => {
    if (images.length > 0) {
        gsap.set(progressRef.current, { width: `${(1 / images.length) * 100}%` });
    }
  }, [images]);

  // 打开灯箱
  const openLightbox = () => {
    setIsLightboxOpen(true);
    // 稍微延迟一点等待 DOM 渲染
    setTimeout(() => {
      if (lightboxRef.current && largeImgRef.current) {
        gsap.to(lightboxRef.current, { opacity: 1, duration: 0.3 });
        gsap.fromTo(largeImgRef.current, 
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.2)" }
        );
      }
    }, 10);
  };

  // 关闭灯箱
  const closeLightbox = () => {
    if (lightboxRef.current && largeImgRef.current) {
      gsap.to(largeImgRef.current, { scale: 0.9, opacity: 0, duration: 0.3 });
      gsap.to(lightboxRef.current, { 
        opacity: 0, 
        duration: 0.3, 
        onComplete: () => setIsLightboxOpen(false) 
      });
    }
  };

  if (!images || images.length === 0) {
    return (
        <GalleryWrapper>
            <EmptyState>NO SIGNAL</EmptyState>
        </GalleryWrapper>
    );
  }

  return (
    <>
      <GalleryWrapper>
        <ImageContainer ref={containerRef}>
          {images.map((img, i) => (
            <Slide 
                key={i} 
                src={img} 
                alt={`Slide ${i}`} 
                onClick={openLightbox} // 点击打开大图
            />
          ))}
        </ImageContainer>

        <ZoomHint>
            <FaExpand />
        </ZoomHint>

        <ProgressBar ref={progressRef} />

        <ControlsBar>
          <Counter>
            <span>{String(currentIndex + 1).padStart(2, '0')}</span> / {String(images.length).padStart(2, '0')}
          </Counter>

          <BtnGroup>
            <ControlBtn onClick={() => goToSlide(currentIndex - 1)} disabled={currentIndex === 0}>
              <FaChevronLeft size={12} />
            </ControlBtn>
            <ControlBtn onClick={() => goToSlide(currentIndex + 1)} disabled={currentIndex === images.length - 1}>
              <FaChevronRight size={12} />
            </ControlBtn>
          </BtnGroup>
        </ControlsBar>
      </GalleryWrapper>

      {/* Lightbox Portal (渲染到 body 层级，不受父容器 overflow 限制) */}
      {isLightboxOpen && ReactDOM.createPortal(
        <LightboxOverlay ref={lightboxRef} onClick={closeLightbox}>
          <CloseBtn onClick={closeLightbox}>
            <FaTimes />
          </CloseBtn>
          {/* 阻止点击图片时关闭 */}
          <LargeImage 
            ref={largeImgRef} 
            src={images[currentIndex]} 
            alt="Full view" 
            onClick={(e) => e.stopPropagation()} 
          />
        </LightboxOverlay>,
        document.body
      )}
    </>
  );
};

export default ProjectGallery;