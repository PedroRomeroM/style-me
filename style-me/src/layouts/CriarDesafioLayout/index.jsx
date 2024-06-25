import React, { useState, useEffect, useRef } from "react";
import "./CriarDesafio.scss";
import Header from "../../components/Header/Header";
import DesafioComponent from "../../components/DesafioComponent";
import Message from "../../components/UsuarioCriado";
import EditarDesafioComponent from "../../components/EditarDesafioComponent/EditarDesafioComponent";
import {
  getUserInfo,
  getTypeUser,
  createChallenge,
  getChallengeInfo,
  updateChallenge,
} from "../../services/ApiServices";
import { useLocation } from "react-router-dom";

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
  const [cssBase, setCssBase] = useState("");
  const [htmlBase, setGameHtmlBase] = useState("");
  const { state } = useLocation();
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState();

  const [isSelectedGreen, setIsSelectedGreen] = useState();
  const [isSelectedYellow, setIsSelectedYellow] = useState();
  const [isSelectedRed, setIsSelectedRed] = useState();

  const [isCreateCh, setCreateCh] = useState();

  const [isCreated, setIsCreated] = useState("");
  const [isUpdated, setIsUpdated] = useState("");

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const res = localStorage.getItem("auth");
    const parsed = JSON.parse(res);
    const token = parsed.token;

    if (state.isEditar === "OK") {
      const chInfo = getChallengeInfo(token, state.id);
      chInfo
        .then((res) => {
          setTitle(res.data.title);
          setDescricao(res.data.description);
          setDificuldade(res.data.level);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    getUsersInfo(token);
    getTipoUser(token);
    setCreateCh(true);
  }, [profile]);

  const countQuadrados = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const quadrados = div.getElementsByClassName("quadrado");
    return quadrados.length;
  };

  useEffect(() => {
    if (state.isEditar === "OK") {
      const res = localStorage.getItem("auth");
      const parsed = JSON.parse(res);
      const token = parsed.token;

      const chInfo = getChallengeInfo(token, state.id);

      chInfo
        .then((res) => {
          setNumeroDeCaixas(countQuadrados(res.data.html));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  function getUsersInfo(token) {
    const profile = getUserInfo(token);
    profile
      .then((res) => {
        setUsername(res.data.username);
        setImgType(res.data.imgType);
        setImg(res.data.img);

        if (res.data.totalScore === null) {
          setTotalScore(0);
        } else {
          setTotalScore(res.data.totalScore);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function getTipoUser(token) {
    const response = getTypeUser(token);
    response
      .then((res) => {
        if (res.data != "ADM") {
          setIsAdmin("false");
        } else {
          setIsAdmin("true");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

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

  const handleConcluir = () => {
    const res = localStorage.getItem("auth");
    const parsed = JSON.parse(res);
    const token = parsed.token;

    const response = createChallenge(
      token,
      title,
      dificuldade,
      descricao,
      htmlBase,
      cssBase,
      cssSolucao
    );
    response
      .then((res) => {
        if (res.status === 200) {
          setIsCreated("true");
        } else {
          setIsCreated("false");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleEditar = () => {
    const res = localStorage.getItem("auth");
    const parsed = JSON.parse(res);
    const token = parsed.token;

    const response = updateChallenge(
      token,
      state.id,
      title,
      dificuldade,
      descricao,
      htmlBase,
      cssBase,
      cssSolucao
    );

    response
      .then((res) => {
        if (res.status === 200) {
          setIsUpdated("true");
        } else {
          setIsUpdated("false");
        }
      })
      .catch((e) => {
        console.log(e);
      });

  };

  function checkIsCreated() {
    if (isCreated === "true") {
      return <Message text={"Desafio criado com sucesso!"} isError={false} />;
    } else if (isCreated === "false") {
      return <Message text={"Erro ao criar o desafio!"} isError={true} />;
    }
  }

  function checkIsUpdated() {
    if (isUpdated === "true") {
      return <Message text={"Desafio editado com sucesso!"} isError={false} />;
    } else if (isCreated === "false") {
      return <Message text={"Erro ao editar o desafio!"} isError={true} />;
    }
  }

  function checkLevel() {
    const level = state.color;

    if (level === 'green') {
      return (
        <select
          type="text"
          className="Input admin select"
          id="Dificuldade"
          value={dificuldade}
          onChange={handleDificuldadeChange}
        >
          <option disabled value="0" className="values">
            Selecione a dificuldade
          </option>
          <option selected value="1" className="values">
            Fácil
          </option>
          <option disabled value="2" className="values">
            Médio
          </option>
          <option disabled value="3" className="values">
            Difícil
          </option>
        </select>
      )
    }
    if (level === 'yellow') {
      return (
        <select
          type="text"
          className="Input admin select"
          id="Dificuldade"
          value={dificuldade}
          onChange={handleDificuldadeChange}
        >
          <option disabled value="0" className="values">
            Selecione a dificuldade
          </option>
          <option disabled value="1" className="values">
            Fácil
          </option>
          <option selected value="2" className="values">
            Médio
          </option>
          <option disabled value="3" className="values">
            Difícil
          </option>
        </select>
      )
    }
    if (level === 'red') {
      return (
        <select
          type="text"
          className="Input admin select"
          id="Dificuldade"
          value={dificuldade}
          onChange={handleDificuldadeChange}
        >
          <option disabled value="0" className="values">
            Selecione a dificuldade
          </option>
          <option disabled value="1" className="values">
            Fácil
          </option>
          <option disabled value="2" className="values">
            Médio
          </option>
          <option selected value="3" className="values">
            Difícil
          </option>
        </select>
      )
    }

  }

  return (
    <div className="TelaDeDesafio">
      <Header
        username={username}
        img={img}
        imgType={imgType}
        totalScore={totalScore}
        isAdmin={isAdmin}
      />
      {checkIsCreated()}
      {checkIsUpdated()}
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
            {
              checkLevel()
            }
            {(state.color == "yellow" || state.color == "red" || dificuldade == 2 || dificuldade == 3) && (
              <>
                <span className="InputLabel">Numero De Caixas</span>
                <select
                  type="text"
                  className="Input admin select"
                  id="NumeroDeCaixas"
                  value={numeroDeCaixas}
                  onChange={handleNumeroDeCaixas}
                >
                  <option value="0" className="values">
                    Selecione o número de caixas
                  </option>

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
      ) : state.isEditar === "OK" ? (
        <EditarDesafioComponent
          goBack={handleTela}
          descricao={descricao}
          dificuldade={dificuldade}
          numeroDeCaixas={numeroDeCaixas}
          setCssSolucao={setCssSolucao}
          setCssBase={setCssBase}
          setGameHtmlBase={setGameHtmlBase}
          handleEditar={handleEditar}
          isCreateCh={isCreateCh}
          isEditar={state.isEditar}
          chId={state.id}
        />
      ) : (
        <DesafioComponent
          goBack={handleTela}
          descricao={descricao}
          dificuldade={dificuldade}
          numeroDeCaixas={numeroDeCaixas}
          setCssSolucao={setCssSolucao}
          setCssBase={setCssBase}
          setGameHtmlBase={setGameHtmlBase}
          handleConcluir={handleConcluir}
          isCreateCh={isCreateCh}
        />
      )}
    </div>
  );
};

export default CriarDesafio;
