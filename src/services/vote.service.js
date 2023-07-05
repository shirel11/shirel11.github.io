import axios from 'axios';
import authHeader from './auth-header';

class VoteService {
  createVote(vote) {
        console.log(JSON.stringify(vote));
        var res=axios.post(`${process.env.VUE_APP_APIURL}/Vote/Create`,JSON.stringify(vote),{headers:authHeader()})
        return res;
    
  }
  updateVote(vote) {
    console.log(JSON.stringify(vote));
    var res=axios.post(`${process.env.VUE_APP_APIURL}/Vote/Update?id=${vote.id}`,JSON.stringify(vote),{headers:authHeader()})
    return res;

}
  getVoteTypes(){
    return axios.get(`${process.env.VUE_APP_APIURL}/Vote/GetVoteType`,{headers:authHeader()});
  }
  deleteVote(voteId){
    return axios.delete(`${process.env.VUE_APP_APIURL}/Vote/DeleteList`,{headers:authHeader(),data:voteId}).then();

  }
  getVoteByGuid(guid,userGuid){
    return axios.get(`${process.env.VUE_APP_APIURL}/Vote/GetByGuid?guid=${guid}&UserGuid=${encodeURIComponent(userGuid)}`,{headers:authHeader()}).then();
  }
  getUserBoard() {
    var user=JSON.parse(localStorage.getItem('user'));
    if(user && user.userId)
      console.log(user.userId);
    return axios.get(process.env.VUE_APP_APIURL + `User/GetByID?id=${user.userId}`, { headers: authHeader() });
  }

createVoteAnswers(voteAnswers){

  console.log(JSON.stringify(voteAnswers));
  return axios.post(`${process.env.VUE_APP_APIURL}/VoteAnswers/Create`,JSON.stringify(voteAnswers),{
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
  });

}
getVoteAnswers(voteId){

  return axios.get(`${process.env.VUE_APP_APIURL}/VoteAnswers/GetAll?VoteID=${voteId}`,{headers:authHeader()});

}
}

export default new VoteService();
