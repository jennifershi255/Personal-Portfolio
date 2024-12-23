import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ArrowRightCircle } from "react-bootstrap-icons";
import "animate.css";
import TrackVisibility from "react-on-screen";

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(50);
  const [index, setIndex] = useState(1);
  const toRotate = [
    "Hello, my name is...",
    "你好，我的名字是...",
    "Bonjour, je m'appelle...",
  ];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(50);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex((prevIndex) => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(100);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <section className="banner" id="home">
      <Container>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Col xs={12} md={6} xl={7}>
            <div style={{ minHeight: "5px", margin: 15 }} className="tagline">
              <span>{text}</span>
              {text === "" && (
                <span style={{ visibility: "hidden" }}>&nbsp;</span>
              )}{" "}
              {/* Invisible span */}
            </div>

            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__zoomIn" : ""
                  }
                >
                  <h1 className="namecard"> Jennifer Shi</h1>
                </div>
              )}
            </TrackVisibility>
            <p style={{ marginTop: 15 }}>
              Computer Science & Finance <span className="purple">@</span>{" "}
              University of Waterloo
            </p>
            <button
              className="button"
              onClick={() => navigate("./components/Contact.jsx")}
            >
              About Me <ArrowRightCircle style={{ color: "white" }} size={25} />
            </button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
