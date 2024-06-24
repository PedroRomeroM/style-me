import axios from "axios";

const BASE_URL = "http://localhost:3001";

export async function createUser(formData) {

  let objForm = Object.fromEntries(formData.entries());

  let response2 = await axios.get(`${BASE_URL}/api/user/exists`, {
    headers: {
      "username": objForm.username
    },
  });
 
  if (response2.data === 'OK') {
    response2.status = 401
    response2.msg = 'Nome de usuário já existe!'
    let res = response2
    return res
  }

  let response3 = await axios.get(`${BASE_URL}/api/email/exists`, {
    headers: {
      "email": objForm.email
    },
  });
 
  if (response3.data === 'OK') {
    response3.status = 401
    response3.msg = 'Email já cadastrado!'
    let res = response3
    return res
  }
  

  async function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  }

  let base64String = "";
  await getBase64(objForm.img)
    .then((res) => (base64String = res))
    .catch((err) => console.log(err));

  base64String = base64String.replace("data:", "").replace(/^.+,/, "");

  let objSend = {
    email: objForm.email,
    senha: objForm.senha,
    username: objForm.username,
    imgtype: objForm.img.type,
    imgcontent: base64String,
  };

  const response = await axios.post(`${BASE_URL}/api/orq/cadastro`, objSend);

  return response;
}

export async function login1(formData) {
  const response = await axios.post(`${BASE_URL}/api/auth/login`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

export async function getUserInfo(tk) {
  const response = await axios.get(`${BASE_URL}/api/user`, {
    headers: {
      "x-access-token": tk,
    },
  });

  return response;
}

export async function getChallenges(tk) {
  const response = await axios.get(`${BASE_URL}/api/ch`, {
    headers: {
      "x-access-token": tk,
    },
  });

  var levels = response.data;

  return levels;
}

export async function getRanking(tk) {
  const response = await axios.get(`${BASE_URL}/api/user/ranking`, {
    headers: {
      "x-access-token": tk,
    },
  });

  return response;
}

export async function getConcludedChallenges(tk) {
  const response = await axios.get(`${BASE_URL}/api/ch/perfil`, {
    headers: {
      "x-access-token": tk,
    },
  });

  return response;
}

export async function getChallengeInfo(tk, idCh) {
  const response = await axios.get(`${BASE_URL}/api/ch/des`, {
    headers: {
      "x-access-token": tk,
      "id-challenge": idCh,
    },
  });

  return response;
}

export async function fetchGameHtml(tk, idCh) {
  try {
    const response = await axios.get(`${BASE_URL}/api/ch/des`, {
      headers: {
        "x-access-token": tk,
        "id-challenge": idCh,
      },
    });
    return response.data.html; // Adjust this based on the actual response structure
  } catch (error) {
    console.error("Erro ao buscar HTML:", error);
    return "";
  }
}

export async function fetchGameCss(tk, idCh) {
  try {
    const response = await axios.get(`${BASE_URL}/api/ch/des`, {
      headers: {
        "x-access-token": tk,
        "id-challenge": idCh,
      },
    });
    return response.data.cssBase; 
  } catch (error) {
    console.error("Erro ao buscar cssBase:", error);
    return "";
  }
}

export async function ChDone(tk, idCh) {
  try {
    const response = await axios.post(`${BASE_URL}/api/ch/done`, {},{ 
      headers: {
        "x-access-token": tk,
        "id-challenge": idCh,
      },
    });
    return response;
  } catch (error) {
    console.error("Erro ao concluir desafio:", error);
    return "";
  }
}

export async function updateUser(tk, usern, bas64, imgtype) {
  try {

    const response = await axios.put(`${BASE_URL}/api/user/up`, {}, {
      headers: {
        'x-access-token': tk,
        'img': bas64,
        'username': usern,
        'img-type': imgtype,
        'Content-Type': 'application/json'
      },
    });

    return response;
  } catch (error) {
    console.error('Erro ao atualizar o perfil:', error);
    return '';
  }
}


export async function getTypeUser(tk) {
  const response = await axios.get(`${BASE_URL}/api/tipo/user`, {
    headers: {
      "x-access-token": tk,
    },
  })
  return response;
};

  export async function recoverPassword(email) {
    const response = await axios.get(`${BASE_URL}/api/rec/senha`, {
      headers: {
        "email": email
      },
    });
  return response;
}

export async function updatePassword(tk, senha, confSenha) {
  try {
    const response = await axios.put(`${BASE_URL}/api/password/up`, {}, {
      headers: {
        'x-access-token': tk,
        'senha': senha,
        'confirmar-senha': confSenha,
        'Content-Type': 'application/json'
      },
    });

    return response;
  } catch (error) {
    console.error('Erro ao atualizar o perfil:', error);
    return '';
  }
}

export async function deleteChallenge(tk, idChallenge) {
  const response = await axios.delete(`${BASE_URL}/api/del/ch`, {
    headers: {
      "x-access-token": tk,
      "challenge-id": idChallenge
    },
  })
  return response;
};

export async function createChallenge(tk, title, level, description, html, cssBase, CssFinal) {
  try {

    let objSend = {
      title: title,
      level: level,
      description: description,
      html: html,
      cssBase: cssBase,
      cssFinal: CssFinal
    };

    const response = await axios.post(`http://localhost:8083/api/ch`, objSend);
    return response;
  } catch (error) {
    console.error("Erro ao criar o desafio:", error);
    return "";
  }
}

export async function checkUsernameExists(username) {
  const response = await axios.get(`${BASE_URL}/api/user/exists`, {
    headers: {
      "username": username
    },
  });
return response;
}

export async function updateChallenge(tk, id,title,level,description,html,cssBase,cssFinal) {
  try {

    let objSend = {
      id: id,
      title: title,
      level: level,
      description: description,
      html: html,
      cssBase: cssBase,
      cssFinal: cssFinal
    };    

    const response = await axios.put(`${BASE_URL}/api/ch/up`, {objSend}, {
      headers: {
        'Content-Type': 'application/json'
      },
    });

    return response;
  } catch (error) {
    console.error('Erro ao atualizar o desafio:', error);
    return '';
  }
}