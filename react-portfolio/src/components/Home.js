import React from 'react';
import Hero from './HeroSection';
import FadeInScaleUpOnScroll from './FadeInScaleUpOnScroll';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import selfImage from '../img/self.jpg';

const Home = () => {
  return (
    <div>
      <Hero />
    </div>
  );
};

export default Home;
