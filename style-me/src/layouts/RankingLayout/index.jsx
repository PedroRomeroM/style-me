import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import './RankingLayout.scss';
import Ranking from '../../components/Ranking/Ranking';
import { getRanking } from "../../services/ApiServices";

const RankingLayout = () => {
    // eslint-disable-next-line
    {/* eslint-disable jsx-a11y/anchor-is-valid */ }
    const goBack = () => {
        window.history.back();
    };

    const [profile, setProfile] = useState(null);
    const [ranking, setRanking] = useState(null);

    useEffect(() => {
        const res = localStorage.getItem("auth");
        const parsed = JSON.parse(res);
        const token = parsed.token

        const ranking = getRanking(token)
        ranking.then(res => {
             setRanking(res.data)
        }).catch (e => {
            console.log(e)
        })
        
    }, [profile]);

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
                <Ranking ranking={ranking}/>
                <img className='RankingLogo' src='./images/logo.svg' alt="Logo do site" />
            </div>
        </div>
    );
};

export default RankingLayout;
