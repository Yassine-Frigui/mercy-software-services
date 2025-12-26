import React, { useState, useEffect, useCallback, useRef } from 'react';
import { projectsData } from '../projects-data';
import ProjectCard from './ProjectCard';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import Particle from '../Particle';
import Lottie from 'lottie-react';
import codeAnimation from '../../Assets/lotties/code.json';

const Projects = () => {
  const [websiteType, setWebsiteType] = useState('basic');
  const [designLevel, setDesignLevel] = useState('standard');
  const [cms, setCms] = useState('');
  const [extraFeatures, setExtraFeatures] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [autoSaved, setAutoSaved] = useState(false);
  const saveTimeoutRef = useRef(null);

  const generateSessionId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}-${random}`;
  };

  useEffect(() => {
    let id = sessionStorage.getItem('portfolioSessionId');
    if (!id) {
      id = generateSessionId();
      sessionStorage.setItem('portfolioSessionId', id);
    }
    setSessionId(id);

    // Load draft
    fetch(`http://localhost:3001/api/drafts/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.formData) {
          setWebsiteType(data.formData.websiteType || 'basic');
          setDesignLevel(data.formData.designLevel || 'standard');
          setCms(data.formData.cms || '');
          setExtraFeatures(data.formData.extraFeatures || []);
          setEmail(data.formData.email || '');
          setPhone(data.formData.phone || '');
        }
      })
      .catch(err => console.log('No draft found or error loading', err));
  }, []);

  const prices = {
    websiteType: { basic: 500, corporate: 1000, ecommerce: 1500 },
    designLevel: { standard: 200, custom: 500, premium: 800 },
    cms: { none: 0, basic: 300, custom: 750 },
    extraFeatures: { seo: 100, maintenance: 150, payment: 200, multilang: 250 }
  };

  useEffect(() => {
    let price = 0;
    if (websiteType) price += prices.websiteType[websiteType];
    if (designLevel) price += prices.designLevel[designLevel];
    if (cms && cms !== 'custom') price += prices.cms[cms];
    extraFeatures.forEach(feature => {
      price += prices.extraFeatures[feature];
    });
    if (cms === 'custom') {
      const minPrice = price + 500;
      const maxPrice = price + 1000;
      setTotalPrice(`${minPrice}-${maxPrice}`);
    } else {
      setTotalPrice(price);
    }
  }, [websiteType, designLevel, cms, extraFeatures]);

  const saveDraft = useCallback(() => {
    const formData = {
      websiteType,
      designLevel,
      cms,
      extraFeatures,
      email,
      phone
    };
    fetch('http://localhost:3001/api/drafts/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, formData, timestamp: new Date().toISOString() })
    })
    .then(res => res.json())
    .then(() => {
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    })
    .catch(err => console.log('Save failed', err));
  }, [websiteType, designLevel, cms, extraFeatures, email, phone, sessionId]);

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (phone) {
        saveDraft();
      }
    }, 1500);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [phone]);

  const handleExtraFeatureChange = (feature, checked) => {
    if (checked) {
      setExtraFeatures([...extraFeatures, feature]);
    } else {
      setExtraFeatures(extraFeatures.filter(f => f !== feature));
    }
  };

  const handleRequestQuote = () => {
    const cmsDisplay = cms === 'custom' ? 'Custom Admin Dashboard' : cms === 'basic' ? 'Basic CMS' : cms || 'Not selected';
    const payload = {
      websiteType: websiteType || 'Not selected',
      designLevel: designLevel || 'Not selected',
      cms: cmsDisplay,
      extraFeatures: extraFeatures.length > 0 ? extraFeatures : [],
      totalEstimatedPrice: totalPrice,
      email: email || '',
      phone: phone || ''
    };
    console.log(JSON.stringify(payload, null, 2));
    const summary = `
Website Type: ${payload.websiteType}
Design Level: ${payload.designLevel}
CMS / Dashboard: ${payload.cms}
Extra Features: ${payload.extraFeatures.length > 0 ? payload.extraFeatures.join(', ') : 'None'}
Total Estimated Price: $${payload.totalEstimatedPrice}
Email: ${payload.email || 'Not provided'}
Phone: ${payload.phone || 'Not provided'}
    `;
  };

  return (
    <Container fluid className="project-section">
      <Particle />

      {/* Hero Section */}
      <Container className="hero-section py-5">
        <Row className="align-items-center">
          <Col md={7}>
            <h1 style={{ fontSize: "3rem", paddingBottom: "20px", color: "white" }}>
              Discover My <strong className="purple">Projects</strong>
            </h1>
            <p style={{ color: "white", fontSize: "1.2rem", textAlign: "justify" }}>
              Explore a collection of innovative projects showcasing my skills in web development, mobile apps, and more. Each project reflects my passion for creating impactful solutions.
            </p>
          </Col>
          <Col md={5} className="text-center">
            <Lottie animationData={codeAnimation} loop={true} style={{ maxWidth: '300px', margin: '0 auto' }} />
          </Col>
        </Row>
      </Container>

    <div id='projects' className="position-relative my-3 my-lg-5">
      <div className="position-sticky top-0">
        <div className="blur-bg"></div>
        <div className="d-flex align-items-center justify-content-center position-relative">
          <span className="projects-title">
            Our Services 
          </span>
            {/* <span className="projects-line"></span> */}
        </div>
      </div>

      <div className="pt-24">
        <div className="project-cards-border ">
          {projectsData.slice(0, 4).map((project, index) => (
            <div
              id={`sticky-card-${index + 1}`}
              key={index}
              className="sticky-card w-100 mx-auto"
            >
              <div className="d-flex align-items-center justify-content-center rounded  transition-all">
                <ProjectCard project={project} />
              </div>
            </div>
          ))}
        </div>

        {/* Section Before Form */}
        <div className="mt-5 text-center">
          <h1 className="project-heading">
            Let's <strong className="purple">Connect</strong>
          </h1>
          <p className="text-white">
            Have a project in mind or want to discuss opportunities? Fill out the form below to get in touch.
          </p>
        </div>

        {/* Form Component */}
        <div className="mt-5 d-flex justify-content-center">
          <Form className="text-white" style={{ maxWidth: '50rem', width: '100%' }}>
            {/* Website Type */}
            <Form.Group className="mb-3" style ={{paddingBottom: '50px'}}>
              <Form.Label className="purple">Website Type</Form.Label>
              <Form.Select value={websiteType} onChange={(e) => setWebsiteType(e.target.value)} style={{ backgroundColor: 'black', border: 'none', color: 'white' }}>
                <option value="basic">Basic</option>
                <option value="corporate">Corporate</option>
                <option value="ecommerce">E-commerce</option>
              </Form.Select>
            </Form.Group>

            {/* Design Level */}
            <Form.Group className="mb-3" style ={{paddingBottom: '50px'}}>
              <Form.Label className="purple ">Design Level</Form.Label>
              <Form.Select value={designLevel} onChange={(e) => setDesignLevel(e.target.value)} style={{ backgroundColor: 'black', border: 'none', color: 'white' }}>
                <option value="standard">Standard</option>
                <option value="custom">Custom</option>
                <option value="premium">Premium</option>
              </Form.Select>
            </Form.Group>

            {/* CMS / Dashboard */}
            <Form.Group className="mb-3" style ={{paddingBottom: '50px'}}>
              <Form.Label className="purple">CMS / Dashboard</Form.Label>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white">None</span>
                  <input type="radio" name="cms" value="none" onChange={(e) => setCms(e.target.value)} className="form-check-input" />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white">Basic CMS</span>
                  <input type="radio" name="cms" value="basic" onChange={(e) => setCms(e.target.value)} className="form-check-input" />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white">Custom Admin Dashboard ($500-$1000)</span>
                  <input type="radio" name="cms" value="custom" onChange={(e) => setCms(e.target.value)} className="form-check-input" />
                </div>
              </div>
            </Form.Group>

            {/* Extra Features */}
            <Form.Group className="mb-3" style ={{paddingBottom: '50px'}}>
              <Form.Label className="purple">Extra Features</Form.Label>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white">SEO</span>
                  <input type="checkbox" onChange={(e) => handleExtraFeatureChange('seo', e.target.checked)} className="form-check-input" />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white">Maintenance</span>
                  <input type="checkbox" onChange={(e) => handleExtraFeatureChange('maintenance', e.target.checked)} className="form-check-input" />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white">Payment Integration</span>
                  <input type="checkbox" onChange={(e) => handleExtraFeatureChange('payment', e.target.checked)} className="form-check-input" />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white">Multi-language support</span>
                  <input type="checkbox" onChange={(e) => handleExtraFeatureChange('multilang', e.target.checked)} className="form-check-input" />
                </div>
              </div>
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label className="purple">Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
              />
            </Form.Group>

            {/* Phone */}
            <Form.Group className="mb-3">
              <Form.Label className="purple">Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
              />
            </Form.Group>
{/* 
            {autoSaved && <div className="text-success mt-2 mb-3">Auto-saved</div>} */}
          </Form>
        </div>

        {/* Total Price and Button */}
        <div className="mt-3 text-center">
          <Button variant="primary" onClick={handleRequestQuote} className="mt-3">Request Quote</Button>
        </div>
      </div>
    </div>
    </Container> 
    );
  
};

export default Projects;