import './ChallengeHeader.scss'
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

export const ChallengeHeader = ({ color, difficulty }) => {
  return (
    <div className='ChallengeHeaderContainer'>
      <div className={`ChallengeHeaderSideColor ${color}`} />
      <h1 className='ChallengeHeaderTitle'>{difficulty}</h1>
      <div className='Filter'>
        <input type="text" placeholder='Filtro' className="InputWithIcon" maxLength="25" />
        <span className="Icon">
          <div className="FilterBar" />
          <FontAwesomeIcon icon={faFilter} className='FilterIcon' />
        </span>
      </div>
    </div>
  );
};

export default ChallengeHeader;
