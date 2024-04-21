import "./NewProfile.scss";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { createUser } from "../../services/ApiServices";

const NewProfileLayout = () => {
  // eslint-disable-next-line
  {
    /* eslint-disable jsx-a11y/anchor-is-valid */
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const [userName, setUserName] = useState("");
  const [img, setImg] = useState(null);
  const [file, setFile] = useState(null);
  const [imgRequest, setImgRequest] = useState(null);

  const handleUsernameChange = (event) => {
    setUserName(event.target.value);
    // console.log(userName)
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

  function createUserProfile(id, user_name, file) {

    console.log(file)

    const formData = new FormData();
    formData.append("idUser", id);
    formData.append("username", user_name);
    formData.append("img", file);
    createUser(formData);
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
            <input type="text" className="NewProfileInput" />
            <span className="InputLabelNewProfile">Senha:</span>
            <input type="text" className="NewProfileInput" />
            <span className="InputLabelNewProfile">Confirme sua senha:</span>
            <input type="text" className="NewProfileInput" />
          </div>
        </div>
        <Link
          to={{
            pathname: "/",
            search: "?userCreated=true",
          }}
          className="loginLink"
        >
          <button
            className="newProfileButton"
            onClick={() => {
              createUserProfile(1, userName, file);
            }}
          >
            Enviar
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NewProfileLayout;
