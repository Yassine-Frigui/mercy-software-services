import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Lottie from "lottie-react";
import Tilt from "react-parallax-tilt";
import build from "../../Assets/lotties/build_2.json";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              Our <span className="purple"> Mission </span> 
            </h1>
            <p className="home-about-body">
              Mercy Software Services delivers modern, reliable, and tailored web solutions for businesses seeking a strong and efficient online presence. We specialize in 
              <b className="purple"> Web development</b>,
               <b className="purple">CMS integration</b>, and <b className="purple">custom admin dashboards</b>
               , with a focus on clarity, performance, and scalability.
              <br />
              <br />
              Every project is approached with a practical mindset, ensuring solutions that are easy to manage, aligned with business goals, and built to grow over time.
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <Lottie animationData={build} loop={true} style={{ maxWidth: '300px', margin: '0 auto' }} />
            </Tilt>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
