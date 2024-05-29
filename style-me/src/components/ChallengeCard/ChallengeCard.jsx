import React, { useState, useEffect, useRef } from "react";
import './ChallengeCard.scss';
import { useNavigate } from 'react-router-dom';

const ChallengeCard = ({ id, color, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const spanRef = useRef(null);

  const navigate = useNavigate();

  function desafio(id) {
    navigate(`/desafio`, { state: { id } })
  }

  useEffect(() => {
    const spanElement = spanRef.current;

    function checkScroll() {
      if (spanElement.scrollHeight > spanElement.clientHeight) {
        spanElement.classList.remove("hide-scroll-buttons");
      } else {
        spanElement.classList.add("hide-scroll-buttons");
      }
    }

    // Verifica o scroll ao carregar
    checkScroll();

    // Verifica o scroll ao redimensionar a janela
    window.addEventListener("resize", checkScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <div className={`ChallengeCardContainer ${isHovered ? 'hovered' : ''}`}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}>
      <div className='ChallengeCard'>
        <div className='Card'>
          <span className='ChallengeNumber'># {id}</span>
          <div className='CardInfoContainer'>
            <div className={`CardSideColor ${color}`} />
            <div className='CardTitle'>
              <h2> {title} </h2>
              <span ref={spanRef} className="CardDescription"> {description} </span>
              <button className={`ChallengeButton ${color}`} onClick={() => {desafio(id)}}>VISUALIZAR</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;