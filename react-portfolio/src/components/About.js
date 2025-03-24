import React from "react";
import GameGallery from "./GameGallery";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <Container fluid>
      <Row>
        <Col xl={4}>
          <GameGallery />
        </Col>

        <Col xl={8}>
          <h1 className="about-title">
            {t("about.title")}
          </h1>
          <p className="about-text">
            {t("about.content")}
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default About;