import React, { useState, useEffect } from "react";
import "./Header.scss";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTrophy, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Header = ({ username, img, imgType, totalScore, isAdmin }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  useEffect(() => {
    
  }, []);

  function criarDesafio() {
   const isEditar = 'NOT-OK'
    navigate(`/criar-desafio`, { state: { isEditar } })
  }

  function logOut() {
    localStorage.removeItem("auth");
  }

  return (
    <div className="HeaderContainer">
      <header>
        <Link to="/challenges" className="groupLeft">
          <img src="./images/logo.svg" alt="Logo do site" />
        </Link>

        <div className="groupRight">
          <div className="userDetails">
            {isAdmin === 'true' ? (
                <button className="addButton" onClick={() => {criarDesafio()}}>Criar desafio</button>
            ) : (
              <div className="userDetailsContainer">
                <Link to="/profile" className="username">
                  <span className="textusername"> {username} </span>
                </Link>
                <Link to="/ranking" className="rankingInfo">
                  <span className="text"> {totalScore} </span>
                  <FontAwesomeIcon icon={faTrophy} className="icon" />
                </Link>
              </div>
            )}
          </div>
          <div
            className="profileDropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              className="profilePic"
              src={`data:${imgType};base64,${img}`}
              alt="Foto de perfil"
            />
            {isAdmin === 'true' ? (
              <div className={`dropdownContent ${dropdownVisible ? "show" : ""}`}>
                <Link to="/ranking">
                  <FontAwesomeIcon icon={faTrophy} className="icon" />{" "}
                  <span className="text">Ranking</span>
                </Link>
                <Link
                  to="/"
                  onClick={() => {
                    logOut();
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="icon" />{" "}
                  <span className="text">Sair</span>
                </Link>
              </div>
            ) : (
              <div className={`dropdownContent ${dropdownVisible ? "show" : ""}`}>
                <Link to="/profile">
                  <FontAwesomeIcon icon={faUser} className="icon" />{" "}
                  <span className="text">Meu Perfil</span>
                </Link>
                <Link to="/ranking">
                  <FontAwesomeIcon icon={faTrophy} className="icon" />{" "}
                  <span className="text">Ranking</span>
                </Link>
                <Link
                  to="/"
                  onClick={() => {
                    logOut();
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="icon" />{" "}
                  <span className="text">Sair</span>
                </Link>
              </div>
            )
            }

          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
