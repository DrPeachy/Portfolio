import React from "react";
import DraggableTags from "./DraggableTags";
import { Container } from "react-bootstrap";

const Resume = () => {
  return (
    <Container>
      <DraggableTags tags={["Unity", "Android", "Platformer", "Indie", "Chilling"]} colors={["rgba(100, 100, 100, 1)", "rgba(9,255,50,1)"]}/>
    </Container>
  );
};

export default Resume;