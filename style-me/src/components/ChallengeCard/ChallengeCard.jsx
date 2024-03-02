import './ChallengeCard.scss'
import React from "react";

export const ChallengeCard = () => {
  return (
    <div className='ChallengeCardContainer'>
      <div className='ChallengeCard'>
        <div className='Card'>
        <span className='ChallengeNumber'>#1</span>
          <div className='CardInfoContainer'>
            <div className='CardSideColor' />
            <div className='CardTitle'>
              <h1>Alterar a cor de um texto</h1>
              <span>Um texto está difícil de ser visualizado em uma página, faça com que o usuário consiga ler o texto facilmente. </span>
              <button className="ChallengeButton">VISUALIZAR</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ChallengeCard;