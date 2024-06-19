import "./AutenticationComponent.scss";
import Typed from "typed.js";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { login1 } from "../../services/ApiServices";
import Message from "../../components/UsuarioCriado";

const AutenticationComponent = () => {
  // eslint-disable-next-line
  {/* eslint-disable jsx-a11y/anchor-is-valid */ }
  const el = useRef(null);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMsg, setErrorMsg] = useState();

  function auth(response){
    localStorage.setItem('auth', JSON.stringify(response));
    navigate(`/challenges`)
  }

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSenha = (event) => {
    setSenha(event.target.value);
  };

  const [errors, setErrors] = useState({});

  function login(email, senha) {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("senha", senha);

    const validationErrors = {};
    if (!email ) {
      validationErrors.email = "Email é obrigatório!"
    }
    if (!senha) {
      validationErrors.senha = "Senha é obrigatório!"
    }

    setErrors(validationErrors);


    if (Object.keys(validationErrors).length === 0) {
      var res = login1(formData);
      res.then(data => {
        var json = data.data
        if (data.status === 200) {
          auth(json)
        } else {
          alert('Erro no Login')
        }
      }).catch(e => {
        var err = e.response.data.message
        setErrorMsg(err)
        // alert('Erro ao fazer o login: ' + err)
      });
    }
  }

  function checkMsgErr () {
    if (errorMsg != null) {
      return (
        <Message text={'Erro ao fazer o login: ' + errorMsg} isError={true}/>
      )
    }
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
            {
               checkMsgErr() 
            }
            <div className="LeftContainer">
              <div className="LoginSection">
                <img src="./images/logo.svg" alt="Logo do site" />
                <div className="separador"></div>
                <div className="inputSection">
                  <input type="text" placeholder="Email" onChange={handleEmail}/>
                  {errors.email && <span className="formError">{errors.email}</span>}
                  <input type="password" placeholder="Senha" onChange={handleSenha}/>
                  {errors.senha && <span className="formError">{errors.senha}</span>}
                  <div className="loginLink">
                    <button className="loginButton" onClick={() => {login(email, senha);}}>Enviar</button>
                  </div>
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
