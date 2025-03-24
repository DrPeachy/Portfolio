import React, { useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap'; // Import GSAP for animations
import { MdKeyboardDoubleArrowDown } from 'react-icons/md';
import { HiMiniLanguage } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const MyNavbar = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const navbar = document.querySelector("#navbar-section .navbar");
      const navLinks = navbar.querySelectorAll(".nav-link");
      const navbarBrand = navbar.querySelector(".navbar-brand");

      if (scrollPosition > 60) {
        // 页面滚动后：应用深色样式
        gsap.to(navbar, { backgroundColor: "rgba(0, 0, 0, 0.8)", color: "white", duration: 0.2 });
        gsap.to(navLinks, { color: "white", duration: 0.2 });
        gsap.to(navbarBrand, { color: "white", duration: 0.2 });
      } else {
        // 顶部状态：应用浅色样式
        gsap.to(navbar, { backgroundColor: "white", color: "black", duration: 0.2 });
        gsap.to(navLinks, { color: "grey", duration: 0.2 });
        gsap.to(navbarBrand, { color: "black", duration: 0.2 });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 切换语言的函数，示例中在 "en" 和 "zh" 之间切换
  const handleLanguageToggle = () => {
    if(i18n.language === "en") {
      i18n.changeLanguage("zh");
    } else {
      i18n.changeLanguage("en");
    }
  };

  return (
    <div id="navbar-section">
      <Navbar expand="xl">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center w-100">
            {/* 左侧区域：Brand, Toggle 和 Collapse */}
            <div className="d-flex align-items-center">
              <Navbar.Brand as={Link} to="/" className="navbar-brand">
                Charles' Realm
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarNav" className="navbar-toggler">
                <MdKeyboardDoubleArrowDown />
              </Navbar.Toggle>
              <Navbar.Collapse id="navbarNav">
                <Nav className="mr-auto">
                  <Nav.Link as={Link} to="/me" className="nav-link">{t("navbar.about")}</Nav.Link>
                  <Nav.Link as={Link} to="/game" className="nav-link">{t("navbar.game")}</Nav.Link>
                  <Nav.Link as={Link} to="/showcase" className="nav-link">{t("navbar.showcase")}</Nav.Link>
                  <Nav.Link as={Link} to="/model" className="nav-link">{t("navbar.model")}</Nav.Link>
                  <Nav.Link as={Link} to="/resume" className="nav-link">{t("navbar.resume")}</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </div>
            {/* 右侧区域：语言切换图标 */}
            <div className="d-flex align-items-center">
              <Nav.Link onClick={handleLanguageToggle} className="nav-link">
                <HiMiniLanguage size={24} />
              </Nav.Link>
            </div>
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default MyNavbar;
