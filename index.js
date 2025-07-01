const axios = require('axios');

const myData = {
    email: "youremail@email.fr",
    password1: 'yourpassword',
    password2: 'yourpassword'
}

const login = {
    email: "youremail@test.fr",
    password: 'yourpassword',
}

const dataToCreateApplication = {
    email: 'youremail@test.fr',
    password: 'yourpassword',
    first_name: 'first',
    last_name: 'last'
}

const register = async (userRegister) => {
    const url = `https://hire-game.pertimm.dev/api/v1.1/auth/register/`;
    try {
      const { data } = await axios.post(url, userRegister)
      return data
    } catch (error) {
    console.error(error.message);
  }
}

const getUserToken = async (userLogin) => {
    const url = `https://hire-game.pertimm.dev/api/v1.1/auth/login/`;
    try {
      const { data } = await axios.post(url, userLogin);
      return data.token;
    } catch (error) {
    console.error(error.message);
  }
}

const statusToComplete = async (dataUrl, token) => {
  const { data } = await axios(dataUrl, {headers: {Authorization: `Token ${token}` }});
  if (data.status !== 'COMPLETED') return statusToComplete(dataUrl, token);
  return data;
}

const createApplication = async (applicant, tokenProvider) => {
    const url = 'https://hire-game.pertimm.dev/api/v1.1/job-application-request/';
    const token = await tokenProvider;
    try {
     const { data } = await axios.post(url, applicant, {headers: {Authorization: `Token ${token}` }});
       const confirmationUrl = await statusToComplete(data.url, token);
       const confirmApplication = await axios.patch(confirmationUrl.confirmation_url,
         {confirmed: true}, {headers: {Authorization: `Token ${token}` }});
         console.log("c'est bon", confirmApplication.data)
       return confirmApplication.data.confirmed;
    } catch (error) {
    console.error(error);
  }
}

const process = async () => {
    await register(myData);
    await createApplication(dataToCreateApplication, getUserToken(login));
}

process();
