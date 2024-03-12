import React, { useState } from "react";
import './ChallengeCard.scss';

const ChallengeCard = ({ color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`ChallengeCardContainer ${isHovered ? 'hovered' : ''}`}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}>
      <div className='ChallengeCard'>
        <div className='Card'>
          <span className='ChallengeNumber'>#1</span>
          <div className='CardInfoContainer'>
            <div className={`CardSideColor ${color}`} />
            <div className='CardTitle'>
              <h2>Alterar a cor de um texto</h2>
              <span>Um texto está difícil de ser visualizado em uma página, faça com que o usuário consiga ler o texto facilmente. </span>
              <button className={`ChallengeButton ${color}`}>VISUALIZAR</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
