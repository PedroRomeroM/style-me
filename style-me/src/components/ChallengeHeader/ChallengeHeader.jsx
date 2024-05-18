import './ChallengeHeader.scss';
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const ChallengeHeader = ({ color, difficulty, selectedDifficulty, onSelectDifficulty }) => {
  return (
    <div className='ChallengeHeaderContainer'>
      <div className='ColumnLeftHeader'>
        <div className={`ChallengeHeaderSideColor ${color}`} />
        <h1 className='ChallengeHeaderTitle'>{difficulty}</h1>
      </div>
      <div className='ColumnRightHeader'>
        <div className="DifficultySelector">
          <button
            className={`DifficultyButton ${selectedDifficulty === 'Fácil' ? 'active' : ''}`}
            onClick={() => onSelectDifficulty('Fácil')}
          >
            Fácil
          </button>
          <button
            className={`DifficultyButton ${selectedDifficulty === 'Médio' ? 'active' : ''}`}
            onClick={() => onSelectDifficulty('Médio')}
          >
            Médio
          </button>
          <button
            className={`DifficultyButton ${selectedDifficulty === 'Difícil' ? 'active' : ''}`}
            onClick={() => onSelectDifficulty('Difícil')}
          >
            Difícil
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChallengeHeader;
