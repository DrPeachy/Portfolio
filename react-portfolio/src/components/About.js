import React from "react";
import GameGallery from "./GameGallery";
import { Container, Row, Col } from "react-bootstrap";
const About = () => {
  return (
    <Container fluid>
      <Row>
        <Col xl={4}>
          <GameGallery />
        </Col>

        <Col xl={8}>
          <h1 className="about-title">About Me</h1>
          <p className="about-text">
            I am a software engineer with a passion for game development. I have
            experience with Unity, C#, and Java. I am also familiar with web
            development technologies such as React, Node.js, and MongoDB. I am
            currently seeking a full-time position in game development or
            software engineering.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default About;