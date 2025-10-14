import TrackVisibility from "react-on-screen";
import picture from "../assets/img/headshot.jpg";

export const About = () => {
  return (
    <div id="about" className="about">
      <h2 className="section-heading">About Me</h2>
      <div className="container">
        <TrackVisibility>
          {({ isVisible }) => (
            <div className={isVisible ? "animate__animated animate__flip" : ""}>
              <div className="img-wrapper">
                <img src={picture} alt="image" />
              </div>
            </div>
          )}
        </TrackVisibility>
        <p>
          Hi! I'm Jennifer Shi, a{" "}
          <strong className="purple">Computing and Financial Management</strong>{" "}
          student at the
          <strong className="purple"> University of Waterloo</strong>, driven to{" "}
          <strong className="purple">innovate and create solutions </strong>{" "}
          that make a
          <strong className="purple">
            {" "}
            tangible difference. <br />
          </strong>{" "}
          <br /> My hobbies include swimming, dance, playing instruments,
          reading, and baking. I also love travelling, watching sports, and
          going on walks!
          <br /> <br /> Feel free to
          <a href="#connect" className="purple">
            <strong> connect</strong>{" "}
          </a>
          with me and explore potential opportunities, collaborations, or simply
          to chat about <strong className="purple">shared interests</strong>!
        </p>
      </div>
    </div>
  );
};
