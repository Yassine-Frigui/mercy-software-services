// @flow strict

import * as React from 'react';

function ServiceCard({ service }) {

  return (
    <div className="service-card">
      <div className="top-bars">
        <div className="bar left"></div>
        <div className="bar right"></div>
      </div>"
      <div className="header">
        <div className="dots">
          <div className="dot red"></div>
          <div className="dot orange"></div>
          <div className="dot green"></div>
        </div>
        <p className="title">
          {service.name}
        </p>
      </div>
      <div className="code-area">
        <code>
          

         
          
          <div className="ml-4 lg:ml-8 mr-2">
            {/* <span className="fs-2">Description:</span> */}
               <div><span className="fs-5">{`{`}</span></div>
            <span className="text-white fw-bold fs-4 justify-content-center">{' ' + service.description}</span>
                      </div>
          <div><span className="fs-5">{`};`}</span></div>
        </code>
      </div>
    </div>
  );
};

export default ServiceCard;