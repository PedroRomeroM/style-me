import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;


export async function createUser(formData){
    const response = await axios.post(`${API_URL}/user`, formData);
    return response.data;
}