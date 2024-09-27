import React, { useEffect } from 'react';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap'; // Import GSAP for animations
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from 'react-icons/md';

const MyNavbar = () => {

  // Function to handle navbar color change on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const navbar = document.querySelector("#navbar-section .navbar");
      const navLinks = navbar.querySelectorAll(".nav-link");
      const navbarBrand = navbar.querySelector(".navbar-brand");

      if (scrollPosition > 60) {
        // Page is scrolled down - apply dark navbar styles
        gsap.to(navbar, { backgroundColor: "rgba(0, 0, 0, 0.8)", color: "white", duration: 0.2 });
        gsap.to(navLinks, { color: "white", duration: 0.2 });
        gsap.to(navbarBrand, { color: "white", duration: 0.2 });
      } else {
        // At the top - apply light navbar styles
        gsap.to(navbar, { backgroundColor: "white", color: "black", duration: 0.2 });
        gsap.to(navLinks, { color: "grey", duration: 0.2 });
        gsap.to(navbarBrand, { color: "black", duration: 0.2 });
      }
    };

    // Add event listener for scroll
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div id="navbar-section">
      <Navbar expand="xl">
        <Container className="mx-5">
          <Navbar.Brand as={Link} to="/" className="navbar-brand">
            Charles' Realm
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" className="navbar-toggler">
            <MdKeyboardDoubleArrowDown />
          </Navbar.Toggle>
          <Navbar.Collapse id="navbarNav">
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/me" className="nav-link">Me</Nav.Link>
              <Nav.Link as={Link} to="/game" className="nav-link">Games</Nav.Link>
              <Nav.Link as={Link} to="/model" className="nav-link">3D Modeling</Nav.Link>
              <Nav.Link as={Link} to="/resume" className="nav-link">Resume</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default MyNavbar;
