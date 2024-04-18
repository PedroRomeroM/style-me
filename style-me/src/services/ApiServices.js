import axios from "axios";

const BASE_URL = 'http://localhost:3000/api';


export async function createUser(formData){
    const response = await axios.post(`${BASE_URL}/user`, formData);
    return response.data;
}