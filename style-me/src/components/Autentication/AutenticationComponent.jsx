import "./AutenticationComponent.scss";
import Typed from "typed.js";
import { useEffect, useRef } from "react";

const AutenticationComponent = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["MODELANDO A WEB COM </br> ESTILO E </br> CRIATIVIDADE"],
      startDelay: 500,
      typeSpeed: 70,
      backSpeed: 200,
      backDelay: 100,
    });

    // Destropying
    return () => {
      typed.destroy();
    };
  }, []);
  return (
    <>
      <div className="MainContainer">
        <div className="LoginContainer">
          <div className="LeftContainer">
            <div className="LoginSection">
              <img src="./images/logo.svg" alt="Logo do site" />
              <div className="separador"></div>
              <div className="inputSection">
                <input type="text" placeholder="Usuário" />
                <input type="text" placeholder="Senha" />
                <input type="submit" placeholder="Submit" />
                <a href="#/">Esqueceu a senha?</a>
              </div>
            </div>
          </div>
          <div className="rightContainer">
            <div className="centerDiv">
              <span ref={el}></span>
              <p>CSS: A ferramenta que dá vida à Web - Aprenda e Crie</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AutenticationComponent;
