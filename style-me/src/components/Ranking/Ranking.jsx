import React from 'react';
import './Ranking.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { faMedal } from '@fortawesome/free-solid-svg-icons';

const Ranking = () => {
    return (
        <div className='RankingTable'>
            <div className="RankingRow">
                <div className='icon'>
                    <FontAwesomeIcon className="icon" icon={faTrophy} style={{ color: 'gold' }} />
                </div>
                <div className="RankingCellPosition">
                    #1
                </div>
                <div className="RankingCellUser">Romerão</div>
                <div className="RankingCellScore">Pontos: 100</div>
            </div>
            <div className="RankingRow">
                <div className='icon'>
                    <FontAwesomeIcon className="icon" icon={faMedal} style={{ color: 'silver' }} />
                </div>
                <div className="RankingCellPosition">
                    #2
                </div>
                <div className="RankingCellUser">crocscrocs12</div>
                <div className="RankingCellScore">Pontos: 90</div>
            </div>
            <div className="RankingRow">
                <div className='icon'>
                    <FontAwesomeIcon className="icon" icon={faMedal} style={{ color: '#cd7f32' }} />
                </div>
                <div className="RankingCellPosition">
                    #3
                </div>
                <div className="RankingCellUser">maonaparede</div>
                <div className="RankingCellScore">Pontos: 80</div>
            </div>
            <div className="RankingRow">
                    <FontAwesomeIcon className="icon" icon={faMedal} style={{ color: '#cd7f32' }} opacity={0}/>
                <div className='icon'></div>
                <div className="RankingCellPosition">#4</div>
                <div className="RankingCellUser">machado</div>
                <div className="RankingCellScore">Pontos: 70</div>
            </div>
            <div className="RankingRow">
                    <FontAwesomeIcon className="icon" icon={faMedal} style={{ color: '#cd7f32' }} opacity={0}/>
                <div className='icon'></div>
                <div className="RankingCellPosition">#5</div>
                <div className="RankingCellUser">girata</div>
                <div className="RankingCellScore">Pontos: 60</div>
            </div>
        </div>
    )
}

export default Ranking;
