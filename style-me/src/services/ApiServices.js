import axios from "axios";


const BASE_URL = 'http://localhost:8085';

export async function createUser(formData){

    const response = await axios.post(`${BASE_URL}/MICROORQUESTRADOR/api/orq/cadastro`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response;
}

export async function login1(formData){

    const response = await axios.post(`${BASE_URL}/MICROAUTH/api/auth/login`, formData, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response;
}