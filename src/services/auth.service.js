import axios from 'axios';


class AuthService {
  login(user) {
    return axios
      .get(process.env.VUE_APP_APIURL + `/Authenticate/Login/login?userName=${ encodeURIComponent(user.username)}&password=${encodeURIComponent(user.password)}`,)
      .then(response => {
        if (response.data.response) {
          localStorage.setItem('user', JSON.stringify(response.data.response));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    console.log(JSON.stringify(user));
    return axios.post(process.env.VUE_APP_APIURL + '/Authenticate/Register/register', JSON.stringify(user),{headers:{'Content-Type': 'application/json'}});
  }
}

export default new AuthService();
