import React from "react";
import GameGallery from "./GameGallery";
import { Container, Row, Col } from "react-bootstrap";
const About = () => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <GameGallery />
        </Col>
      </Row>
    </Container>
  );
}

export default About;