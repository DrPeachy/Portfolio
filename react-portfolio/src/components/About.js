import React from "react";
import GameGallery from "./GameGallery";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  // 获取整个 about 对象，需要返回对象
  const aboutSections = t("about", { returnObjects: true });

  return (
    <Container fluid>
      <Row>
        <Col xl={4}>
          <GameGallery />
        </Col>
        <Col xl={8}>
          {Object.entries(aboutSections).map(([sectionKey, sectionData], index) => (
            <section key={index} className={`about-section ${sectionKey}-section`}>
              {/* 如果你希望 intro 显示大标题，可以根据 index 做个判断 */}
              {index === 0 ? (
                <h1 className="section-title">{sectionData.title}</h1>
              ) : (
                <h2 className="section-title">{sectionData.title}</h2>
              )}
              <p className="section-text" style={{ whiteSpace: "pre-line" }}>
                {sectionData.content}
              </p>
            </section>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default About;
