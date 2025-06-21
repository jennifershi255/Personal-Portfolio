import { Container, Row, Col } from "react-bootstrap";
import navIcon1 from "../assets/img/nav-icon1.svg";
import navIcon2 from "../assets/img/nav-icon2.svg";
import navIcon4 from "../assets/img/nav-icon4.svg";

export const Connect = () => {
  return (
    <div id="connect" className="connect">
      <h2 className="section-heading">Let's Connect!</h2>
      <Container>
        <Row>
          <Col xs={12} md={4}>
            <div className="box">
              <a
                href="https://www.linkedin.com/in/jennifershi255"
                target="_blank"
              >
                <img src={navIcon1} />

                <h4>Linkedin</h4>
              </a>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="box">
              <a href="https://github.com/jennifershi255" target="_blank">
                <img src={navIcon2} />
                <h4>Github</h4>
              </a>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="box">
              <a href="mailto:j286shi@uwaterloo.ca">
                <img src={navIcon4} />
                <h4>Email</h4>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
