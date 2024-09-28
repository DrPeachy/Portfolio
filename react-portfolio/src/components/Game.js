import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import FadeInScaleUpOnScroll from './FadeInScaleUpOnScroll';
import DraggableTags from './DraggableTags';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Game data, including image file names, links, titles, and descriptions
const gameData = {
  morph: {
    title: 'Morph',
    tags: ['Unity', 'Platformer', 'Indie', 'Puzzle', 'Pixel'],
    link: 'https://1067838263.itch.io/morph',
    imageFileName: 'morph.jpg'
  },
  planet: {
    title: 'Procedural Planet',
    tags: ['Unity', 'Procedural', '3D', 'Simulation', 'Shader'],
    link: 'https://1067838263.itch.io/planet',
    imageFileName: 'planet.jpg'
  },
  knight: {
    title: 'Knight and Spear',
    tags: ['Unity', 'PC', 'Pixel', '2D', 'Rogue-like'],
    link: 'https://bluetitanium.itch.io/knight-and-spear',
    imageFileName: 'knight.jpg'
  },
  tetris: {
    title: 'Tetris Rush',
    tags: ['Unity', 'GameJam', 'Puzzle', 'Arcade', '3D'],
    link: 'https://1067838263.itch.io/tetrisrush',
    imageFileName: 'tetris.jpg'
  },
  seagull: {
    title: 'Seagull Express',
    tags: ['Unity', 'Mobile', 'Delivery', 'Runner', '2D'],
    link: 'https://pyc23.itch.io/seagull-express',
    imageFileName: 'seagull.jpg'
  }
};

// Dynamic import for game images
const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => {
    images[item.replace('./', '')] = r(item);
  });
  return images;
};

const gameImages = importAll(require.context('../img/games', false, /\.(png|jpe?g|svg)$/));

const Game = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const imageElements = Object.keys(gameData).map((gameKey) => {
      const img = document.createElement('img');
      img.src = gameImages[gameData[gameKey].imageFileName];
      return img;
    });

    Promise.all(
      imageElements.map(
        (img) =>
          new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; // handle error, to avoid hanging if image fails to load
          })
      )
    ).then(() => {
      setImagesLoaded(true); // Mark images as fully loaded
      ScrollTrigger.refresh(); // Refresh ScrollTrigger after images load
    });
  }, []);

  return (
    <Container fluid>
      {Object.entries(gameData).map(([gameKey, gameInfo], index) => (
        <div key={index} className="game-section my-5">
          <h2 className="text-center my-4">{gameInfo.title}</h2>

          <Row className="justify-content-center">
            <Col md={4} className="mb-4">
              {/* Apply fade-in and scale-up effect on scroll */}
              <FadeInScaleUpOnScroll start="top 5%">
                <Image src={gameImages[gameInfo.imageFileName]} fluid alt={gameInfo.title} style={{ borderRadius: '5px', boxShadow: '4px 4px 20px rgba(55, 152, 255, 0.4)' }} />
              </FadeInScaleUpOnScroll>
            </Col>

            <Col md={5} className="d-flex flex-column justify-content-center" style={{height:'400px'}} >
              <FadeInScaleUpOnScroll start="top 5%">
                {/* <a href={gameInfo.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark">
                  Play
                </a> */}
                <DraggableTags tags={gameInfo.tags} index={index} colors={['#444444', '#222222']} />
              </FadeInScaleUpOnScroll>
            </Col>
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default Game;
