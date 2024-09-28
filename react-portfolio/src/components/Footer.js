import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGithub, FaSteam, FaLinkedin, FaItchIo } from 'react-icons/fa';

const Footer = () => {
  return (
    <Container fluid>
      <Row className="justify-content-center align-items-center" id="footer-icon">
        <Col className="text-center no-padding" xs="auto">
          <a
            href="https://github.com/DrPeachy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '40px', color: '#000' }}
          >
            <FaGithub />
          </a>
        </Col>
        <Col className="text-center no-padding" xs="auto">
          <a
            href="https://steamcommunity.com/id/1067838263/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '40px', color: '#000' }}
          >
            <FaSteam />
          </a>
        </Col>
        <Col className="text-center no-padding" xs="auto">
          <a
            href="https://www.linkedin.com/in/p1067838263"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '40px', color: '#000' }}
          >
            <FaLinkedin />
          </a>
        </Col>
        <Col className="text-center no-padding" xs="auto">
          <a
            href="https://1067838263.itch.io/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '40px', color: '#000' }}
          >
            <FaItchIo />
          </a>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4" id="footer-copyright">
        <Col xs={12} className="text-center">
          <p className="lead">
            © 2023 Cheng Pan. All rights reserved.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
