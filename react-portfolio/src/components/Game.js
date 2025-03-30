import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import FadeInScaleUpOnScroll from './FadeInScaleUpOnScroll';
import DraggableTags from './DraggableTags';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
gsap.registerPlugin(ScrollTrigger);

// Game data, including image file names, links, titles, and descriptions
const staticGameData = {
  morph: {
    link: 'https://1067838263.itch.io/morph',
    imageFileName: 'morph.jpg'
  },
  planet: {
    link: 'https://1067838263.itch.io/planet',
    imageFileName: 'planet.jpg'
  },
  knight: {
    link: 'https://bluetitanium.itch.io/knight-and-spear',
    imageFileName: 'knight.jpg'
  },
  tetris: {
    link: 'https://1067838263.itch.io/tetrisrush',
    imageFileName: 'tetris.jpg'
  },
  seagull: {
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

const tagsWidth = "500px";
const tagsHeight = "470px";

const Game = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { t } = useTranslation();

  const gameData = Object.keys(staticGameData).reduce((acc, key) => {
    acc[key] = {
      ...staticGameData[key],
      title: t(`game.gamedata.${key}.title`),
      tags: t(`game.gamedata.${key}.tags`, { returnObjects: true })
    };
    return acc;
  }, {});

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

          <Row className="justify-content-center align-items-stretch">
            <Col xl={3} className="d-flex justify-content-center align-items-center"
            >
              {/* Apply fade-in and scale-up effect on scroll */}
              <FadeInScaleUpOnScroll
                start="top 5%"
                style={{
                  width: '100%',
                }}
              >
                <Image src={gameImages[gameInfo.imageFileName]} alt={gameInfo.title} style={{
                  borderRadius: '55px',
                  boxShadow: '4px 4px 20px rgba(55, 152, 255, 0.4)',
                  width: '90%',
                }} />
              </FadeInScaleUpOnScroll>
            </Col>

            <Col xl={3} className="d-flex flex-column justify-content-center" >
              <FadeInScaleUpOnScroll
                start="top 5%"
                style={{
                  PointerEvent: 'none',
                }}
              >
                <DraggableTags tags={gameInfo.tags} index={index} colors={['#3495eb']} playLink={gameInfo.link} />
              </FadeInScaleUpOnScroll>
            </Col>
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default Game;
