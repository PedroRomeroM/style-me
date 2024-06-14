import { Outlet, Navigate } from 'react-router-dom'
import React, { useState } from 'react';
import { getTypeUser } from "../services/ApiServices";

const PrivateRoutesAdmin = () => {

    const [tipoUser, setTipoUser] = useState();

    var res = localStorage.getItem("auth");

    if (res === null) {
        var auth = false;
    } else {
        var parsed = JSON.parse(res);
        auth = parsed.auth
        var token = parsed.token

        const response = getTypeUser(token);
        response.then(res => {
        }).catch (res => {
            console.log(res)
        })


        const get = async () => {
            const a = await response;
            setTipoUser(a.data)
            
        };

        get();

    }

    if (tipoUser != null){
        if (tipoUser === 'ADM' && auth) {
            return (
                <Outlet/>
            )
        } else {
            return(
                <Navigate to="/"/>
            )
        }
    }
}

export default PrivateRoutesAdmin