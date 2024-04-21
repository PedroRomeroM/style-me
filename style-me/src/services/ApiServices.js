import axios from "axios";


const BASE_URL = 'http://localhost:3001/api';

export async function createUser(formData){

    for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }

    const response = await axios.post(`${BASE_URL}/user`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response;
}