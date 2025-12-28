import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import development from "../../Assets/lotties/development.json";
import Lottie from "lottie-react";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";
import { useTranslation } from "react-i18next";

import {
  AiFillGithub,
  AiOutlineWhatsApp,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Home() {
  const { t } = useTranslation();
  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content">
          <Row>
            <Col md={7} className="home-header" style={{ padding:50 }}>
            <div className="text-start" style={{ paddingBottom: 50 }}>
                <Type />
              </div>
           
              <h1 className="heading-name text-start">
                {t('home.yourVision')} , 
                <strong className="main-name text-star"> {t('home.ourMission')}</strong>
              </h1>


   
              <h1 style={{ paddingTop: 50 }} className="heading purple  ">


                <div className="word-viewport text-start-wheel">
                  <div className="word-wheel ">
                      <span >{t('home.inspiration')}</span>
                      <span >{t('home.innovation')}</span>
                      <span >{t('home.vision')}</span>
                      <span >{t('home.excellence')}</span>
                      <span >{t('home.inspiration')}</span>

                  </div>
                </div>
              
              </h1>

              
            </Col>

            <Col md={5} style={{ paddingBottom: 20 }}>
              <Lottie
                animationData={development}
                style={{ maxHeight: "450px" }}
              />
            </Col>
          </Row>
        </Container>
      </Container>
      <Home2 />

      <Container>
        <Row style={{ paddingTop: "50px", paddingBottom: "80px" }}>
          <Col md={12} className="home-about-social">
            <h1>{t('home.findUsOn')}</h1>
            {/* <p>
              Feel free to <span className="purple">connect </span>with me
            </p> */}
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href="whatsapp.url/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiOutlineWhatsApp />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.instagram.com/mercy_software_services/  "
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                >
                  <AiFillInstagram />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Home;
