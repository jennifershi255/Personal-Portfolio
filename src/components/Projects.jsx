import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import MarketMatch from "../assets/img/MarketMatch.png";
import procrastiNATION from "../assets/img/procrasti-NATION.png";
import glide from "../assets/img/glide.png";
import switcharoo from "../assets/img/switcharoo.png";
import recipes from "../assets/img/recipes.png";
import gameoflife from "../assets/img/gameoflife.png";
import coinCubby from "../assets/img/COIN CUBBY.png";
import moneymetrics from "../assets/img/moneymetrics.png";
import JupyterLogo from "../assets/img/Jupyter_logo.svg.png";
import PythonLogo from "../assets/img/Python-logo-notext.svg.png";
import PandasLogo from "../assets/img/pandaslogo.png";
import ReactLogo from "../assets/img/reactlogo.png";
import MongoDB from "../assets/img/mongodb.png";
import Cohere from "../assets/img/cohere.png";
import javascript from "../assets/img/JavaScript-logo.png";
import java from "../assets/img/java.svg";
import figma from "../assets/img/Figma-logo.svg";
import MLMHockey from "../assets/img/MLM.png";
import scikit from "../assets/img/scikit.png";

export const Projects = () => {
  const projects = [
    {
      title: "Hockey Goal ML Model",
      description:
        "Machine Learning Model to predict goals in hockey based on shot distance, angle, and type.",
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
    {
      title: "procrasti-NATION",
      description:
        "Your local hub for laziness. Using API integration, prompt engineering, and model training, this website generates custom excuses for your procrastination desires. ",
      imgUrl: procrastiNATION,
      techImg1: ReactLogo,
      techImg2: MongoDB,
      techImg3: Cohere,
      link: "https://devpost.com/software/procrasti-nation",
    },
    {
      title: "Recipe Repository",
      description:
        "Your personal digital cookbook! This app allows you to store, organize, and access all your favorite recipes in one convenient place, making cooking easier and more enjoyable.",
      imgUrl: recipes,
      techImg1: ReactLogo,
      techImg2: javascript,
      techImg3: PythonLogo,
      link: "https://github.com/jennifershi255/recipe-repository-app",
    },
    {
      title: "Switcharoo",
      description:
        "Through a house swap network, Switcharoo addresses two critical challenges faced by many in Canada: accessibility of housing and a lack of community connection.",
      imgUrl: switcharoo,
      techImg1: glide,
      techImg2: figma,
      link: "https://docs.google.com/presentation/d/1OjK9zTtJaogVXmwkx-phYje-qzC40itYmMNCco0b43I/edit?usp=sharing",
    },
    {
      title: "The Sustainable Life",
      description:
        "A spinoff of the Game of Life, with a theme of sustainability. Up to 6 players will embark on a journey where each decision impacts the environment.",
      imgUrl: gameoflife,
      techImg1: java,
      link: "https://github.com/jennifershi255/The-Game-of-Life",
    },
    {
      title: "Coin Cubby",
      description:
        "A virtual piggybank. Coin Cubby lets you set up multiple savings jars, deposit or withdraw money, track your progress, and watch your money grow.",
      imgUrl: coinCubby,
      techImg1: java,
      link: "https://github.com/jennifershi255/CoinCubby",
    },
    {
      title: "MoneyMetrics",
      description:
        "Categorizes your total expenses and revenues, presenting them in dynamic bar graphs. This helps give a comprehensive view of your financial trends.",
      imgUrl: moneymetrics,
      techImg1: java,
      link: "https://github.com/jennifershi255/MoneyMetrics",
    },
  ];

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <h2>Projects</h2>
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
