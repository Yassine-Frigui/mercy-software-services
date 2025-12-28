import React from "react";
import Typewriter from "typewriter-effect";
import { useTranslation } from "react-i18next";

function Type() {
  const { t } = useTranslation();
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
