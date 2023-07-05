import axios from 'axios';
import authHeader from './auth-header';


class UserService {
  getPublicContent() {
    return axios.get(process.env.VUE_APP_APIURL + 'all');
  }

  getUserBoard() {
    var user=JSON.parse(localStorage.getItem('user'));
    if(user && user.userId)
      console.log(user.userId);
    return axios.get(process.env.VUE_APP_APIURL + `/User/GetByID?id=${user.userId}`, { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(process.env.VUE_APP_APIURL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(process.env.VUE_APP_APIURL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();
