import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./Desafio.scss";
import Header from "../../components/Header/Header";
import { getUserInfo, getChallengeInfo, fetchGameHtml, fetchGameCss } from "../../services/ApiServices";
import { useLocation } from 'react-router-dom';

const initialCss = `#DESAFIO {\n\n}`;
const maxLines = 5;

const GameComponent = () => {
  const [gameHtml, setGameHtml] = useState("");
  const [cssText, setCssText] = useState(initialCss);
  const [gameCss, setGameCss] = useState(""); // Novo estado para o CSS do jogo
  const iframeRef = useRef(null);
  const editorRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const previousValueRef = useRef(initialCss);
  const [img, setImg] = useState();
  const [imgType, setimgType] = useState();
  const [totalScore, setTotalScore] = useState();
  const [username, setUsername] = useState();
  const { state } = useLocation();
  const [description, setDescription] = useState();

  useEffect(() => {
    const res = localStorage.getItem("auth");
    const parsed = JSON.parse(res);
    const token = parsed.token
    getUsersInfo(token);
    getChallengeInfoF(token, state.id);
  }, [profile]);

  function getChallengeInfoF(token, idCh) {
    const challenge = getChallengeInfo(token, idCh);
    challenge.then(res => {
      setDescription(res.data.description)
    }).catch(e => {
      console.log(e)
    });
  }

  function getUsersInfo(token) {
    const profile = getUserInfo(token);
    profile.then(res => {
      setUsername(res.data.username)
      setimgType(res.data.imgType)
      setImg(res.data.img)

      if (res.data.totalScore === null) {
        setTotalScore(0);
      } else {
        setTotalScore(res.data.totalScore)
      }
    }).catch(e => {
      console.log(e)
    });
  }

  useEffect(() => {
    const res = localStorage.getItem("auth");
    const parsed = JSON.parse(res);
    const token = parsed.token
    fetchGameHtml(token, state.id).then((html) => setGameHtml(html));
    fetchGameCss(token, state.id).then((css) => setGameCss(css));
  }, []);

  useEffect(() => {
    applyStyles();
  }, [cssText]);

  const extractContent = (value) => {
    const match = value.match(/#DESAFIO\s*{([^}]*)}/);
    return match ? match[1].trim() : "";
  };

  const applyStyles = () => {
    const iframeDocument = iframeRef.current.contentDocument;
    if (!iframeDocument) {
      console.error("iframeDocument is null");
      return;
    }

    const gameArea = iframeDocument.getElementById("ondeOCSSVaiSerAplicado");
    if (!gameArea) {
      console.error("gameArea is null");
      return;
    }

    let styleElement = iframeDocument.getElementById("dynamicStyles");
    if (!styleElement) {
      styleElement = iframeDocument.createElement("style");
      styleElement.id = "dynamicStyles";
      styleElement.textContent = gameCss;
      iframeDocument.head.appendChild(styleElement);
    }

    styleElement.textContent = `#${gameArea.id} { ${extractContent(cssText)} }`;

    try {
      checkForCompletion(iframeDocument);
    } catch (error) {
      console.error("Erro ao aplicar CSS: ", error);
    }
  };

  const handleIframeLoad = () => {
    const iframeDocument = iframeRef.current.contentDocument;
    if (!iframeDocument) {
      console.error("iframeDocument is null");
      return;
    }

    let styleElement = iframeDocument.createElement("style");
    styleElement.id = "initialStyles";
    styleElement.textContent = gameCss;
    iframeDocument.head.appendChild(styleElement);

    applyStyles();
  };

  const checkForCompletion = (doc) => {
    const quadrados = doc.querySelectorAll(".quadrado");
    const objetivos = doc.querySelectorAll(".objetivo1, .objetivo2");
    let objetivosAlcancados = 0;

    quadrados.forEach((quadrado, index) => {
      if (objetivos[index] && isOverlapping(quadrado, objetivos[index])) {
        objetivosAlcancados++;
      }
    });

    if (objetivosAlcancados === objetivos.length) {
      document
        .getElementById("concluirDesafio")
        .setAttribute("style", "display:block");
    } else {
      console.log("Continue tentando!");
      document
        .getElementById("concluirDesafio")
        .setAttribute("style", "display:none");
    }
  };

  const isOverlapping = (elem1, elem2) => {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();
    return !(
      rect2.left > rect1.right ||
      rect2.right < rect1.left ||
      rect2.top > rect1.bottom ||
      rect2.bottom < rect1.top
    );
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      let value = editor.getValue();
      const start = "#DESAFIO {";
      const end = "}";

      const lines = value.split("\n");

      if (lines[0] !== start || !value.endsWith(end)) {
        value = previousValueRef.current;
      } else {
        for (let i = 0; i < lines.length - 1; i++) {
          const semicolonIndex = lines[i].lastIndexOf(";");
          if (semicolonIndex !== -1 && semicolonIndex < lines[i].length - 1) {
            lines[i] = lines[i].substring(0, semicolonIndex + 1);
          }
        }

        if (lines[lines.length - 1].trim() !== end) {
          lines[lines.length - 1] = end;
        }

        while (lines.length > maxLines) {
          lines.splice(maxLines - 1, 1);
        }

        value = lines.join("\n");
        previousValueRef.current = value;
      }

      if (value !== editor.getValue()) {
        editor.executeEdits("", [
          {
            range: new monaco.Range(
              1,
              1,
              editor.getModel().getLineCount(),
              editor
                .getModel()
                .getLineMaxColumn(editor.getModel().getLineCount())
            ),
            text: value,
            forceMoveMarkers: true,
          },
        ]);
      }

      setCssText(value);
    });
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="TelaDeDesafio">
      <Header username={username} img={img} imgType={imgType} totalScore={totalScore} />
      <div className="DesafioBody">
        <iframe
          id="gameIframe"
          ref={iframeRef}
          srcDoc={gameHtml}
          onLoad={handleIframeLoad}
        />
        <div className="divEnviar">
          <div className="DescricaoDesafio">
            <h2>DESCRIÇÃO:</h2>
            {description}
          </div>
          <div className="divEditor">
            <Editor
              defaultLanguage="css"
              height="50%"
              value={cssText}
              theme="vs-dark"
              className="editorContainer"
              options={{
                readOnly: false,
                fontFamily: "Roboto",
                fontSize: 30,
                automaticLayout: true,
                minimap: { enabled: false },
                contextmenu: false,
                scrollBeyondLastLine: false,
                scrollbar: {
                  vertical: "hidden",
                  horizontal: "hidden",
                },
              }}
              onMount={handleEditorDidMount}
            />
          </div>
          <button id="concluirDesafio">Concluir desafio</button>
          <button className="BotaoFormatar" onClick={handleFormat}>
            Formatar
          </button>
          <button className="voltar" onClick={goBack}>Voltar</button>
        </div>
      </div>
    </div>
  );
};

export default GameComponent;
