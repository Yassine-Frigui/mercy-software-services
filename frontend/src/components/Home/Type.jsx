import React from "react";
import Typewriter from "typewriter-effect";
import { useTranslation } from "react-i18next";

function Type() {
  const { t } = useTranslation();
  return (
    <Typewriter
      options={{
        strings: t('type.strings', { returnObjects: true }),
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
        pauseFor: 1000,
      }}
    />
    
  );
}

export default Type;
