import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./Desafio.scss";
import { ChDone } from "../../services/ApiServices";
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
}) => {
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

  const generateCSSSolucao = () => {
    return extractContent(cssText);
  };

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

  useEffect(() => {
    setCssBase(gameCss);
    setGameHtmlBase(gameHtml);
  }, [gameCss, gameHtml]);

  useEffect(() => {
    if (dificuldade == 2) {
      setGameHtml(`<!DOCTYPE html>
                  <html lang="pt">
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
                  justify-content: center;
                  align-items: center;
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
                }`);
    }
    if (dificuldade == 1) {
      setGameHtml(`<!DOCTYPE html>
          <body>
            <div class="areadesafio">
              <div class="areaDoUser">
                <div class="quadrado" id="ondeOCSSVaiSerAplicado"></div>
              </div>
              <div class="areafantasma" >
                <div class="objetivo2" id=AlvoDoDesafio></div>
              </div>
            </div>
          </body>
        </html>`);

      setGameCss(`
      .objetivo2:hover {
        transition: transform 0.5s;
        transform: scale(1.05);
      }
      .quadrado:hover {
        transform: scale(1.05);
      }

      .areaDoUser{
        display: flex;
        align-items: center;
      }
      .areadesafio {
        width: calc(100% - 2rem);
        height: calc((100vh - 3.3rem));
        background-color: #747185;
        background-image: url("images/textura.png");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: 13px;
        padding: 1rem;
        display:flex;
        justify-content:space-around;
      }

      .quadrado {
        width: 18rem;
        height: 18rem;
        margin: 10px;
        z-index: 2;
        background-color: green;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        transition: all 0.5s ease;
      }

      .areafantasma .objetivo2 {
        width: 18rem;
        height: 18rem;
        margin: 10px;
        background-color: rgba(255, 0, 0, 0.295);
        ${generateCSSSolucao()}
      }

      .areafantasma {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        padding: 1rem;
        align-items: center;
        }`);
    }

    if (dificuldade == 3) {
      setGameHtml(`<!DOCTYPE html>
                    <html lang="pt">
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
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                    border-radius: 13px;
                    padding: 1rem;
                  }
  
                  #ondeOCSSVaiSerAplicado {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                  }
  
                  .quadrado {
                    width: 8rem;
                    height: 8rem;
                    margin: 10px;
                    z-index: 2;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                    transition: all 0.5s ease;
                    background-color: green;
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
                  }
                  ${generateCSSSolucao()}`);
    }
  }, [gameCss, gameHtml, cssText]);

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      applyStyles();
    }
  }, [cssText, gameCss]);

  const extractContent = (cssText) => {
    if (dificuldade == 2 || dificuldade == 1) {
      const startIndex = cssText.indexOf("{") + 1;
      const endIndex = cssText.lastIndexOf("}");
      return cssText.substring(startIndex, endIndex).trim();
    }

    if (dificuldade == 3) {
      const positionRegex = /#POSITION\s*\{([^}]*)\}/;
      const styleRegex = /#STYLE\s*\{([^}]*)\}/;

      const positionMatch = cssText.match(positionRegex);
      const styleMatch = cssText.match(styleRegex);

      const positionContent = positionMatch ? positionMatch[1].trim() : "";
      const styleContent = styleMatch ? styleMatch[1].trim() : "";
      return `#AlvoDoDesafio { ${positionContent} }\n#AlvoDoDesafioS { ${styleContent} }`;
    }
    return "";
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
              Criar desafio
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
