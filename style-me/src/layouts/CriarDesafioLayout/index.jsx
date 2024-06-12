import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./CriarDesafio.scss";
import Header from "../../components/Header/Header";
import { getUserInfo, getChallengeInfo, fetchGameHtml, fetchGameCss, ChDone } from "../../services/ApiServices";
import { useLocation } from 'react-router-dom';
import Tabs from "../../components/Tabs/Tabs";

const initialCss = `#DESAFIO {\n\n}`;
const maxLines = 5;
const dificuldade = 3;

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

  const extractContent = (value) => {
    const match = value.match(/#DESAFIO\s*{([^}]*)}/);
    return match ? match[1].trim() : "";
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

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="TelaDeDesafio">
      <Header username={username} img={img} imgType={imgType} totalScore={totalScore} />
      <div className="DesafioBody">
        <div id="gameIframe">          
          <div className="ColumnLeft">
            <Tabs dificuldade={dificuldade}/> 
          </div>
          <div className="ColumnRight">
          </div>
        </div>
        <div className="divEnviar">
          <span className='InputLabel'>Título</span>
          <input type="text" className="Input title" />
          <span className='InputLabel'>Dificuldade</span>
          <select type="text" className="Input admin select">
            <option value="1" className="values">Fácil</option>
            <option value="2" className="values">Médio</option>
            <option value="3" className="values">Difícil</option>
          </select>
          <span className='InputLabel'>Descrição</span>
          <input type="text" className="Input description" />
          <button className="concluir">Concluir desafio</button>
          <button className="voltar" onClick={goBack}>Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameComponent;
