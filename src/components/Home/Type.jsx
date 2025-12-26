import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "Mercy Software Services",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
        pauseFor: 150000,
      }}
    />
    
  );
}

export default Type;
