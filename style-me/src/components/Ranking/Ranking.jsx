import React from 'react';
import './Ranking.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { faMedal } from '@fortawesome/free-solid-svg-icons';

const Ranking = ( { ranking } ) => {

    const realRanking = ranking;

    console.log(realRanking)

    const renderRanking = (r) => {
        return (
            <div className="RankingTable">
                {
                    realRanking.map(r => (
                        <div className="RankingRow">
                            <div className="RankingCellPosition">
                                #{r.pos}
                            </div>
                            <div className="RankingCellUser"> {r.username} </div>
                            <div className="RankingCellScore">Pontos: {r.score}</div>
                        </div>
                    ))
                }
            </div>
        );
    };

    if (ranking != null) {
        return (
            renderRanking()
        )
    }
    
}

export default Ranking;
