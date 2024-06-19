import "./Autentication.scss";
import Login from "../../components/Autentication/AutenticationComponent";
import { useLocation } from "react-router-dom";
import UsuarioCriado from "../../components/UsuarioCriado";

const AutenticationLayout = (created) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userCreated = queryParams.get("userCreated") === "true";

  return (
    <div className="AutenticationLayout">
      <div className="AutenticationContainer">
        {userCreated && (
          <>
            <UsuarioCriado className= "userCreated" text={'Usuário criado com sucesso!'}/>
          </>
        )}
        <Login />
      </div>
    </div>
  );
};

export default AutenticationLayout;
