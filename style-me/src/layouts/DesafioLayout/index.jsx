import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./Desafio.scss";
import Header from "../../components/Header/Header";

const initialCss = `#Desafio {\n\n}`;
const maxLines = 10;  

const GameComponent = () => {
  const [gameHtml, setGameHtml] = useState("");
  const [cssText, setCssText] = useState(initialCss);
  const iframeRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    fetch("game1.html")
      .then((response) => response.text())
      .then((html) => setGameHtml(html));
  }, []);

  const applyStyles = () => {
    const iframeDocument = iframeRef.current.contentDocument;
    if (!iframeDocument) {
      console.error("iframeDocument is null");
      return;
    }

    const gameArea = iframeDocument.getElementById("Desafio");
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

    styleElement.textContent = cssText;

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
      document.getElementById("concluirDesafio").style.display = "block";
    } else {
      document.getElementById("concluirDesafio").style.display = "none";
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

      // Preserve the structure
      if (!value.startsWith(start)) {
        value = `${start}\n${value}`;
      }

      const lines = value.split('\n');
      if (lines[lines.length - 1].trim() !== end) {
        lines[lines.length - 1] = end;
        value = lines.join('\n');
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

      if (lines.length > maxLines) {
        const truncatedValue = lines.slice(0, maxLines).join('\n');
        editor.setValue(truncatedValue);
      }

      setCssText(value);
      applyStyles();
    });
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const handleIframeLoad = () => {
    applyStyles();
  };

  return (
    <div className="desafioBackground">
      <Header />
      <div className="DesafioBody">
        <iframe
          id="gameIframe"
          ref={iframeRef}
          srcDoc={gameHtml}
          style={{ width: "79%", height: "98vh", border: "none" }}
          onLoad={handleIframeLoad}
        />
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
    </div>
  );
};

export default GameComponent;
