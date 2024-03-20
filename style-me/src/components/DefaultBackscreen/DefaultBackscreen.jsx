import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import './DefaultBackscreen.scss';

const DefaultBackscreen = ({ children }) => {
    // eslint-disable-next-line
    {/* eslint-disable jsx-a11y/anchor-is-valid */ }
    const goBack = () => {
        window.history.back();
    };

    return (
        <div className='DefaultBackscreen'>
            <a className='BackButtonDefaultBackscreen' onClick={goBack}>
                <FontAwesomeIcon icon={faAngleLeft} />
                <span>Voltar</span>
            </a>
            <div className='DefaultBackscreenContainer'>
                {children}
            </div>
        </div>
    );
};

export default DefaultBackscreen;
