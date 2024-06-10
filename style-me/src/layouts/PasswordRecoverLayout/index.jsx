import React, { useState } from 'react';
import './PasswordRecoverLayout.scss';
import DefaultBackscreen from '../../components/DefaultBackscreen/DefaultBackscreen';
import { Link, useNavigate } from 'react-router-dom';
import { recoverPassword } from "../../services/ApiServices";

const PasswordRecoverLayout = () => {
    // eslint-disable-next-line
    {/* eslint-disable jsx-a11y/anchor-is-valid */ }

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const handleEmail = (event) => {
        setEmail(event.target.value);
    };

    const [errors, setErrors] = useState({});

    const recoverPasswords = (email) => {

        const validationErrors = {};
        if (!email) {
            validationErrors.email = "Email é obrigatório!"
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0){
            var response = recoverPassword(email);

            response.then(data => {
              if (data.status === 200) {
                navigate(`/recover-password-confirmation`)
              } else {
                alert('Erro ao recuperar email!')
              }
            }).catch(e => {
              console.log(e)
            });
      
            return
        }    
    }

    return (
        <DefaultBackscreen>
            <div className='PasswordRecoverLayout'>
                <div className='PasswordRecoverContent'>
                    <img className='PasswordRecoverLogo' src='./images/logo.svg' alt="Logo do site" />
                    <div className="separador"></div>
                    <span className='PasswordRecoverSpan'>Digite seu email:</span>
                    <input type="text" className='PasswordRecoverInput' onChange={handleEmail}/>
                    {errors.email && <span className="formError">{errors.email}</span>}
                    <button className="sendButtonPasswordRecover" onClick={() => {recoverPasswords(email);}}>Recuperar senha</button>
                    <Link to="/recover-password-confirmation">
                        
                    </Link>
                </div>
            </div>
        </DefaultBackscreen>
    );
};

export default PasswordRecoverLayout;
