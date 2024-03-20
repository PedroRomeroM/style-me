import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import './RankingLayout.scss';
import Ranking from '../../components/Ranking/Ranking';

const RankingLayout = () => {
    // eslint-disable-next-line
    {/* eslint-disable jsx-a11y/anchor-is-valid */ }
    const goBack = () => {
        window.history.back();
    };

    return (
        <div className='RankingLayout'>
            <a className='BackButtonRanking' onClick={goBack}>
                <FontAwesomeIcon icon={faAngleLeft} />
                <span>Voltar</span>
            </a>
            <div className='RankingContainer'>
                <div className='RankingHeader'>
                    <div className='RankingSideColor' />
                    <h1>Ranking</h1>
                </div>
                <Ranking />
                <img className='RankingLogo' src='./images/logo.svg' alt="Logo do site" />
            </div>
        </div>
    );
};

export default RankingLayout;
