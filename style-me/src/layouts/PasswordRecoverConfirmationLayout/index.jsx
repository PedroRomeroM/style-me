import React from 'react';
import './PasswordRecoverConfirmationLayout.scss';
import DefaultBackscreen from '../../components/DefaultBackscreen/DefaultBackscreen';
import { Link } from 'react-router-dom';

const PasswordRecoverConfirmationLayout = () => {
    // eslint-disable-next-line
    {/* eslint-disable jsx-a11y/anchor-is-valid */ }

    return (
        <DefaultBackscreen>
            <div className='PasswordRecoverConfirmationLayout'>
                <div className='PasswordRecoverConfirmationContent'>
                    <img className='PasswordRecoverConfirmationLogo' src='./images/logo.svg' alt="Logo do site" />
                    <div className="separador"></div>
                    <span className='PasswordRecoverConfirmationSpan'>Em breve, você receberá um email contendo uma nova senha gerada aleatoriamente. Certifique-se de verificar a caixa de entrada do email cadastrado. Obrigado!</span>
                    <Link to="/">
                        <button className="sendButton">Voltar</button>
                    </Link>
                </div>
            </div>
        </DefaultBackscreen>
    );
};

export default PasswordRecoverConfirmationLayout;
