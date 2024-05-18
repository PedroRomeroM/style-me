import React, { useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Header from '../../components/Header/Header';
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard';
import ChallengeHeader from '../../components/ChallengeHeader/ChallengeHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import './Challenges.scss';
import { getUserInfo } from "../../services/ApiServices";

const ChallengesLayout = () => {
    // eslint-disable-next-line
    {/* eslint-disable jsx-a11y/anchor-is-valid */}
    const initialChallenges = new Array(8).fill().map((_, index) => ({ id: index }));
    const [easyPage, setEasyPage] = useState(0);
    const [mediumPage, setMediumPage] = useState(0);
    const [hardPage, setHardPage] = useState(0);
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState();
    
    const [img, setImg] = useState(); 
    const [imgType, setimgType] = useState();   
    const [totalScore, setTotalScore] = useState();

    const challengesPerPage = 3;

    const handleNext = (difficulty, direction) => {
        switch (difficulty) {
            case 'easy':
                if (direction === 'next') {
                    setEasyPage(prevPage => prevPage + 1);
                } else {
                    setEasyPage(prevPage => prevPage - 1);
                }
                break;
            case 'medium':
                if (direction === 'next') {
                    setMediumPage(prevPage => prevPage + 1);
                } else {
                    setMediumPage(prevPage => prevPage - 1);
                }
                break;
            case 'hard':
                if (direction === 'next') {
                    setHardPage(prevPage => prevPage + 1);
                } else {
                    setHardPage(prevPage => prevPage - 1);
                }
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const res = localStorage.getItem("auth");
        const parsed = JSON.parse(res);
        const token = parsed.token
        getUsersInfo(token)
    }, [profile]);

    function getUsersInfo(token) {
        const profile = getUserInfo(token);
        profile.then(res => {

            setUsername(res.data.username)
            setimgType(res.data.imgType)
            setImg(res.data.img)

            if (res.data.totalScore === null) {
                setTotalScore(0);
            } else {
                setTotalScore(res.data.totalScore)
            }

          }).catch(e => {
            console.log(e)
        });
    };

    const renderChallenges = (difficulty, page) => {
        const startIndex = page * challengesPerPage;
        const endIndex = startIndex + challengesPerPage;
        const slicedChallenges = initialChallenges.slice(startIndex, endIndex);
        return (
            <TransitionGroup component={null}>
                {slicedChallenges.map(challenge => (
                    <CSSTransition key={challenge.id} classNames="challenge-item" timeout={500}>
                        <ChallengeCard color={difficulty} />
                    </CSSTransition>
                ))}
            </TransitionGroup>
        );
    };

    const isLastPage = (difficulty, page) => {
        const totalChallenges = initialChallenges.length;
        const totalPages = Math.ceil(totalChallenges / challengesPerPage);
        return page === totalPages - 1;
    };

    return (
        <div className='Challenges'>
            <Header username={username} img={img} imgType={imgType} totalScore={totalScore}/>
            <div className='ChallengesContainer'>
                <div className='Easy'>
                    <ChallengeHeader color="green" difficulty="Nível Fácil" />
                    <div className='Column'>
                        {easyPage !== 0 && (
                            <a onClick={() => handleNext('easy', 'prev')}>
                                <FontAwesomeIcon className='ArrowCarousel' icon={faAngleLeft} />
                            </a>
                        )}
                    </div>
                    <div className='ColumnCenter'>
                        {renderChallenges('green', easyPage)}
                    </div>
                    <div className='Column'>
                        {!isLastPage('easy', easyPage) && (
                            <a onClick={() => handleNext('easy', 'next')}>
                                <FontAwesomeIcon className='ArrowCarousel' icon={faAngleRight} />
                            </a>
                        )}
                    </div>
                </div>
                <div className='Medium'>
                    <ChallengeHeader color="yellow" difficulty="Nível Médio" />
                    <div className='Column'>
                        {mediumPage !== 0 && (
                            <a onClick={() => handleNext('medium', 'prev')}>
                                <FontAwesomeIcon className='ArrowCarousel' icon={faAngleLeft} />
                            </a>
                        )}
                    </div>
                    <div className='ColumnCenter'>
                        {renderChallenges('yellow', mediumPage)}
                    </div>
                    <div className='Column'>
                        {!isLastPage('medium', mediumPage) && (
                            <a onClick={() => handleNext('medium', 'next')}>
                                <FontAwesomeIcon className='ArrowCarousel'icon={faAngleRight} />
                            </a>
                        )}
                    </div>
                </div>
                <div className='Hard'>
                    <ChallengeHeader color="red" difficulty="Nível Difícil" />
                    <div className='Column'>
                        {hardPage !== 0 && (
                            <a onClick={() => handleNext('hard', 'prev')}>
                                <FontAwesomeIcon className='ArrowCarousel'icon={faAngleLeft} />
                            </a>
                        )}
                    </div>
                    <div className='ColumnCenter'>
                        {renderChallenges('red', hardPage)}
                    </div>
                    <div className='Column'>
                        {!isLastPage('hard', hardPage) && (
                            <a onClick={() => handleNext('hard', 'next')}>
                                <FontAwesomeIcon className='ArrowCarousel'icon={faAngleRight} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
            <footer></footer>
        </div>
    );
};

export default ChallengesLayout;
