import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./Desafio.scss";
import Header from "../../components/Header/Header";

const initialCss = `#DESAFIO {\n\n}`;
const maxLines = 5;

const GameComponent = () => {
  const [gameHtml, setGameHtml] = useState("");
  const [cssText, setCssText] = useState(initialCss);
  const iframeRef = useRef(null);
  const editorRef = useRef(null);
  const previousValueRef = useRef(initialCss);

  useEffect(() => {
    fetch("game1.html")
      .then((response) => response.text())
      .then((html) => setGameHtml(html));
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
      iframeDocument.head.appendChild(styleElement);
    }

    styleElement.textContent = `#${gameArea.id} { ${extractContent(cssText)} }`;

    try {
      checkForCompletion(iframeDocument);
    } catch (error) {
      console.error("Erro ao aplicar CSS: ", error);
    }
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

  return (
    <div className="TelaDeDesafio">
      <Header />
      <div className="DesafioBody">
        <iframe id="gameIframe" ref={iframeRef} srcDoc={gameHtml} />
        <div className="divEnviar">
          <div className="DescricaoDesafio">
            <h2>DESCRIÇÃO:</h2>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
          <Editor
            defaultLanguage="css"
            height='50%'
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
          <button id="concluirDesafio">Concluir desafio</button>
          <button className="BotaoFormatar" onClick={handleFormat}>
            Formatar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameComponent;
