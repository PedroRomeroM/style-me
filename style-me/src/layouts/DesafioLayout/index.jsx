import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./Desafio.scss";

const initialCss = `#Desafio {\n\n}`;
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
    const match = value.match(/#Desafio\s*{([^}]*)}/);
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
      document.getElementById("concluirDesafio").setAttribute("style", "display:flex");
    } else {
      console.log("Continue tentando!");
      document.getElementById("concluirDesafio").setAttribute("style", "display:none");
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
      const start = "#Desafio {";
      const end = "}";

      const lines = value.split('\n');

      // Preserve the structure
      if (lines[0] !== start || !value.endsWith(end)) {
        value = previousValueRef.current;
      } else {
        // Remove any text after the last semicolon in each line
        for (let i = 0; i < lines.length - 1; i++) {
          const semicolonIndex = lines[i].lastIndexOf(';');
          if (semicolonIndex !== -1 && semicolonIndex < lines[i].length - 1) {
            lines[i] = lines[i].substring(0, semicolonIndex + 1);
          }
        }

        // Ensure the last line is always "}"
        if (lines[lines.length - 1].trim() !== end) {
          lines[lines.length - 1] = end;
        }

        // Remove any extra blank lines
        while (lines.length > maxLines) {
          lines.splice(maxLines - 1, 1); // Remove the second last line before the closing brace
        }

        value = lines.join('\n');
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
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  return (
    <div className="DesafioBody">
      <iframe id="gameIframe" ref={iframeRef} srcDoc={gameHtml} />
      <div className="divEnviar">
        <Editor
          height="60%"
          defaultLanguage="css"
          value={cssText}
          theme="vs-dark"
          options={{
            readOnly: false,
            automaticLayout: true,
            minimap: { enabled: false },
            contextmenu: false
          }}
          onMount={handleEditorDidMount}
        />
        <button onClick={handleFormat}>Formatar</button>
        <button id="concluirDesafio">Concluir desafio</button>
      </div>
    </div>
  );
};

export default GameComponent;
