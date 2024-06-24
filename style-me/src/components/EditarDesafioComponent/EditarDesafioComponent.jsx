import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./EditarDesafioComponent.scss";
import { ChDone, getChallengeInfo } from "../../services/ApiServices";
import { useLocation } from "react-router-dom";

const initialCss = `#POSITION {\n\n}`;
const initialCss2 = `#STYLE {\n\n}`;
const initialCss3 = `#POSITION {\n\n}\n#STYLE {\n\n}`;
const maxLines = 20;

const DesafioComponent = ({
  goBack,
  descricao,
  numeroDeCaixas,
  setCssSolucao,
  setCssBase,
  setGameHtmlBase,
  handleConcluir,
  isCreateCh,
  dificuldade,
  isEditar,
  chId,
}) =>{

  const [gameHtml, setGameHtml] = useState("");
  const [cssText, setCssText] = useState(
    dificuldade == 2 ? initialCss : dificuldade == 1 ? initialCss2 : initialCss3
  );
  const [gameCss, setGameCss] = useState("");
  const iframeRef = useRef(null);
  const editorRef = useRef(null);
  const previousValueRef = useRef(
    dificuldade == 2 ? initialCss : dificuldade == 1 ? initialCss2 : initialCss3
  );

  //Mudar para regex que coloca as divs quadrado dentro do html que vem do back (gameHtml)
  const generateQuadrados = (num) => {
    let quadrados = "";
    for (let i = 0; i < num; i++) {
      if (dificuldade == 3) {
        quadrados += `<div class="quadrado" id="EstiloQuadrado"></div>`;
      } else {
        quadrados += `<div class="quadrado"></div>`;
      }
    }
    return quadrados;
  };

  //Mudar para regex que coloca as divs objetivo dentro do html que vem do back (gameHtml)
  const generateObjetivos = (num) => {
    let objetivos = "";
    for (let i = 0; i < num; i++) {
      if (dificuldade == 2) {
        objetivos += `<div class="objetivo2"></div>`;
      } else {
        objetivos += `<div class="objetivo2" id="AlvoDoDesafioS"></div>`;
      }
    }
    return objetivos;
  };

  //Work in progress
  useEffect(() => {
    const res = localStorage.getItem("auth");
    const parsed = JSON.parse(res);
    const token = parsed.token;

    if (isEditar === "OK") {
      const chInfo = getChallengeInfo(token, chId);
      chInfo
        .then((res) => {
          setGameCss(res.data.cssBase)
          setGameHtml(res.data.html)
          if(dificuldade == 3){
            setCssText(res.data.cssFinal.replace(/#AlvoDoDesafioS/g, '#STYLE').replace(/#AlvoDoDesafio/g, '#POSITION').replace(/}/g, '\n}').replace(/{/g, '{\n'))
          }else if(dificuldade == 2) {
            setCssText("#POSITION {\n" + res.data.cssFinal + "\n}")
          }else if(dificuldade == 1) {
            setCssText("#STYLE {\n" + res.data.cssFinal + "\n}")
          }
          })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  //OK tudo certo
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      applyStyles();
    }
  }, [cssText, gameCss]);

  //OK tudo certo
  const extractContent = (cssText) => {
    if (dificuldade == 2 || dificuldade == 1) {
      const startIndex = cssText.indexOf("{") + 1;
      const endIndex = cssText.lastIndexOf("}");
      console.log(cssText.substring(startIndex, endIndex).trim());
      return cssText.substring(startIndex, endIndex).trim();
    }

    if (dificuldade == 3) {
      const positionRegex = /#POSITION\s*\{([^}]*)\}/;
      const styleRegex = /#STYLE\s*\{([^}]*)\}/;

      const positionMatch = cssText.match(positionRegex);
      const styleMatch = cssText.match(styleRegex);

      const positionContent = positionMatch ? positionMatch[1].trim() : "";
      const styleContent = styleMatch ? styleMatch[1].trim() : "";
      return `${positionContent}\n#AlvoDoDesafioS { ${styleContent} }`;
    }
    return "";
  };

  //usar para aplicar css do back
  const applyStyles = () => {
    const iframeDocument = iframeRef.current.contentDocument;
    if (!iframeDocument) return;

    const gameArea = iframeDocument.getElementById("AlvoDoDesafio");
    if (!gameArea) return;

    let styleElement = iframeDocument.getElementById("dynamicStyles");
    if (!styleElement) {
      styleElement = iframeDocument.createElement("style");
      styleElement.id = "dynamicStyles";
      iframeDocument.head.appendChild(styleElement);
    }

    styleElement.textContent =
      gameCss + `\n#${gameArea.id} { ${extractContent(cssText)} }`;
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      let value = editor.getValue();
      let startPosition;
      let startStyle;
      const end = "}";

      if (dificuldade == 2) {
        startPosition = "#POSITION {";
      } else if (dificuldade == 1) {
        startStyle = "#STYLE {";
      } else if (dificuldade == 3) {
        startPosition = "#POSITION {";
        startStyle = "#STYLE {";
      }

      const lines = value.split("\n");

      if (dificuldade == 3) {
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
          lines[0] !== (dificuldade == 2 ? startPosition : startStyle) ||
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

  const handleConcluirClick = () => {
    handleConcluir();
  };

  return (
    <div className="TelaDeDesafio">
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
            {descricao}
          </div>
          <div className="divEditor">
            <Editor
              defaultLanguage="css"
              height="50%"
              value={cssText}
              theme="vs-dark"
              className="editorContainer"
              onChange={setCssSolucao(extractContent(cssText))}
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
          {isCreateCh ? (
            <button id="concluirDesafioC" onClick={handleConcluirClick}>
              {isEditar === "OK" ? "Editar desafio" : "Criar desafio"}
            </button>
          ) : (
            <button id="concluirDesafioC" onClick={handleConcluirClick}>
              Concluir desafio
            </button>
          )}
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

export default DesafioComponent;
