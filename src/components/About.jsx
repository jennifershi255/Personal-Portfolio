import TrackVisibility from "react-on-screen";
import picture from "../assets/img/headshot.jpg";

export const About = () => {
  return (
    <div id="about" className="about">
      <h2>About Me</h2>
      <div className="container">
        <TrackVisibility>
          {({ isVisible }) => (
            <div className={isVisible ? "animate__animated animate__flip" : ""}>
              <img src={picture} alt="image" />
            </div>
          )}
        </TrackVisibility>
        <p>
          Hi! I'm Jennifer Shi, a{" "}
          <strong className="purple">Computing and Financial Management</strong>{" "}
          student at the
          <strong className="purple"> University of Waterloo</strong>, who is
          passionate about the intersection of{" "}
          <strong className="purple">technology</strong> and{" "}
          <strong className="purple">finance.</strong> <br />
          <br /> My hobbies include swimming, dance,{" "}
          <strong className="purple">playing instruments</strong>, reading, and
          baking. Some fun facts about me are that I was a former national-level{" "}
          <strong className="purple"> synchronized swimmer</strong>, I've been
          to over 10 countries, and I have two cats.
          <br /> <br /> Feel free to <strong className="purple">
            connect
          </strong>{" "}
          with me and explore potential opportunities, collaborations, or simply
          to chat about <strong className="purple">shared interests</strong>!
        </p>
      </div>
    </div>
  );
};
