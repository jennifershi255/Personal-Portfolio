import TiltedCard from "./TiltedCard";
import italy from "../assets/img/italy-vlog.png";
import spain from "../assets/img/spain-vlog.png";

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
          containerHeight="300px"
          containerWidth="450px"
          imageHeight="300px"
          imageWidth="450px"
          rotateAmplitude={12}
          scaleOnHover={1.2}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={true}
          link="https://youtu.be/tR-0iuq9yCQ?si=9Ym6neh0KDWA_efh"
        />
        <TiltedCard
          imageSrc={spain}
          captionText="spain vlog- youtube"
          containerHeight="300px"
          containerWidth="450px"
          imageHeight="300px"
          imageWidth="450px"
          rotateAmplitude={12}
          scaleOnHover={1.2}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={true}
          link="https://youtu.be/dQw4w9WgXcQ?si=n-20Ofezd475fwTK"
        />
      </div>
    </div>
  );
};
