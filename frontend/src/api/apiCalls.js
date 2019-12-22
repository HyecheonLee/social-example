import axios from "axios";

const USER_URL = "/api/1.0/users";
const LOGIN_URL = "/api/1.0/login";

export function updateUser(userId, body) {
  return axios.put(`${USER_URL}/${userId}`, body);
}

export function getUser(username) {
  return axios.get(`${USER_URL}/${username}`);
}

export function listUsers(param = {page: 0, size: 3}) {
  return axios.get(
      `${USER_URL}?page=${param.page || 0}&size=${param.size || 3}`);
}

export const signup = user => {
  return axios.post(USER_URL, user);
};
export const login = user => {

  return axios.post(LOGIN_URL, {}, {auth: user});
};
export const setAuthorizationHeader = ({username, password, isLoggedIn}) => {
  if (isLoggedIn) {
    axios.defaults.headers.common["Authorization"] = `Basic ${btoa(
        username + ":" + password
    )}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};
