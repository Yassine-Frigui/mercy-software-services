import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import objectivesData from "../../Assets/objectives.json";
import { useTranslation } from "react-i18next";

import Lottie from "lottie-react";
import developmentAnimation from "../../Assets/lotties/contact.json";

function Objectives() {
  const { t } = useTranslation();
  const [activeZone, setActiveZone] = useState(null);
  const mainObjective = objectivesData.find(obj => obj.isMain);
  const secondaryObjectives = objectivesData.filter(obj => !obj.isMain);
  const zoneClasses = ["left", "bottom", "top", "right"];

  return (
    <>
      <Particle />
      <Container fluid className="objectives-section">
        <Container>
          <h1 style={{ fontSize: "2.1em", paddingBottom: "20px", textAlign: "center", color: "white" }}>
            {t('objectives.title').split(' ').slice(0, 1).join(' ')} <strong className="purple">{t('objectives.title').split(' ')[1]}</strong>
          </h1>
          <div className="objectives-wrapper" style={{ position: 'relative' }}>
            <div className="objectives-diagram">
            <svg className="connections" width="600" height="600" style={{position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)'}}>
              {secondaryObjectives.map((obj, index) => {
              const angles = [45, 135, 225, 315]; // NE, NW, SW, SE
              const angle = angles[index];
              const rad = (angle * Math.PI) / 180;
              const x = 300 + 180 * Math.cos(rad);
              const y = 300 + 180 * Math.sin(rad);
                return <line key={`line-${index}`} x1="300" y1="300" x2={x} y2={y} stroke="#c770f0" strokeWidth="4" />;
              })}
            </svg>
            {/* Central Objective */}
            <div className="objective main-objective" data-zone="center">
              <h3>{t('objectivesData.main.title')}</h3>
            </div>
            {/* Secondary Objectives */}
            {secondaryObjectives.map((obj, index) => {
              const angles = [45, 135, 225, 315]; // NE, NW, SW, SE
              const angle = angles[index];
              return (
                <div
                  key={obj.id}
                  className="objective secondary-objective"
                  data-zone={zoneClasses[index]}
                  style={{
                    '--angle': `${angle}deg`
                  }}
                  onMouseEnter={() => setActiveZone(zoneClasses[index])}
                  onMouseLeave={() => setActiveZone(null)}
                >
                  <h4>{t(`objectivesData.${obj.id}.title`)}</h4>
                </div>
              );
            })}
          </div>
          {/* Overlay and Zones for Hover Effect */}
          <div className={`overlay ${activeZone ? 'active' : ''}`}></div>
          {["center", "left", "bottom", "top", "right"].map(zone => {
            const objIndex = ["center", "left", "bottom", "top", "right"].indexOf(zone);
            const obj = objIndex === 0 ? mainObjective : secondaryObjectives[objIndex - 1];
            return (
              <div key={zone} className={`zone ${zone} ${activeZone === zone ? 'active' : ''}`}>
                {activeZone === zone && (
                  <>
                    <p>{t(`objectivesData.${obj.id}.description`)}</p>
                  </>
                )}
              </div>
            );
          })}
          </div>
          {/* Contact Section */}
          <h1 className="project-heading">
            {t('objectives.getInTouch').split(' ').slice(0, 2).join(' ')} <strong className="purple">{t('objectives.getInTouch').split(' ')[2]}</strong>
          </h1>
          <Row style={{ justifyContent: "center", padding: "20px" }}>
            <Col className="text-start"  md={6} style={{ color: "white" }}>
              <p style={{ fontSize: "1.1em" }}>
                {t('objectives.contactText')}
              </p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "10px" }}>
                  <strong>{t('objectives.email')}</strong> contact@businessidea.com
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>{t('objectives.phone')}</strong> +1 (123) 456-7890
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>{t('objectives.linkedin')}</strong> <a href="https://linkedin.com/company/businessidea" target="_blank" rel="noopener noreferrer" style={{ color: "#c770f0" }}>linkedin.com/company/businessidea</a>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>{t('objectives.website')}</strong> <a href="https://businessidea.com" target="_blank" rel="noopener noreferrer" style={{ color: "#c770f0" }}>businessidea.com</a>
                </li>
              </ul>
            </Col>
            <Col md={6} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Lottie animationData={developmentAnimation} loop={true} style={{ maxWidth: "300px" }} />
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default Objectives;
