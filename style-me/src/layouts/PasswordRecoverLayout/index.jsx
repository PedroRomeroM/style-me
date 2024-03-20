import React from 'react';
import './PasswordRecoverLayout.scss';
import DefaultBackscreen from '../../components/DefaultBackscreen/DefaultBackscreen';
import { Link } from 'react-router-dom';

const PasswordRecoverLayout = () => {
    // eslint-disable-next-line
    {/* eslint-disable jsx-a11y/anchor-is-valid */ }

    return (
        <DefaultBackscreen>
            <div className='PasswordRecoverLayout'>
                <div className='PasswordRecoverContent'>
                    <img className='PasswordRecoverLogo' src='./images/logo.svg' alt="Logo do site" />
                    <div className="separador"></div>
                    <span className='PasswordRecoverSpan'>Digite seu email:</span>
                    <input type="text" className='PasswordRecoverInput' />
                    <Link to="/recover-password-confirmation">
                        <button className="sendButtonPasswordRecover">Recuperar senha</button>
                    </Link>
                </div>
            </div>
        </DefaultBackscreen>
    );
};

export default PasswordRecoverLayout;
