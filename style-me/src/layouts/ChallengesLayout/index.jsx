import React, { useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Header from '../../components/Header/Header';
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard';
import ChallengeHeader from '../../components/ChallengeHeader/ChallengeHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import './Challenges.scss';

const ChallengesLayout = () => {
    const initialChallenges = new Array(8).fill().map((_, index) => ({ id: index }));
    const [easyPage, setEasyPage] = useState(0);
    const [mediumPage, setMediumPage] = useState(0);
    const [hardPage, setHardPage] = useState(0);

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
            <Header />
            <div className='ChallengesContainer'>
                <div className='Easy'>
                    <ChallengeHeader color="green" difficulty="Fácil" />
                    <div className='Column'>
                        {easyPage !== 0 && (
                            <a className='ArrowCarousel' onClick={() => handleNext('easy', 'prev')}>
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </a>
                        )}
                    </div>
                    <div className='ColumnCenter'>
                        {renderChallenges('green', easyPage)}
                    </div>
                    <div className='Column'>
                        {!isLastPage('easy', easyPage) && (
                            <a className='ArrowCarousel' onClick={() => handleNext('easy', 'next')}>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </a>
                        )}
                    </div>
                </div>
                <div className='Medium'>
                    <ChallengeHeader color="yellow" difficulty="Médio" />
                    <div className='Column'>
                        {mediumPage !== 0 && (
                            <a className='ArrowCarousel' onClick={() => handleNext('medium', 'prev')}>
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </a>
                        )}
                    </div>
                    <div className='ColumnCenter'>
                        {renderChallenges('yellow', mediumPage)}
                    </div>
                    <div className='Column'>
                        {!isLastPage('medium', mediumPage) && (
                            <a className='ArrowCarousel' onClick={() => handleNext('medium', 'next')}>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </a>
                        )}
                    </div>
                </div>
                <div className='Hard'>
                    <ChallengeHeader color="red" difficulty="Difícil" />
                    <div className='Column'>
                        {hardPage !== 0 && (
                            <a className='ArrowCarousel' onClick={() => handleNext('hard', 'prev')}>
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </a>
                        )}
                    </div>
                    <div className='ColumnCenter'>
                        {renderChallenges('red', hardPage)}
                    </div>
                    <div className='Column'>
                        {!isLastPage('hard', hardPage) && (
                            <a className='ArrowCarousel' onClick={() => handleNext('hard', 'next')}>
                                <FontAwesomeIcon icon={faAngleRight} />
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
