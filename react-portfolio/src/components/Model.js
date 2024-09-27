import React, { useEffect, useState } from 'react';
import { Image, Row, Col, Container } from 'react-bootstrap';
import FadeInScaleUpOnScroll from './FadeInScaleUpOnScroll';
import { ScrollTrigger, ScrollToPlugin } from 'gsap/all';
import { gsap } from 'gsap';
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from 'react-icons/md';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);


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
  let imgCount = -1;
  let curImgIndex = 0;

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

  // Scroll to the next image
  const scrollToNext = () => {
    curImgIndex += 1;
    if (curImgIndex >= totalImages) {
      curImgIndex = 0;
    }
    gsap.to(window, {
      duration: 0.2,
      ease: 'power2.inOut',
      scrollTo: {
        y: `#model_img_${curImgIndex}`,
        offsetY: 62,
      },
    });
  };

  // Scroll to the previous image
  const scrollToPrevious = () => {
    curImgIndex -= 1;
    if (curImgIndex < 0) {
      curImgIndex = totalImages - 1;
    }
    gsap.to(window, {
      duration: 0.2,
      ease: 'power2.inOut',
      scrollTo: {
        y: `#model_img_${curImgIndex}`,
        offsetY: 100,
      },
    });
  };


  return (
    <Container fluid>
      {Object.keys(images).map((modelName, index) => (
        <div key={index} className="model-section my-5">
          <h2 className="text-center my-4">{modelName.replace('_', ' ')}</h2> {/* Displays the model name */}

          <Row className="justify-content-center">
            {images[modelName].map((imageSrc, imgIndex) => {
              imgCount += 1; // Increment the image count
              return (
                <Col key={imgIndex} md={11}>
                  {/* Apply fade-in and scale-up effect on scroll */}
                  <FadeInScaleUpOnScroll start="top 5%">
                    <Image
                      src={imageSrc}
                      fluid
                      alt={`${modelName} ${imgIndex + 1}`}
                      onLoad={handleImageLoad} // Call when image loads
                      id={`model_img_${imgCount}`} // Unique ID for each image
                    />
                  </FadeInScaleUpOnScroll>
                </Col>
              )
            })}
          </Row>
        </div>
      ))}
      {/* Fixed buttons for scrolling */}
      <div
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '300px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <button
          onClick={scrollToPrevious}
          style={{
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            padding: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}
        >
          <MdKeyboardDoubleArrowUp />
        </button>
        <button
          onClick={scrollToNext}
          style={{
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            padding: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}
        >
          <MdKeyboardDoubleArrowDown />
        </button>
      </div>
    </Container>
  );
};

export default Model;
