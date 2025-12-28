import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "Full Stack Developer",
          "UI/UX Designer",
          "Software Engineer"
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
        pauseFor: 1000,
      }}
    />
    
  );
}

export default Type;
