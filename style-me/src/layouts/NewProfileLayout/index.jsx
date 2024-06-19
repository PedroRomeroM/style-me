import "./NewProfile.scss";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate  } from "react-router-dom";
import { createUser, checkUsernameExists} from "../../services/ApiServices";

const NewProfileLayout = () => {
  // eslint-disable-next-line
  {
    /* eslint-disable jsx-a11y/anchor-is-valid */
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [img, setImg] = useState(null);
  const [file, setFile] = useState(null);
  const [imgRequest, setImgRequest] = useState(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isCreated, setIsCreated] = useState(false);

  const [usernameExists, setUsernameExists] = useState();

  const handleUsernameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSenha = (event) => {
    setSenha(event.target.value);
  };

  const handleConfirmarSenha = (event) => {
    setConfirmarSenha(event.target.value);
  };

  const handleImg = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImg(imageUrl);
      setFile(file);
      setImgRequest(file);
    }
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

  useEffect(() => {
    return () => {
      if (img) {
        URL.revokeObjectURL(img);
      }
    };
  }, [img]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
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
    if (isCreated === true){
      navigate(`/?userCreated=${isCreated}`);
    }
  }, [isCreated]);

  const [errors, setErrors] = useState({});

  function createUserProfile(user_name, file, email, senha, confirmarSenha) {

    const formData = new FormData();
    formData.append("username", user_name);
    formData.append("img", file);
    formData.append("email", email);
    formData.append("senha", senha);

    const validationErrors = {};
    if (!user_name) {
      validationErrors.username = "Nome de usuário é obrigatório!"
    }
    if (!email ) {
      validationErrors.email = "Email é obrigatório!"
    }
    if (!senha) {
      validationErrors.senha = "Senha é obrigatório!"
    }
    if (!confirmarSenha) {
      validationErrors.confirmarSenha = "Confirme sua senha!"
    }else if (confirmarSenha !== senha) {
      validationErrors.confirmarSenha = "Senhas não correspondem"
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      var response = createUser(formData);

      response.then(data => {
        if (data.status === 200) {
          setIsCreated(true)
        } else {
          alert('Erro ao criar o usuário: ' + data.msg)
        }
      }).catch(e => {
        console.log(e)
      });

      return
    }
  }

  return (
    <div className="NewProfileLayout">
      <div className="NewProfileContainer">
        <a className="BackButtonNewProfile" onClick={goBack}>
          <FontAwesomeIcon icon={faAngleLeft} />
          <span>Voltar</span>
        </a>
        <img
          className="NewProfileLogo"
          src="./images/logo.svg"
          alt="Logo do site"
        />
        <div className="Columns">
          <div className="ColumnLeft">
            <div className="NewProfilePicContainer">
              <span className="InputLabelNewProfile">Foto de perfil:</span>
              <div className="NewProfileprofilePicFrame" onClick={openModal}>
                {img ? (
                  <img className="imgProfile" src={img} alt="Profile image" />
                ) : (
                  <i className="profileIcon">
                    <FontAwesomeIcon icon={faUser} />
                  </i>
                )}
              </div>
            </div>
            <span className="InputLabelNewProfile">Nome de usuário:</span>
            <input
              type="text"
              className="NewProfileInput"
              onChange={handleUsernameChange}

            />
            {errors.username && <span className="formError">{errors.username}</span>}
          </div>
          <div className="NewProfileModal">
            <div
              className={`modal ${isModalOpen ? "modal-open" : ""}`}
              style={{ display: isModalOpen ? "block" : "none" }}
            >
              <div ref={modalRef} className="modal-content">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
                <div className="modal-content-container">
                  <h2 className="modal-title">Foto de perfil</h2>
                  <input
                    className="file-input"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleImg(e);
                      closeModal();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="ColumnMiddle">
            <div className="Separator" />
          </div>
          <div className="ColumnRight">
            <span className="InputLabelNewProfile">Email:</span>
            <input type="text" className="NewProfileInput" onChange={handleEmail}/>
            {errors.email && <span className="formError">{errors.email}</span>}
            <span className="InputLabelNewProfile">Senha:</span>
            <input type="password" className="NewProfileInput" onChange={handleSenha}/>
            {errors.senha && <span className="formError">{errors.senha}</span>}
            <span className="InputLabelNewProfile">Confirme sua senha:</span>
            <input type="password" className="NewProfileInput" onChange={handleConfirmarSenha} />
            {errors.confirmarSenha && <span className="formError">{errors.confirmarSenha}</span>}
          </div>
        </div>
        <div
          className="loginLink"
        >
          <button
            className="newProfileButton"
            onClick={() => {
              createUserProfile(userName, file, email, senha, confirmarSenha);
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProfileLayout;