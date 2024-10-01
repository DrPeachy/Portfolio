import React, { useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
// Import resume files
import ResumeUS from "../resumes/resume - US9.28.pdf";
import ResumeCN from "../resumes/resume - CN11.23.pdf";
import Container from "react-bootstrap/esm/Container";

const App = () => {

  return (
    <Container fluid id="resume-section">
      <Row>
        <Col>
          <object data={ResumeUS} type="application/pdf" width="100%" height="800px">
            <p>It appears you don't have a PDF plugin for this browser. You can
              <a href={ResumeUS}>click here to download the PDF file.</a>
            </p>
          </object>
        </Col>
        <Col>
          <object data={ResumeCN} type="application/pdf" width="100%" height="800px">
            <p>It appears you don't have a PDF plugin for this browser. You can
              <a href={ResumeCN}>click here to download the PDF file.</a>
            </p>
          </object>
        </Col>
      </Row>
    </ Container>
  );
};

export default App;
