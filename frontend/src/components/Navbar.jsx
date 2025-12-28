import React, { useState } from "react";
import { Link } from "react-router-dom";

function NavBar() {
  const [navColour, updateNavbar] = useState(false);

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  window.addEventListener("scroll", scrollHandler);

  return (
    <nav className={`navbar ${navColour ? "sticky" : "navbar"}`} style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 2rem' }}>
        <h1 style={{color: 'red', position: 'absolute', top: '10px', left: '10px', zIndex: 9999}}>NAVBAR IS HERE</h1>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src="/logo_.png" alt="brand" style={{ height: "45px", width: "45px", marginRight: "30px" }} />
          <span style={{ paddingTop: "8px", color: 'var(--imp-text-color)', fontWeight: 'bold' }}>Mercy Software Services</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
            <li style={{ margin: '0 10px' }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Home
              </Link>
            </li>
            <li style={{ margin: '0 10px' }}>
              <Link to="/objectives" style={{ textDecoration: 'none', color: 'inherit' }}>
                Objectives
              </Link>
            </li>
            <li style={{ margin: '0 10px' }}>
              <Link to="/service" style={{ textDecoration: 'none', color: 'inherit' }}>
                Services
              </Link>
            </li>
          </ul>
          <div style={{ display: 'flex', marginLeft: '20px' }}>
            <button style={{ margin: '0 5px', padding: '5px 10px' }}>EN</button>
            <button style={{ margin: '0 5px', padding: '5px 10px' }}>FR</button>
            <button style={{ margin: '0 5px', padding: '5px 10px' }}>AR</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
