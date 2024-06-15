import React, { useState } from "react";
import "./MensagemDeErro.scss";

const ErrorMessage = ({ color, errorMessage }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <h1 className="UserCreatedH1">{errorMessage}</h1>
    </>
  );
};

export default ErrorMessage;
