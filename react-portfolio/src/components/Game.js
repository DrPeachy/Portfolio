import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import FadeInScaleUpOnScroll from './FadeInScaleUpOnScroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Game data, including image file names, links, titles, and descriptions
const gameData = {
  morph: {
    title: 'Morph',
    description: 'Morph is a 2D platformer puzzle game I made in a team of 5 with Unity...',
    link: 'https://1067838263.itch.io/morph',
    imageFileName: 'morph.jpg'
  },
  planet: {
    title: 'Procedural Planet',
    description: 'Planet is a game(more like a toy) that I made with Unity...',
    link: 'https://1067838263.itch.io/planet',
    imageFileName: 'planet.jpg'
  },
  knight: {
    title: 'Knight and Spear',
    description: 'Knight and Spear is a 2D rogue-like game I made in a team of 3 with Unity...',
    link: 'https://bluetitanium.itch.io/knight-and-spear',
    imageFileName: 'knight.jpg'
  },
  tetris: {
    title: 'Tetris Rush',
    description: 'Tetris Rush is a 2D puzzle game I made with a friend...',
    link: 'https://1067838263.itch.io/tetrisrush',
    imageFileName: 'tetris.jpg'
  },
  seagull: {
    title: 'Seagull Express',
    description: 'Seagull Express is a 2D topdown Android game I made in a team of 4...',
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
                <Image src={gameImages[gameInfo.imageFileName]} fluid alt={gameInfo.title} style={{ borderRadius: '5px' }} />
              </FadeInScaleUpOnScroll>
            </Col>

            <Col md={5} className="d-flex flex-column justify-content-center">
              <FadeInScaleUpOnScroll start="top 5%">
                <p className="lead">{gameInfo.description}</p>
                <a href={gameInfo.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark">
                  Play
                </a>
              </FadeInScaleUpOnScroll>
            </Col>
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default Game;
