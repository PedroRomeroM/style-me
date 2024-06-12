import React, { useState, useEffect, useRef } from "react";
import './ChallengeCard.scss';
import { useNavigate } from 'react-router-dom';
import { deleteChallenge } from "../../services/ApiServices";

const ChallengeCard = ({ id, color, title, description, isAdmin }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);
  const spanRef = useRef(null);

  const navigate = useNavigate();

  function desafio(id) {
    navigate(`/desafio`, { state: { id } })
  }

  useEffect(() => {

    console.log(isAdmin)
    const spanElement = spanRef.current;

    function checkScroll() {
      if (spanElement.scrollHeight > spanElement.clientHeight) {
        spanElement.classList.remove("hide-scroll-buttons");
      } else {
        spanElement.classList.add("hide-scroll-buttons");
      }
    }

    // Verifica o scroll ao carregar
    checkScroll();

    // Verifica o scroll ao redimensionar a janela
    window.addEventListener("resize", checkScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  useEffect(() => {
    const res = localStorage.getItem("auth");
    const parsed = JSON.parse(res);
    const token = parsed.token
    setToken(token)
    
}, [profile]);


  function delChallenge(tk, idCh) {
    if (tk != null) {
      var res = deleteChallenge(tk, idCh);
      res.then(data => {
        if (data.status === 200) {
          alert('Desafio deletado com sucesso!')
        } else {
          alert('Erro ao deletar o desafio')
        }
      }).catch(e => {
        console.log(e)
      });

    }
  }

  return (
    <div className={`ChallengeCardContainer ${isHovered ? 'hovered' : ''}`}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}>
      <div className='ChallengeCard'>
        <div className='Card'>
          <span className='ChallengeNumber'># {id}</span>
          <div className='CardInfoContainer'>
            <div className={`CardSideColor ${color}`} />
            <div className='CardTitle'>
              <h2> {title} </h2>
              <span ref={spanRef} className="CardDescription"> {description} </span>
              <button className={`ChallengeButton ${color}`} onClick={() => {desafio(id)}}>VISUALIZAR</button>
            </div>
            {isAdmin === 'true' ? (
              <div className="deleteDiv">
                <img className="deleteIcon" src="./images/garbage-icon.png" alt="" onClick={() => {delChallenge(token, id);}}/>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;