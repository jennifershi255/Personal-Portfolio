import { Container, Row, Col } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import blueFolder from "../assets/img/Notes/blueFolder.png";
import greenFolder from "../assets/img/Notes/greenFolder.png";
import pinkFolder from "../assets/img/Notes/pinkFolder.png";
import orangeFolder from "../assets/img/Notes/orangeFolder.png";
import purpleFolder from "../assets/img/Notes/purpleFolder.png";
import redFolder from "../assets/img/Notes/redFolder.png";
import { NoteCard } from "./NoteCard";

export const Notes = () => {
  const notes = [
    {
      title: "IB Math AA SL",
      imgUrl: blueFolder,
      link: "https://drive.google.com/drive/folders/1VlHJoeIQmzK7F7rhpk4I1TdMdWQMvffG?usp=sharing",
    },
    {
      title: "IB Economics HL",
      imgUrl: greenFolder,
      link: "https://worried-reply-92e.notion.site/microeconomics-0168f5436273448db93a5a9324386366",
    },
    {
      title: "IB Physics SL",
      imgUrl: redFolder,
      link: "https://worried-reply-92e.notion.site/physics-e4af5adbf80d4a1e932cc88208a24269",
    },
    {
      title: "IB Chemistry HL",
      imgUrl: orangeFolder,
      link: "https://worried-reply-92e.notion.site/chemistry-d8621385f2a34abfa67b106edf30b955",
    },
    {
      title: "Accounting Grade 11 & 12",
      imgUrl: pinkFolder,
      link: "https://drive.google.com/drive/folders/17QYebfDyCYQZ_eCUdkKVC075GtJxLxnR?usp=sharing",
    },
    {
      title: "Computer Science Grade 11 & 12",
      imgUrl: purpleFolder,
      link: "https://worried-reply-92e.notion.site/comp-sci-d2f38de630084cd3855026d61d048aca?pvs=73",
    },
  ];

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  return (
    <section className="notes" id="notes">
      <Container>
        <Row>
          <Col size={12}>
            <h2>Notes Bank</h2>
            <p>
              Check out my <strong className="purple">previous notes</strong>!
              From <strong className="purple">IB courses</strong> to high school
              subjects, these notes are packed with{" "}
              <strong className="purple">essential insights</strong>
              <br /> and key concepts to help you{" "}
              <strong className="purple">study more efficiently</strong>. Feel
              free to browse, download, and{" "}
              <strong className="purple">make the most</strong> out of these
              resources.
            </p>
            <Slider {...settings} className="custom-slider">
              {notes.map((note, index) => {
                return <NoteCard key={index} {...note} />;
              })}
            </Slider>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
