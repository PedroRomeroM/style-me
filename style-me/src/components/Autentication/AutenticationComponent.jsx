import "./AutenticationComponent.scss";

const AutenticationComponent = () => {
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
                <p>MODELANDO A WEB COM ESTILO E CRIATIVIDADE</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AutenticationComponent;
