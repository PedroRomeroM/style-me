import React from 'react';
import './Ranking.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { faMedal } from '@fortawesome/free-solid-svg-icons';

const Ranking = ( { ranking } ) => {
    if (ranking != null) {
        return (
            <div className='RankingTable'>
                <div className="RankingRow">
                    <div className='icon'>
                        <FontAwesomeIcon className="icon" icon={faTrophy} style={{ color: 'gold' }} />
                    </div>
                    <div className="RankingCellPosition">
                        #1
                    </div>
                    <div className="RankingCellUser"> {ranking[0].username} </div>
                    <div className="RankingCellScore">Pontos: {ranking[0].score}</div>
                </div>
                <div className="RankingRow">
                    <div className='icon'>
                        <FontAwesomeIcon className="icon" icon={faMedal} style={{ color: 'silver' }} />
                    </div>
                    <div className="RankingCellPosition">
                        #2
                    </div>
                    <div className="RankingCellUser">{ranking[1].username}</div>
                    <div className="RankingCellScore">Pontos: {ranking[1].score}</div>
                </div>
                <div className="RankingRow">
                    <div className='icon'>
                        <FontAwesomeIcon className="icon" icon={faMedal} style={{ color: '#cd7f32' }} />
                    </div>
                    <div className="RankingCellPosition">
                        #3
                    </div>
                    <div className="RankingCellUser">{ranking[2].username}</div>
                    <div className="RankingCellScore">Pontos: {ranking[2].score}</div>
                </div>
                <div className="RankingRow">
                        <FontAwesomeIcon className="icon" icon={faMedal} style={{ color: '#cd7f32' }} opacity={0}/>
                    <div className='icon'></div>
                    <div className="RankingCellPosition">#4</div>
                    <div className="RankingCellUser">{ranking[3].username}</div>
                    <div className="RankingCellScore">Pontos: {ranking[3].score}</div>
                </div>
                <div className="RankingRow">
                        <FontAwesomeIcon className="icon" icon={faMedal} style={{ color: '#cd7f32' }} opacity={0}/>
                    <div className='icon'></div>
                    <div className="RankingCellPosition">#5</div>
                    <div className="RankingCellUser">{ranking[4].username}</div>
                    <div className="RankingCellScore">Pontos: {ranking[4].score}</div>
                </div>
            </div>
        )
    }
    
}

export default Ranking;
