import React, { useEffect, useState } from 'react';
import { Image, Row, Col, Container } from 'react-bootstrap';
import FadeInScaleUpOnScroll from './FadeInScaleUpOnScroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

// Function to dynamically load images from a specific folder
const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => {
    const fileName = item.replace('./', '');
    const modelName = fileName.split('_')[0]; // Extracts "Chocobo_Alpha" or "Eva_02"
    if (!images[modelName]) {
      images[modelName] = [];
    }
    images[modelName].push(r(item)); // Add images under each model's array
  });
  return images;
};

// Import all images from the models folder
const images = importAll(require.context('../img/models', false, /\.(png|jpe?g|svg)$/));

const Model = () => {
  const [loadedCount, setLoadedCount] = useState(0);
  const totalImages = Object.keys(images).reduce((count, modelName) => count + images[modelName].length, 0);

  // Refresh ScrollTrigger after all images are loaded
  useEffect(() => {
    if (loadedCount === totalImages) {
      ScrollTrigger.refresh(); // Refresh ScrollTrigger after all images are loaded
    }
  }, [loadedCount, totalImages]);

  // Increase the loaded image count when an image is loaded
  const handleImageLoad = () => {
    setLoadedCount((prevCount) => prevCount + 1);
  };

  return (
    <Container fluid>
      {Object.keys(images).map((modelName, index) => (
        <div key={index} className="model-section my-5">
          <h2 className="text-center my-4">{modelName.replace('_', ' ')}</h2> {/* Displays the model name */}

          <Row className="justify-content-center">
            {images[modelName].map((imageSrc, imgIndex) => (
              <Col key={imgIndex} md={11}>
                {/* Apply fade-in and scale-up effect on scroll */}
                <FadeInScaleUpOnScroll start="top 5%">
                  <Image
                    src={imageSrc}
                    fluid
                    alt={`${modelName} ${imgIndex + 1}`}
                    onLoad={handleImageLoad} // Call when image loads
                  />
                </FadeInScaleUpOnScroll>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default Model;
