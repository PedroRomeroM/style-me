import './Header.scss'
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className='HeaderContainer'>
            <header>
                <img src='./images/logo.svg' alt="Logo do site" />
                <Link to="/profile" className="profileLink">
                    <img className="profilePic" src='./images/profile-picture.png' alt="Foto de perfil" />
                </Link>
            </header>
        </div>
    )
}

export default Header;
