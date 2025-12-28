import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Lottie from "lottie-react";
import Tilt from "react-parallax-tilt";
import build from "../../Assets/lotties/build_2.json";
import { useTranslation } from "react-i18next";

function Home2() {
  const { t } = useTranslation();
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }} dangerouslySetInnerHTML={{ __html: t('home2.ourMission') }}>
            </h1>
            <p className="home-about-body text-start" dangerouslySetInnerHTML={{ __html: t('home2.missionText') }}>
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
