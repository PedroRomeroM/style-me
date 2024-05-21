import React, { useState, useRef, useEffect } from 'react';
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard';
import ChallengeHeader from '../../components/ChallengeHeader/ChallengeHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import './Profile.scss';
import Ranking from '../../components/Ranking/Ranking';
import { getUserInfo, getRanking } from "../../services/ApiServices";

const ProfileLayout = () => {
    const initialChallenges = new Array(8).fill().map((_, index) => ({ id: index }));
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState('Fácil');
    const [concludedPage, setConcludedPage] = useState();

    const modalRef = useRef(null);

    const [username, setUsername] = useState();
    
    const [img, setImg] = useState(); 
    const [imgType, setimgType] = useState();
    const [email, setEmail] = useState();
    const [profile, setProfile] = useState(null);

    const challengesPerPage = 3;

    const [profile2, setProfile2] = useState(null);
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
        
    }, [profile2]);
    

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

    const renderChallenges = () => {
        return initialChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} color={selectedDifficulty === 'Fácil' ? 'green' : selectedDifficulty === 'Médio' ? 'yellow' : 'red'} />
        ));
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
                                <button className="loginButtonProfile">Atualizar</button>
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
                                <Ranking ranking={ranking}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='ConcludedChallenges'>
                <div className='ChallengesContainer'>
                    <div className='Concluded'>
                        <ChallengeHeader 
                            color="purple" 
                            difficulty="Desafios Concluídos" 
                            selectedDifficulty={selectedDifficulty}
                            onSelectDifficulty={setSelectedDifficulty} 
                        />
                        <div className='ChallengesGrid'>
                            {renderChallenges()}
                        </div>
                    </div>
                </div>
                <footer></footer>
            </div> */}
        </div>
    );
};

export default ProfileLayout;
