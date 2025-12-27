import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import development from "../../Assets/lotties/development.json";
import Lottie from "lottie-react";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";

import {
  AiFillGithub,
  AiOutlineWhatsApp,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Home() {
  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content">
          <Row>
            <Col md={7} className="home-header">
            <div style={{ padding: 50, textAlign: "left" }}>
                <Type />
              </div>
           
              <h1 className="heading-name">
                Your vision , 
                <strong className="main-name"> Our mission</strong>
              </h1>


   
              <h1 style={{ paddingTop: 50 }} className="heading purple  ">


                <div className="word-viewport">
                  <div className="word-wheel">
                      <span >Inspiration</span>
                      <span >Innovation</span>
                      <span >Vision</span>
                      <span >Excellence</span>
                      <span >Inspiration</span>

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
            <h1>Find Us On</h1>
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
