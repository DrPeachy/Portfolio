import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import FadeInScaleUpOnScroll from './FadeInScaleUpOnScroll';

gsap.registerPlugin(ScrollTrigger);

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

const Showcase = () => {
  const { t } = useTranslation();

  return (
    <Container fluid className="showcase">
      {Object.keys(staticShowcaseData).map((key) => {
        const project = staticShowcaseData[key];
        const images = allShowcaseImages[project.imagesFolderName] || [];
        return (
          <Row key={key} className="mb-4" style={{ height: "80vh" }}>
            <Col style={{ position: "relative", height: "100%" }}>
              <FadeInScaleUpOnScroll
                start="top 5%"
              >
                <h2>{t(project.localizationKey)}</h2>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  {project.link}
                </a>
                <div
                  style={{
                    position: "absolute",
                    top: "10%",     // 可根据需要调整偏移
                    left: "50%",
                    transform: "translateX(-50%)"
                  }}
                >
                  {images.length > 0 ? (
                    <Carousel 
                      style={{
                        maxHeight: "70%", 
                      }}
                    >
                      {images.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img
                            className="d-block w-100"
                            src={image}
                            alt={`Slide ${index}`}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <p>未加载到图片</p>
                  )}
                </div>
              </FadeInScaleUpOnScroll>
            </Col>
          </Row>
        );
      })}
    </Container>
  );
};

export default Showcase;
