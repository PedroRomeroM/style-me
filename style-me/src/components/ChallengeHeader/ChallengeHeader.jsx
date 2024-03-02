import './ChallengeHeader.scss'
import React from "react";

export const ChallengeHeader = ({ color, difficulty }) => {
  return (
    <div className='ChallengeHeaderContainer'>
      <div className={`ChallengeHeaderSideColor ${color}`}/>
      <h1 className='ChallengeHeaderTitle'>Nível {difficulty}</h1>
      <div className='Filter'>
        
      </div>
    </div>
  );
};


export default ChallengeHeader;