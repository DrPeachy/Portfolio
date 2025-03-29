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

// 预先加载整个 "../img/showcase" 目录下的所有图片（递归查找）
const importAllImages = () => {
  try {
    // 注意此处的路径和正则表达式需根据实际情况调整
    const context = require.context('../img/showcase', true, /\.(png|jpe?g|svg)$/);
    let imagesByFolder = {};
    context.keys().forEach((key) => {
      // 假设 key 格式为 "./PBR/image1.png" 或 "./Shader/image2.jpg"
      const parts = key.split('/');
      // parts[1] 就是文件夹名称，例如 "PBR" 或 "Shader"
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

// 在模块加载时就预先读取所有展示用的图片
const allShowcaseImages = importAllImages();

const Showcase = () => {
  const { t } = useTranslation();

  return (
    <Container fluid className="showcase">
      {Object.keys(staticShowcaseData).map((key) => {
        const project = staticShowcaseData[key];
        const images = allShowcaseImages[project.imagesFolderName] || [];
        return (
          <Row key={key} className="mb-4">
            <Col>
              <FadeInScaleUpOnScroll>
                <h2>{t(project.localizationKey)}</h2>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  {project.link}
                </a>
                {images.length > 0 ? (
                  <Carousel style={{ maxWidth: "600px", margin: "0 auto" }}>
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
              </FadeInScaleUpOnScroll>
            </Col>
          </Row>
        );
      })}
    </Container>
  );
};

export default Showcase;
