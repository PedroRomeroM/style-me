import axios from "axios";


const BASE_URL = 'http://localhost:3001';

export async function createUser(formData){

    let objForm = Object.fromEntries(formData.entries());

    async function getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            resolve(reader.result)
          }
          reader.onerror = reject
        })
      }
      
      let base64String = "";
      await getBase64(objForm.img)
        .then(res => base64String=res) 
        .catch(err => console.log(err))

    base64String = base64String.replace("data:", "").replace(/^.+,/, "");


    let objSend = {
        "email":objForm.email,
        "senha":objForm.senha,
        "username":objForm.username,
        "imgtype":objForm.img.type,
        "imgcontent":base64String
    };

    const response = await axios.post(`${BASE_URL}/api/orq/cadastro`, objSend);
    
    return response;
}

export async function login1(formData){

  const response = await axios.post(`${BASE_URL}/api/auth/login`, formData, {
      headers: {
          "Content-Type": "application/json",
      }
  });
  return response;
}

export async function getUserInfo(tk){

  const response = await axios.get(`${BASE_URL}/api/user`, {
    headers: {
      'x-access-token': tk,
    }
  })

  return response;
}

export async function getChallenges(tk){

  const response = await axios.get(`${BASE_URL}/api/ch`, {
    headers: {
      'x-access-token': tk,
    }
  })

  var levels = response.data;


  return levels;
}

export async function getRanking(tk){

  const response = await axios.get(`${BASE_URL}/api/user/ranking`, {
    headers: {
      'x-access-token': tk,
    }
  })

  return response;
}

export async function getConcludedChallenges(tk){

  const response = await axios.get(`${BASE_URL}/api/ch/perfil`, {
    headers: {
      'x-access-token': tk,
    }
  })

  return response;
}