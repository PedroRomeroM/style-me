import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {

    var res = localStorage.getItem("auth");

    if (res === null) {
        var auth = false;
    } else {
        var parsed = JSON.parse(res);
        auth = parsed.auth
    }

    return(
        auth ? <Outlet/> : <Navigate to="/"/>
    )
}

export default PrivateRoutes