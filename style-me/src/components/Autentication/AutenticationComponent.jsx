import "./AutenticationComponent.scss";
import Typed from "typed.js";
import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import { login1 } from "../../services/ApiServices";

const AutenticationComponent = () => {
  // eslint-disable-next-line
  {/* eslint-disable jsx-a11y/anchor-is-valid */ }
  const el = useRef(null);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSenha = (event) => {
    setSenha(event.target.value);
  };

  function login(email, senha) {
    console.log(email, senha)

    const formData = new FormData();
    formData.append("email", email);
    formData.append("senha", senha);
    login1(formData);
  }

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["MODELANDO A </br> WEB COM </br> ESTILO E </br> CRIATIVIDADE", "APRENDA </br> CRIE </br> PRATIQUE </br> EVOLUA"],
      startDelay: 500,
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 2000,
      loop: true
    });

    return () => {
      typed.destroy();
    };
  }, []);
  return (
    <>
      <div className="MainContainer">
        <div className="formContainer">
          <div className="LoginContainer">
            <div className="LeftContainer">
              <div className="LoginSection">
                <img src="./images/logo.svg" alt="Logo do site" />
                <div className="separador"></div>
                <div className="inputSection">
                  <input type="text" placeholder="Usuário" onChange={handleEmail}/>
                  <input type="password" placeholder="Senha" onChange={handleSenha}/>
                  <button className="loginButton" onClick={() => {login(email, senha);}}>Enviar</button>
                  <Link to="/challenges" className="loginLink">
                    
                  </Link>
                  <Link to="/new-profile" className="loginLink">
                    <button className="registerButton">Criar Conta</button>
                  </Link>
                  <Link to="/recover-password">
                    <a className="forgotPassword">Esqueceu a senha?</a>
                  </Link>
                </div>

              </div>
            </div>
            <div className="backGroundRight">
              <div className="rightContainer">
                <div className="centerDiv">
                  <span ref={el}></span>
                  <p>CSS: A ferramenta que dá vida à Web - Aprenda e Crie</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AutenticationComponent;
