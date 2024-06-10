import { Outlet, Navigate } from 'react-router-dom'
import { getTypeUser } from "../services/ApiServices";

const PrivateRoutesAdmin = () => {

    var res = localStorage.getItem("auth");

    if (res === null) {
        var auth = false;
    } else {
        var parsed = JSON.parse(res);
        var auth = parsed.auth
        var token = parsed.token
        var tipoUser = ''
        var connect = false;

        const response = getTypeUser(token);
        response.then(e => {
            tipoUser = e.data
        }).catch (e => {
            console.log(e)
        })
    }

    if (tipoUser === 'ADM' && auth) {
        connect = true;
    }

    return(
        connect ? <Outlet/> : <Navigate to="/"/>
    )
}

export default PrivateRoutesAdmin