import React, { useState, useEffect } from "react";
import Preloader from "../src/components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import Objectives from "./components/About/Objectives";
import Services from "./components/Services/Services";
import Footer from "./components/Footer";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import { useTranslation } from "react-i18next";

function App() {
  const [load, upadateLoad] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const isRTL = i18n.language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;

    // Add RTL CSS if needed
    // if (isRTL) {
    //   const link = document.createElement('link');
    //   link.rel = 'stylesheet';
    //   link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css';
    //   document.head.appendChild(link);
    // } else {
    //   // Remove RTL CSS if switching back
    //   const rtlLink = document.querySelector('link[href*="bootstrap.rtl"]');
    //   if (rtlLink) rtlLink.remove();
    // }
  }, [i18n.language]);

  return (
    <Router>
      <Preloader load={load} />
      <div className={`App ${i18n.language === 'ar' ? 'rtl' : ''}`} id={load ? "no-scroll" : "scroll"}>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service" element={<Services />} />
          <Route path="/objectives" element={<Objectives />} />
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
