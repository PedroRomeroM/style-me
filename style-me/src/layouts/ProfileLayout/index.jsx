import React, { useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard';
import ChallengeHeader from '../../components/ChallengeHeader/ChallengeHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import './Profile.scss';

const ChallengesLayout = () => {
    // eslint-disable-next-line
    {/* eslint-disable jsx-a11y/anchor-is-valid */ }
    const initialChallenges = new Array(8).fill().map((_, index) => ({ id: index }));
    const [concludedPage, setConcludedPage] = useState(0);

    const challengesPerPage = 3;

    const handleNext = (difficulty, direction) => {
        switch (difficulty) {
            case 'concluded':
                if (direction === 'next') {
                    setConcludedPage(prevPage => prevPage + 1);
                } else {
                    setConcludedPage(prevPage => prevPage - 1);
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

    const goBack = () => {
        window.history.back();
    };

    return (
        <div className='Profile'>
            <div className='ProfileHeader'>
                <a className='BackButton' onClick={goBack}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                    <span>Voltar</span>
                </a>
                <div className='ProfileHeaderContainer'>
                    <img className="profilePic" src='./images/profile-picture.png' alt="Foto de perfil" />
                    <div className='ProfileHeaderColumnRight'>
                        <img src='./images/my-style.svg' alt='Logo' />
                        <div className="separador"></div>
                        <h2 className='ProfileHeaderUsername'>Romerão</h2>
                    </div>
                </div>
            </div>
            <div className='UserData'>
                <div className='UserDataContainer'>
                    <div className='MyData'>
                        <div className='ColumnContainer'>
                            <div className='ColumnHeader'>
                                <div className='UserDataSideColor' />
                                <h1>Meus dados</h1>
                            </div>
                            <div className='MyDataForm'>
                                <span className='InputLabel'>Nome de usuário</span>
                                <input type="text" className="Input" />
                                <span className='InputLabel'>Email</span>
                                <input type="text" className="Input" />
                                <div className='MyDataFormColumns'>
                                    <div className='MyDataFormColumnLeft'>
                                        <span className='InputLabel'>Senha atual</span>
                                        <input type="password" className="Input" />
                                    </div>
                                    <div className='MyDataFormColumnRight'>
                                        <span className='InputLabel'>Nova senha</span>
                                        <input type="password" className="Input" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='Ranking'>
                        <div className='ColumnContainer'>
                            <div className='ColumnHeader'>
                                <div className='UserDataSideColor' />
                                <h1>Ranking</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='ConcludedChallenges'>
                <div className='ChallengesContainer'>
                    <div className='Concluded'>
                        <ChallengeHeader color="purple" difficulty="Desafios Concluídos" />
                        <div className='Column'>
                            {concludedPage !== 0 && (
                                <a onClick={() => handleNext('concluded', 'prev')}>
                                    <FontAwesomeIcon className='ArrowCarousel' icon={faAngleLeft} />
                                </a>
                            )}
                        </div>
                        <div className='ColumnCenter'>
                            {renderChallenges('purple', concludedPage)}
                        </div>
                        <div className='Column'>
                            {!isLastPage('Concluded', concludedPage) && (
                                <a onClick={() => handleNext('concluded', 'next')}>
                                    <FontAwesomeIcon className='ArrowCarousel' icon={faAngleRight} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                <footer></footer>
            </div>
        </div>
    );
};

export default ChallengesLayout;
