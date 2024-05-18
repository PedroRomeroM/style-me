import React, { useState, useRef, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard';
import ChallengeHeader from '../../components/ChallengeHeader/ChallengeHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faEdit } from '@fortawesome/free-solid-svg-icons';
import './Profile.scss';
import Ranking from '../../components/Ranking/Ranking';
import { getUserInfo } from "../../services/ApiServices";

const ProfileLayout = () => {
    // eslint-disable-next-line
    {/* eslint-disable jsx-a11y/anchor-is-valid */ }
    const initialChallenges = new Array(8).fill().map((_, index) => ({ id: index }));
    const [concludedPage, setConcludedPage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);

    const [username, setUsername] = useState();
    
    const [img, setImg] = useState(); 
    const [imgType, setimgType] = useState();
    const [email, setEmail] = useState();
    const [profile, setProfile] = useState(null);

    const challengesPerPage = 3;
    

    useEffect(() => {
        if (isModalOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);

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
            setEmail(res.data.email)

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

    const goBack = () => {
        window.history.back();
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='Profile'>
            <a className='BackButtonProfile' onClick={goBack}>
                <FontAwesomeIcon icon={faAngleLeft} />
                <span>Voltar</span>
            </a>
            <div className='ProfileHeader'>
                <div className='ProfileHeaderContainer'>
                    <div className='profilePicContainer' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={openModal}>
                        <img className={`profilePic ${isHovered ? 'hovered' : ''}`} src={`data:${imgType};base64,${img}`} alt="Foto de perfil" />
                        {isHovered && (
                            <div className='editIcon'>
                                <FontAwesomeIcon icon={faEdit} />
                            </div>
                        )}
                    </div>
                    <div className='ProfileHeaderColumnRight'>
                        <img src='./images/my-style.svg' alt='Logo' />
                        <div className="separador"></div>
                        <h2 className='ProfileHeaderUsername'> {username} </h2>
                    </div>
                </div>
            </div>
            <div className={`modal ${isModalOpen ? 'modal-open' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
                <div ref={modalRef} className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <div className='modal-content-container'>
                        <h2 className='modal-title'>Nova foto de perfil</h2>
                        <input className="file-input" type="file" accept="image/*" />
                        <button className="SendButton">Enviar</button>
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
                                <input type="text" className="Input" value={username}/>
                                <span className='InputLabel'>Email</span>
                                <input type="text" className="Input" value={email} readOnly/>
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
                                <button>Atualizar</button>
                            </div>
                        </div>
                    </div>
                    <div className='Ranking'>
                        <div className='ColumnContainer'>
                            <div className='ColumnHeader'>
                                <div className='UserDataSideColor' />
                                <h1>Ranking</h1>
                            </div>
                            <div className='RankingProfile'>
                                <Ranking />
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

export default ProfileLayout;
