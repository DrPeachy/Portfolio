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

const Showcase = () => {

  return (
    <Container fluid className="showcase">
      <Row>
        <Col className="showcase-col">
          <FadeInScaleUpOnScroll>
          </FadeInScaleUpOnScroll>
        </Col>
      </Row>
    </Container>
  );
}

export default Showcase;