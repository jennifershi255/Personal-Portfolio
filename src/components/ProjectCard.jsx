import { Col } from "react-bootstrap";
import React, { useEffect } from "react";
import external from "../assets/img/external-link.png";

export const ProjectCard = ({
  title,
  description,
  imgUrl,
  techImg1,
  techImg2,
  techImg3,
  link,
}) => {
  useEffect(() => {
    const cards = document.querySelectorAll(".proj-card");

    // function for the glowing mouse hover effect
    cards.forEach((card) => {
      card.onmousemove = function (e) {
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--x", x + "px");
        card.style.setProperty("--y", y + "px");
      };

      // Adding animations to the card when the mouse hovers over it
      card.addEventListener("mouseenter", () => {
        card.classList.add("animate__animated", "animate__pulse");
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("animate__animated", "animate__pulse");
      });
    });
  }, []);
  return (
    <Col size={12} sm={6} md={4}>
      <div className="card-container">
        <div className="proj-card" style={{ "--clr": "#b7bbff" }}>
          <img src={imgUrl} />
          <div className="proj-content">
            <h4>{title}</h4>
            <p>{description}</p>
            <div className="tech-images">
              {techImg1 && (
                <div className="img-container">
                  <img src={techImg1} alt="Tech 1" />
                </div>
              )}
              {techImg2 && (
                <div className="img-container">
                  <img src={techImg2} alt="Tech 2" />
                </div>
              )}
              {techImg3 && (
                <div className="img-container">
                  <img src={techImg3} alt="Tech 3" />
                </div>
              )}
            </div>
          </div>

          <a href={link} target="_blank" className="proj-button">
            See More
            <img src={external} className="external-link-icon" />
          </a>
        </div>
      </div>
    </Col>
  );
};
