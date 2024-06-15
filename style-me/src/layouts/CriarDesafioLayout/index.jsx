import React, { useState, useEffect, useRef } from "react";
import "./CriarDesafio.scss";
import Header from "../../components/Header/Header";
import DesafioComponent from "../../components/DesafioComponent";

const CriarDesafio = () => {
  const [img, setImg] = useState();
  const [imgType, setImgType] = useState();
  const [totalScore, setTotalScore] = useState();
  const [username, setUsername] = useState();
  const [dificuldade, setDificuldade] = useState("");
  const [telaAtual, setTelaAtual] = useState(1);
  const [descricao, setDescricao] = useState("");
  const [numeroDeCaixas, setNumeroDeCaixas] = useState(0);
  const [title, setTitle] = useState("");
  const [cssSolucao, setCssSolucao] = useState("");
  const [cssBase, setCssBase ] = useState("");
  const [htmlBase, setGameHtmlBase] = useState("");

  const goBack = () => {
    window.history.back();
  };

  //Variaveis usadas para integrar com o back
    // title
    // dificuldade
    // descricao
    // htmlBase
    // cssBase
    // cssSolucao

  const handleDificuldadeChange = (event) => {
    setDificuldade(event.target.value);
  };

  const handleDescricao = (event) => {
    setDescricao(event.target.value);
  };

  const handleNumeroDeCaixas = (event) => {
    setNumeroDeCaixas(event.target.value);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleTela = () => {
    if (telaAtual === 1) {
      setTelaAtual(2);
    }
    if (telaAtual === 2) {
      setTelaAtual(1);
    }
  };

  return (
    <div className="TelaDeDesafio">
      <Header
        username={username}
        img={img}
        imgType={imgType}
        totalScore={totalScore}
      />
      {telaAtual == 1 ? (
        <div className="DesafioBody">
          <div className="divEnviar">
            <span className="InputLabel">Título</span>
            <input
              type="text"
              className="Input title"
              onInput={handleTitle}
              value={title}
            />
            <span className="InputLabel">Dificuldade</span>
            <select
              type="text"
              className="Input admin select"
              id="Dificuldade"
              value={dificuldade}
              onChange={handleDificuldadeChange}
            >
              <option value="1" className="values">
                Fácil
              </option>
              <option value="2" className="values">
                Médio
              </option>
              <option value="3" className="values">
                Difícil
              </option>
            </select>
            {dificuldade === "2" && (
              <>
                <span className="InputLabel">Numero De Caixas</span>
                <select
                  type="text"
                  className="Input admin select"
                  id="NumeroDeCaixas"
                  value={numeroDeCaixas}
                  onChange={handleNumeroDeCaixas}
                >
                  <option value="1" className="values">
                    1
                  </option>
                  <option value="2" className="values">
                    2
                  </option>
                  <option value="3" className="values">
                    3
                  </option>
                </select>
              </>
            )}
            <span className="InputLabel">Descrição</span>
            <input
              type="text"
              className="Input description"
              onInput={handleDescricao}
              value={descricao}
            />
            <button className="concluir" onClick={handleTela}>
              Avançar
            </button>
            <button className="voltar" onClick={goBack}>
              Voltar
            </button>
          </div>
        </div>
      ) : (
        <DesafioComponent
          goBack={handleTela}
          descricao={descricao}
          numeroDeCaixas={numeroDeCaixas}
          setCssSolucao={setCssSolucao}
          setCssBase={setCssBase}
          setGameHtmlBase={setGameHtmlBase}
        />
      )}
    </div>
  );
};

export default CriarDesafio;
