import { useState, useEffect } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import navIcon1 from "../assets/img/nav-icon1.svg";
import navIcon2 from "../assets/img/nav-icon2.svg";
import navIcon4 from "../assets/img/nav-icon4.svg";

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id) => {
    const targetSection = document.getElementById(id);
    if (targetSection) {
      const offset =
        id === "projects"
          ? targetSection.offsetTop // Scrolls to the top for "projects"
          : targetSection.offsetTop -
            window.innerHeight / 2 +
            targetSection.offsetHeight / 2; // Centers for other sections
      targetSection.offsetTop -
        window.innerHeight / 2 +
        targetSection.offsetHeight / 2;
      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
      setActiveLink(id);
    }
  };
  return (
    <Navbar expand="lg" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              href="#home"
              onClick={() => scrollToSection("home")}
              className={
                activeLink === "home" ? "active navbar-link" : "navbar-link"
              }
            >
              Home
            </Nav.Link>
            <Nav.Link
              href="#about"
              onClick={() => scrollToSection("about")}
              className={
                activeLink === "about" ? "active navbar-link" : "navbar-link"
              }
            >
              About
            </Nav.Link>
            <Nav.Link
              href="#projects"
              onClick={() => scrollToSection("projects")}
              className={
                activeLink === "projects" ? "active navbar-link" : "navbar-link"
              }
            >
              Projects
            </Nav.Link>
            <Nav.Link
              href="#travel"
              onClick={() => scrollToSection("travel")}
              className={
                activeLink === "travel" ? "active navbar-link" : "navbar-link"
              }
            >
              Travel
            </Nav.Link>
            <Nav.Link
              href="#notes"
              onClick={() => scrollToSection("notes")}
              className={
                activeLink === "notes" ? "active navbar-link" : "navbar-link"
              }
            >
              Notes
            </Nav.Link>
            <Nav.Link
              href="#connect"
              onClick={() => scrollToSection("connect")}
              className={
                activeLink === "connect" ? "active navbar-link" : "navbar-link"
              }
            >
              Connect
            </Nav.Link>
          </Nav>
          <span className="navbar-text">
            <div className="social-icon">
              <a
                href="https://www.linkedin.com/in/jennifershi255"
                target="_blank"
              >
                <img src={navIcon1} alt=""></img>
              </a>
              <a href="https://github.com/jennifershi255" target="_blank">
                <img src={navIcon2} alt=""></img>
              </a>
              <a href="mailto:j286shi@uwaterloo.ca">
                <img src={navIcon4} alt=""></img>
              </a>
            </div>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
