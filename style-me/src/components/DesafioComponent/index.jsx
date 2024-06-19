import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./Desafio.scss";
import { ChDone } from "../../services/ApiServices";
import { useLocation } from "react-router-dom";

const initialCss = `#DESAFIO {\n\n}`;
const maxLines = 20;

const DesafioComponent = ({
  goBack,
  descricao,
  numeroDeCaixas,
  setCssSolucao,
  setCssBase,
  setGameHtmlBase,
  handleConcluir,
  isCreateCh
}) => {
  const [gameHtml, setGameHtml] = useState("");
  const [cssText, setCssText] = useState(initialCss);
  const [gameCss, setGameCss] = useState("");
  const iframeRef = useRef(null);
  const editorRef = useRef(null);
  const previousValueRef = useRef(initialCss);

  const generateQuadrados = (num) => {
    let quadrados = "";
    for (let i = 0; i < num; i++) {
      quadrados += `<div class="quadrado"></div>`;
    }
    return quadrados;
  };

  const generateCSSSolucao = () => {
    return extractContent(cssText);
  }


  const generateObjetivos = (num) => {
    let objetivos = "";
    for (let i = 0; i < num; i++) {
      objetivos += `<div class="objetivo2"></div>`;
    }
    return objetivos;
  };

  useEffect(() => {
    setCssBase(gameCss);
    setGameHtmlBase(gameHtml);
  }, [gameCss, gameHtml]);

  useEffect(() => {
    setGameHtml(`<!DOCTYPE html>
                  <html lang="pt">
                    <head>
                      <meta charset="UTF-8" />
                      <title>Área do Jogo</title>
                      <link rel="stylesheet" href="css-desafio.css" />
                    </head>
                    <body>
                      <div class="areadesafio">
                        <div id="ondeOCSSVaiSerAplicado">
                          ${generateQuadrados(numeroDeCaixas)}
                        </div>
                        <div class="areafantasma" id=AlvoDoDesafio>
                          ${generateObjetivos(numeroDeCaixas)}
                        </div>
                      </div>
                    </body>
                  </html>`);

    setGameCss(`.objetivo2:hover {
                  transition: transform 0.5s;
                  transform: scale(1.05);
                }
                .quadrado:hover {
                  transform: scale(1.05);
                }
                .areadesafio {
                  position: relative;
                  width: calc(100% - 2rem);
                  height: calc((100vh - 3.3rem));
                  background-color: #747185;
                  background-image: url("images/textura.png");
                  background-size: cover;
                  background-repeat: no-repeat;
                  background-position: center;
                  border-radius: 13px;
                  padding: 1rem;
                }

                #ondeOCSSVaiSerAplicado {
                  display: flex;
                  justify-content: flex-end;
                  align-items: space-around;
                  height: 100%;
                  width: 100%;
                }

                .quadrado {
                  width: 8rem;
                  height: 8rem;
                  margin: 10px;
                  z-index: 2;
                  background-image: url("images/caixa.jpg");
                  background-size: cover;
                  background-repeat: no-repeat;
                  background-position: center;
                  transition: all 0.5s ease;
                }

                .areafantasma .objetivo2 {
                  width: 8rem;
                  height: 8rem;
                  margin: 10px;
                  background-color: rgba(255, 0, 0, 0.295);
                }

                .areafantasma {
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  display: flex;
                  padding: 1rem;

                  ${generateCSSSolucao()}
                }`
              );
  }, [gameCss,gameHtml,cssText]);

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
    handleConcluir()
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
          {
            isCreateCh ? (
              <button id="concluirDesafioC" onClick={handleConcluirClick}>
                Criar desafio
              </button>
            ) : (
              <button id="concluirDesafioC" onClick={handleConcluirClick}>
                Concluir desafio
              </button>
            )
          }
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
