import React, { useState } from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrophy, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Importe os ícones que você precisa

const Header = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const handleMouseEnter = () => {
        setDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        setDropdownVisible(false);
    };

    return (
        <div className='HeaderContainer'>
            <header>
                <img src='./images/logo.svg' alt="Logo do site" />
                <div
                    className="profileDropdown"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <img
                        className="profilePic"
                        src='./images/profile-picture.png'
                        alt="Foto de perfil"
                    />
                    <div className={`dropdownContent ${dropdownVisible ? 'show' : ''}`}>
                        <Link to="/profile">
                            <FontAwesomeIcon icon={faUser} className="icon" /> <span className="text">Meu Perfil</span>
                        </Link>
                        <Link to="/ranking">
                            <FontAwesomeIcon icon={faTrophy} className="icon" /> <span className="text">Ranking</span>
                        </Link>
                        <Link to="/">
                            <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> <span className="text">Sair</span>
                        </Link>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header;
