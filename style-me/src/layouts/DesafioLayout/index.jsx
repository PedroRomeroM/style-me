import React, { useState, useEffect, useRef } from "react";
import "./Desafio.scss"; // Importando os estilos globais
import Header from "../../components/Header/Header";

const GameComponent = () => {
  const [gameHtml, setGameHtml] = useState("");
  const iframeRef = useRef(null);

  useEffect(() => {
    // Carrega o HTML do jogo
    fetch("game1.html")
      .then((response) => response.text())
      .then((html) => setGameHtml(html));
  }, []);

  function applyStyles() {
    var cssInput = document.getElementById("cssInput").value;
    var iframeDocument = document.getElementById("gameIframe").contentDocument;
    var gameArea = iframeDocument.getElementById("ondeOCSSVaiSerAplicado");
    var head = iframeDocument.head;
    var styleElement = head.querySelector("style#dynamicStyles");

    if (!styleElement) {
      styleElement = iframeDocument.createElement("style");
      styleElement.id = "dynamicStyles";
      head.appendChild(styleElement);
    }

    styleElement.textContent = `#${gameArea.id} { ${cssInput} }`;

    try {
      checkForCompletion(iframeDocument); // Verificar se os objetivos foram alcançados
    } catch (error) {
      console.error("Erro ao aplicar CSS: ", error);
    }
  }

  const checkForCompletion = (doc) => {
    const quadrados = doc.querySelectorAll(".quadrado");
    const objetivos = doc.querySelectorAll(".objetivo1, .objetivo2");
    let objetivosAlcancados = 0;

    quadrados.forEach((quadrado, index) => {
      if (isOverlapping(quadrado, objetivos[index])) {
        objetivosAlcancados++;
      }
    });

    if (objetivosAlcancados === objetivos.length) {
      console.log("Desafio Concluído!");
    } else {
      console.log("Continue tentando!");
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

  return (
    <div className="dasafioBackground">
      <Header />
      <div className="DesafioBody">
        <iframe id="gameIframe" ref={iframeRef} srcDoc={gameHtml} />
        <div class="divEnviar">
          <textarea
            onInput={(e) => applyStyles(e.target.value)}
            placeholder="Digite seu CSS aqui..."
            id="cssInput"
          />
          <button id="concluirDesafio">Concluir desafio</button>
        </div>
      </div>
    </div>
  );
};

export default GameComponent;
