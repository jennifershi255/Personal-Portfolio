import TiltedCard from "./TiltedCard";
import italy from "../assets/img/italy-vlog.png";
import newYork from "../assets/img/newYork.png";

export const Travel = () => {
  return (
    <div id="travel" className="travel">
      <h2 className="section-heading">Travel</h2>
      <p>
        {" "}
        Some travel vlogs I made! See more on my{" "}
        <a href="/travel" className="purple">
          <strong>travel page</strong>
        </a>
        !
      </p>
      <div className="card-container">
        <TiltedCard
          imageSrc={italy}
          captionText="italy vlog- youtube"
          containerHeight="clamp(250px, 40vw, 350px)"
          containerWidth="clamp(280px, 80vw, 500px)"
          imageHeight="clamp(250px, 40vw, 350px)"
          imageWidth="clamp(280px, 80vw, 500px)"
          rotateAmplitude={12}
          scaleOnHover={1.2}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={true}
          link="https://youtu.be/tR-0iuq9yCQ?si=9Ym6neh0KDWA_efh"
        />
        <TiltedCard
          imageSrc={newYork}
          captionText="new york vlog- youtube"
          containerHeight="clamp(250px, 40vw, 350px)"
          containerWidth="clamp(280px, 80vw, 500px)"
          imageHeight="clamp(250px, 40vw, 350px)"
          imageWidth="clamp(280px, 80vw, 500px)"
          rotateAmplitude={12}
          scaleOnHover={1.2}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={true}
          link="https://youtu.be/23AMHv1Rfi0?si=5nJpnSE03vHvIY52"
        />
      </div>
    </div>
  );
};
