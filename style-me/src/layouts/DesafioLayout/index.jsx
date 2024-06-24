import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./Desafio.scss";
import Header from "../../components/Header/Header";
import {
  getUserInfo,
  getChallengeInfo,
  fetchGameHtml,
  fetchGameCss,
  ChDone,
  getTypeUser,
} from "../../services/ApiServices";
import { useLocation } from "react-router-dom";
import Message from "../../components/UsuarioCriado";

const initialCss = `#POSITION {\n\n}`;
const initialCss2 = `#STYLE {\n\n}`;
const initialCss3 = `#POSITION {\n\n}\n#STYLE {\n\n}`;
const maxLines = 15;

const GameComponent = () => {
  const [gameHtml, setGameHtml] = useState("");
  const [gameCss, setGameCss] = useState("");
  const iframeRef = useRef(null);
  const editorRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [img, setImg] = useState();
  const [imgType, setImgType] = useState();
  const [totalScore, setTotalScore] = useState();
  const [username, setUsername] = useState();
  const { state } = useLocation();
  const [description, setDescription] = useState();
  const [dificuldade, setDificuldade] = useState();
  const [cssSolucao, setCssSolucao] = useState();
  const [cssText, setCssText] = useState(
    state.color == "yellow"
      ? initialCss
      : state.color == "green"
      ? initialCss2
      : initialCss3
  );
  const previousValueRef = useRef(
    state.color == "yellow"
      ? initialCss
      : state.color == "green"
      ? initialCss2
      : initialCss3
  );

  const [isAdmin, setIsAdmin] = useState();
  const [isDone, setIsDone] = useState();

  useEffect(() => {
    const res = localStorage.getItem("auth");
    const parsed = JSON.parse(res);
    const token = parsed.token;

    Promise.all([
      getUserInfo(token),
      getChallengeInfo(token, state.id),
      fetchGameHtml(token, state.id),
      fetchGameCss(token, state.id),
    ])
      .then(([userInfo, challengeInfo, html, css]) => {
        setProfile(userInfo.data);
        setDescription(challengeInfo.data.description);
        setGameHtml(html);
        setGameCss(css);
        setDificuldade(challengeInfo.data.level);
        setCssSolucao(challengeInfo.data.cssFinal);

        setUsername(userInfo.data.username);
        setImgType(userInfo.data.imgType);
        setImg(userInfo.data.img);
        setTotalScore(userInfo.data.totalScore || 0);
      })
      .catch(console.log);
  }, [state.id]);

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      applyStyles();
    }
  }, [cssText, gameCss]);

  useEffect(() => {
    const res = localStorage.getItem("auth");
    const parsed = JSON.parse(res);
    const token = parsed.token;
    getTipoUser(token);
  }, [isAdmin]);

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

  const extractContent = (cssText) => {
    if (state.color == "yellow" || state.color == "green") {
      const startIndex = cssText.indexOf("{") + 1;
      const endIndex = cssText.lastIndexOf("}");
      return cssText.substring(startIndex, endIndex).trim();
    }

    if (state.color == "red") {
      const positionRegex = /#POSITION\s*\{([^}]*)\}/;
      const styleRegex = /#STYLE\s*\{([^}]*)\}/;

      const positionMatch = cssText.match(positionRegex);
      const styleMatch = cssText.match(styleRegex);

      const positionContent = positionMatch ? positionMatch[1].trim() : "";
      const styleContent = styleMatch ? styleMatch[1].trim() : "";

      return ` ${positionContent} }\n#EstiloQuadrado { ${styleContent} `;
    }
    return "";
  };

  const extractStyleContent = (cssText, type) => {
    if(type == 1) {
      const styleRegex = /#STYLE\s*\{([^}]*)\}/;
      const styleMatch = cssText.match(styleRegex);
      const styleContent = styleMatch ? styleMatch[1].trim() : "";
  
      return `${styleContent} `;
    }else if (type == 2){
      const styleRegex = /#AlvoDoDesafioS\s*\{([^}]*)\}/;
      const styleMatch = cssText.match(styleRegex);
      const styleContent = styleMatch ? styleMatch[1].trim() : "";
  
      return `${styleContent} `;
    }
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

    styleElement.textContent =
      gameCss + `\n#${gameArea.id} { ${extractContent(cssText)} }`;

    checkForCompletion(iframeDocument);
  };

  function normalizeText(text) {
    return text
      .toLowerCase()
      .split(";")
      .map((word) => word.trim().replace(/[ ;]/g, ""))
      .sort()
      .join("");
  }

  const checkForCompletion = (doc) => {
    if (state.color == "yellow") {
      const quadrados = doc.querySelectorAll(".quadrado");
      const objetivos = doc.querySelectorAll(".objetivo2");
      const objetivosAlcancados = Array.from(quadrados).filter(
        (quadrado, index) => isOverlapping(quadrado, objetivos[index])
      ).length;

      document.getElementById("concluirDesafio").style.display =
        objetivosAlcancados === objetivos.length ? "block" : "none";
    }
    if (state.color == "green") {
      document.getElementById("concluirDesafio").style.display =
        normalizeText(extractContent(cssText)) == normalizeText(cssSolucao)
          ? "block"
          : "none";
    }
    if (state.color == "red") {
      const quadrados = doc.querySelectorAll(".quadrado");
      const objetivos = doc.querySelectorAll(".objetivo2");
      const objetivosAlcancados = Array.from(quadrados).filter(
        (quadrado, index) => isOverlapping(quadrado, objetivos[index])
      ).length;

      document.getElementById("concluirDesafio").style.display =
        normalizeText(extractStyleContent(cssText,1)) == normalizeText(extractStyleContent(cssSolucao,2)) &&
        objetivosAlcancados === objetivos.length
          ? "block"
          : "none";
    }
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
      let startPosition;
      let startStyle;
      const end = "}";

      if (state.color == "yellow") {
        startPosition = "#POSITION {";
      } else if (state.color == "green") {
        startStyle = "#STYLE {";
      } else if (state.color == "red") {
        startPosition = "#POSITION {";
        startStyle = "#STYLE {";
      }

      const lines = value.split("\n");

      if (state.color == "red") {
        const hasStartPosition = lines[0].startsWith(startPosition);
        const hasStartStyle = lines.some(
          (line, index) =>
            line.startsWith(startStyle) &&
            index > 0 &&
            lines[index - 1].trim() === end
        );
        const endsCorrectly = lines[lines.length - 1].trim() === end;

        if (!hasStartPosition || !hasStartStyle || !endsCorrectly) {
          value = previousValueRef.current;
        } else {
          for (let i = 0; i < lines.length; i++) {
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
      } else {
        if (
          lines[0] !== (state.color == "yellow" ? startPosition : startStyle) ||
          !value.endsWith(end)
        ) {
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

    const checkDone = ChDone(token, state.id);
    checkDone
      .then((res) => {
        if (res.status === 200) {
          setIsDone(true);
        } else {
          setIsDone(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  function checkIsDone() {
    if (isDone === true) {
      return <Message text={"Desafio concluido com sucesso!"} />;
    } else if (isDone === false) {
      return <Message text={"Tente novamente!"} />;
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
      <div className="DesafioBody">
        {checkIsDone()}
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
          <button id="concluirDesafio" onClick={handleConcluir}>
            Concluir desafio
          </button>
          <button className="BotaoFormatar" onClick={handleFormat}>
            Formatar
          </button>
          <button className="voltar" onClick={goBack}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameComponent;
