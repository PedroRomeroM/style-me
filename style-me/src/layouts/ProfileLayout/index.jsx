import React, { useState, useRef, useEffect } from 'react';
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard';
import ChallengeHeader from '../../components/ChallengeHeader/ChallengeHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import './Profile.scss';
import Ranking from '../../components/Ranking/Ranking';
import { getUserInfo, getRanking, getConcludedChallenges, updateUser, updatePassword, checkUsernameExists} from "../../services/ApiServices";
import Message from "../../components/UsuarioCriado";

const ProfileLayout = () => {

    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState('Fácil');
    const [concludedPage, setConcludedPage] = useState();
    const [file, setFile] = useState(null);

    const modalRef = useRef(null);

    const [username, setUsername] = useState();
    const [usernamescreen, setUsernameScreen] = useState();
    
    const [img, setImg] = useState(); 
    const [imgType, setimgType] = useState();
    const [email, setEmail] = useState();
    const [profile, setProfile] = useState(null);

    const challengesPerPage = 3;

    const [profile2, setProfile2] = useState(null);
    const [profile3, setProfile3] = useState(null);
    const [ranking, setRanking] = useState(null);

    const [chDone, setchDone] = useState(null);

    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [isUpdated, setIsUpdated] = useState('');

    const handleSenha = (event) => {
        setSenha(event.target.value);
    };
    
    const handleConfirmarSenha = (event) => {
        setConfirmarSenha(event.target.value);
    };

    useEffect(() => {
        const res = localStorage.getItem("auth");
        const parsed = JSON.parse(res);
        const token = parsed.token

        const ranking = getConcludedChallenges(token)
        ranking.then(res => {
            setchDone(res.data)
        }).catch (e => {
            console.log(e)
        })
        
    }, [profile3]);

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
            setUsernameScreen(res.data.username)
            setimgType(res.data.imgType)
            setImg(res.data.img)
            setEmail(res.data.email)

          }).catch(e => {
            console.log(e)
        });
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

    const renderChallenges = (color) => {
        if (chDone != null) {
            return (
                <div className="ChallengeListProfile">
                    {
                        chDone
                        .map(challenge => (
                            <ChallengeCard key={challenge.id} id={challenge.id} color={color} title={challenge.title} description={challenge.description} />
                        ))
    
                    }
                </div>
            );
        }
    };

    const handleImg = (event) => {
        const file = event.target.files[0];
    
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          setFile(file);
        //   setImgRequest(file);
        }
    };

    async function toBase64 (imgFile) {
    
        // Convertendo a imagem para base64
        const toBase64 = file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    
        const imgBase64 = imgFile ? await toBase64(imgFile) : null;
    
        let base64String = "";
        base64String = imgBase64.replace("data:", "").replace(/^.+,/, "");

        return base64String

    }

    async function updatePerfil (username, file, senha, confirmarSenha) {
        const res = localStorage.getItem("auth");
        const parsed = JSON.parse(res);
        const token = parsed.token

        let base64 = ""
        let imgType1 = ""

        if (senha && confirmarSenha) {
            updatePassword(token, senha, confirmarSenha)
            setIsUpdated('true')
        } 
        if (username || file) {
            if (file === null) {
                base64 = img
                imgType1 = imgType
            } else {
                base64 = await toBase64(file)

                imgType1 = file.type
            }

            if (usernamescreen != username){
                const check = checkUsernameExists(username)
                check.then(data => {
                    if (data.statusText === 'OK') {
                        setIsUpdated('false')
                    }
                  }).catch(e => {
                    console.log(e)
                  });
            }

            const response = updateUser(token,username,base64, imgType1)
            response.then(data => {
                if (data.status === 200) {
                  setIsUpdated('true')
                } else {
                  setIsUpdated('false')
                }
              }).catch(e => {
                console.log(e)
              });
        }
    }

    function checkIsUpdated () {
        if (isUpdated === 'true') {
          return (
            <Message text={'Perfil atualizado com sucesso!'} isError={false}/>
          )
        } else if (isUpdated === 'false') {
          return (
            <Message text={'Erro ao atualizar o perfil!'} isError={true}/>
          )
        }
      }
    

    return (
        <div className='Profile'>
            <a className='BackButtonProfile' onClick={goBack}>
                <FontAwesomeIcon icon={faAngleLeft} />
                <span>Voltar</span>
            </a>
            { checkIsUpdated()
            }
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
                        <h2 className='ProfileHeaderUsername'> {usernamescreen} </h2>
                    </div>
                </div>
            </div>
            <div className={`modal ${isModalOpen ? 'modal-open' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
                <div ref={modalRef} className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <div className='modal-content-container'>
                        <h2 className='modal-title'>Nova foto de perfil</h2>
                        <input className="file-input" type="file" accept="image/*" onChange={(e) => {handleImg(e); closeModal();}}/>
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
                                    <input type="text" className="Input" value={username} onChange={(e) => setUsername(e.target.value)}/>
                                <span className='InputLabel'>Email</span>
                                    <input type="text" className="Input" value={email} readOnly/>
                                <div className='MyDataFormColumns'>
                                    <div className='MyDataFormColumnLeft'>
                                        <span className='InputLabel'>Senha atual</span>
                                        <input type="password" className="Input" onChange={handleSenha}/>
                                    </div>
                                    <div className='MyDataFormColumnRight'>
                                        <span className='InputLabel'>Nova senha</span>
                                        <input type="password" className="Input" onChange={handleConfirmarSenha}/>
                                    </div>
                                </div> 
                                <button className="loginButtonProfile" onClick={() => {updatePerfil(username, file, senha, confirmarSenha);}}>Atualizar</button>
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
            <div className='ConcludedChallenges'>
                <div className='ChallengesContainer'>
                    <div className='Concluded'>
                        <ChallengeHeader 
                            color="purple" 
                            difficulty="Desafios Concluídos" 
                            selectedDifficulty={selectedDifficulty}
                            onSelectDifficulty={setSelectedDifficulty} 
                            isPerfil={true}
                        />
                        <div className='ChallengesGrid'>
                            {renderChallenges('purple')}
                        </div>
                    </div>
                </div>
                <footer></footer>
            </div>
        </div>
    );
};

export default ProfileLayout;
