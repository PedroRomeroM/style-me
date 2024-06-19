import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./Desafio.scss";
import Header from "../Header/Header";
import { getUserInfo, getChallengeInfo, fetchGameHtml, fetchGameCss, ChDone } from "../../services/ApiServices";
import { useLocation } from 'react-router-dom';

const initialCss = `#DESAFIO {\n\n}`;
const maxLines = 5;

const GameComponent = () => {
  const [gameHtml, setGameHtml] = useState("");
  const [cssText, setCssText] = useState(initialCss);
  const [gameCss, setGameCss] = useState("");
  const iframeRef = useRef(null);
  const editorRef = useRef(null);
  const previousValueRef = useRef(initialCss);
  const [profile, setProfile] = useState(null);
  const [img, setImg] = useState();
  const [imgType, setImgType] = useState();
  const [totalScore, setTotalScore] = useState();
  const [username, setUsername] = useState();
  const { state } = useLocation();
  const [description, setDescription] = useState();

  useEffect(() => {
    const res = localStorage.getItem("auth");
    const parsed = JSON.parse(res);
    const token = parsed.token;

    Promise.all([
      getUserInfo(token),
      getChallengeInfo(token, state.id),
      fetchGameHtml(token, state.id),
      fetchGameCss(token, state.id)
    ]).then(([userInfo, challengeInfo, html, css]) => {
      setProfile(userInfo.data);
      setDescription(challengeInfo.data.description);
      setGameHtml(html);
      setGameCss(css);

      setUsername(userInfo.data.username);
      setImgType(userInfo.data.imgType);
      setImg(userInfo.data.img);
      setTotalScore(userInfo.data.totalScore || 0);
    }).catch(console.log);
  }, [state.id]);

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      applyStyles();
    }
  }, [cssText, gameCss]);

  const extractContent = (value) => {
    const match = value.match(/#DESAFIO\s*{([^}]*)}/);
    return match ? match[1].trim() : "";
  };

  const applyStyles = () => {
    const iframeDocument = iframeRef.current.contentDocument;
    if (!iframeDocument) return;

    const gameArea = iframeDocument.getElementById("ondeOCSSVaiSerAplicado");
    if (!gameArea) return;

    let styleElement = iframeDocument.getElementById("dynamicStyles");
    if (!styleElement) {
      styleElement = iframeDocument.createElement("style");
      styleElement.id = "dynamicStyles";
      iframeDocument.head.appendChild(styleElement);
    }
    
    styleElement.textContent = gameCss + `\n#${gameArea.id} { ${extractContent(cssText)} }`;
    checkForCompletion(iframeDocument);
  };

  const checkForCompletion = (doc) => {
    const quadrados = doc.querySelectorAll(".quadrado");
    const objetivos = doc.querySelectorAll(".objetivo1, .objetivo2");
    const objetivosAlcancados = Array.from(quadrados).filter((quadrado, index) =>
      isOverlapping(quadrado, objetivos[index])
    ).length;

    document.getElementById("concluirDesafio").style.display = objetivosAlcancados === objetivos.length ? "block" : "none";
  };

  const isOverlapping = (elem1, elem2) => {
    if (!elem1 || !elem2) return false;
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();
    return (
      rect2.right === rect1.right &&
      rect2.left === rect1.left &&
      rect2.bottom === rect1.bottom &&
      rect2.top === rect1.top
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
              editor.getModel().getLineMaxColumn(editor.getModel().getLineCount())
            ),
            text: value,
            forceMoveMarkers: true,
          },
        ]);
      }

      setCssText(value);
    });

    setTimeout(() => {
      editor.layout();
    }, 100);
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  const goBack = () => {
    window.history.back();
  };

  const handleConcluir = () => {
    const res = localStorage.getItem("auth");
    const parsed = JSON.parse(res);
    const token = parsed.token;

    ChDone(token,state.id)
  }

  return (
<div className="TelaDeDesafio">
      <Header username={username} img={img} imgType={imgType} totalScore={totalScore} />
      <div className="DesafioBody">
        <iframe
          id="gameIframe"
          ref={iframeRef}
          srcDoc={gameHtml}
          onLoad={applyStyles}
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
                automaticLayout: false, 
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
          <button id="concluirDesafio" onClick={handleConcluir}>Concluir desafio</button>
          <button className="BotaoFormatar" onClick={handleFormat}>
            Formatar
          </button>
          <button className="voltar" onClick={goBack}>Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameComponent;
