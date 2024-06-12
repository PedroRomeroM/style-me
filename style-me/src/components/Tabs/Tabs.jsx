import React, { useState, useRef, useEffect } from "react";
import "./Tabs.scss";
import EditorTex from "@monaco-editor/react";

const initialCss = `#DESAFIO {\n\n}`;

const Tabs = (dificuldade) => {
  const [activeTab, setActiveTab] = useState("tab2");
  const [cssText, setCssText] = useState(initialCss);
  const editorRef = useRef(null);
  const previousValueRef = useRef(initialCss);

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 9) { 
        event.preventDefault(); 
        handleFormat(); // Formata o editor de texto
      }
    };

    window.addEventListener("keydown", handleKeyDown); 
    return () => {
      window.removeEventListener("keydown", handleKeyDown); 
    };
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="tabs-container">
      <div className="tabs">
        <button
          className={`tab-link ${activeTab === "tab3" ? "active" : ""}`}
          onClick={() => handleTabClick("tab3")}
        >
          HTML
        </button>
        <button
          className={`tab-link ${activeTab === "tab2" ? "active" : ""}`}
          onClick={() => handleTabClick("tab2")}
        >
          CSS Solução
        </button>
      </div>
      <div
        className={`tab-content ${activeTab === "tab2" ? "active" : ""}`}
        id="tab2"
      >
        <span className="InputLabel bottom">CSS Solução</span>
        <div className="divEditor">
          <EditorTex
            defaultLanguage="css"
            theme="vs-dark"
            value={initialCss}
            options={{
              readOnly: false,
              automaticLayout: true,
              fontFamily: "Roboto",
              fontSize: 30,
              minimap: { enabled: false },
              contextmenu: true,
              scrollBeyondLastLine: false,
              scrollbar: {
                vertical: "hidden",
                horizontal: "hidden",
              },
            }}
          />
        </div>
      </div>
      <div
        className={`tab-content ${activeTab === "tab3" ? "active" : ""}`}
        id="tab3"
      >
        <span className="InputLabel">HTML</span>
        <div className="divEditor">
          <div class="dropdown-container">
            <label htmlFor="numberSelect">
              Selecione o número de caixas no desafio:
            </label>
            <select id="numberSelect" class="styled-select">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
