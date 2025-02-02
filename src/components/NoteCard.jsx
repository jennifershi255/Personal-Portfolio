import React, { useEffect } from "react";

export const NoteCard = ({ title, description, imgUrl, link }) => {
  useEffect(() => {
    const cards = document.querySelectorAll(".note-card");

    cards.forEach((card) => {
      card.onmousemove = function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--x", x + "px");
        card.style.setProperty("--y", y + "px");
      };

      card.addEventListener("mouseenter", () => {
        card.classList.add("animate__animated", "animate__pulse");
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("animate__animated", "animate__pulse");
      });
    });
  }, []);

  return (
    <a
      href={link}
      target="_blank"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="note-card" style={{ "--clr": "#b7bbff" }}>
        <img src={imgUrl} alt={title} />
        <div className="note-content">
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
      </div>
    </a>
  );
};
