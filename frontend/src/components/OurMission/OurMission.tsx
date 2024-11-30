import "./OurMission.css";

const OurMission = () => {
  return (
    <section className="our-mission-container">
      <img
        className="our-mission-img"
        // src="https://local-wild-images.s3.us-east-1.amazonaws.com/whale.png"
        src="/assets/images/whale.png"
        alt="whale"
      />
      <div className="our-mission-text">
        <h3>Our Mission</h3>
        <p>this is our mission</p>
      </div>
    </section>
  );
};

export default OurMission;
