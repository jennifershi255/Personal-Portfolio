import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import MarketMatch from "../assets/img/MarketMatch.png";
import JupyterLogo from "../assets/img/Jupyter_logo.svg.png";
import PythonLogo from "../assets/img/Python-logo-notext.svg.png";
import PandasLogo from "../assets/img/pandaslogo.png";
import javascript from "../assets/img/JavaScript-logo.png";
import figma from "../assets/img/Figma-logo.svg";
import MLMHockey from "../assets/img/MLM.png";
import scikit from "../assets/img/scikit.png";
import html from "../assets/img/html.png";
import mindyourstep from "../assets/img/mindyourstep.png";

export const Projects = () => {
  const projects = [
    {
      title: "Mind Your Step",
      description: (
        <>
          An interactive game designed to tackle critical challenges in early
          learning. <br /> <br />{" "}
          <strong style={{ fontWeight: "bold" }}>
            "MindYourStep: Empowering Young Minds, One Step at a Time!"
          </strong>{" "}
          <br /> <br />{" "}
        </>
      ),
      imgUrl: mindyourstep,
      techImg1: html,
      techImg2: javascript,
      techImg3: figma,
      link: "https://www.youtube.com/watch?v=_9TFfhiwJGw",
    },
    {
      title: "Hockey Goal ML Model",
      description: (
        <>
          Machine Learning Model to predict goals in hockey based on shot
          distance, angle, and type, analyzing over 120,000+ points of shot
          data.
          <br /> <br />
        </>
      ),
      imgUrl: MLMHockey,
      techImg1: JupyterLogo,
      techImg2: PythonLogo,
      techImg3: scikit,
      link: "https://github.com/jennifershi255/Hockey-Goal-MLM",
    },
    {
      title: "MarketMatch",
      description:
        "Analyzes historical data to create a portfolio from a list of stocks, identifying the optimal combination to closely match the performance of the S&P 500 and TSX 60 indices.",
      imgUrl: MarketMatch,
      techImg1: JupyterLogo,
      techImg2: PythonLogo,
      techImg3: PandasLogo,
      link: "https://github.com/jennifershi255/MarketMatch",
    },
  ];

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <h2 className="section-heading">Projects</h2>
            <p className="section-description">
              Some recent projects. See more on my {""}
              <a
                href="https://github.com/jennifershi255"
                className="purple"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>Github!</strong>
              </a>
            </p>
            <Row>
              {projects.map((project, index) => {
                return <ProjectCard key={index} {...project} />;
              })}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
