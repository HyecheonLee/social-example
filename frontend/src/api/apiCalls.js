import axios from "axios";

export function listUsers(param = {page: 0, size: 3}) {
  return axios.get(
      `/api/1.0/users?page=${param.page || 0}&size=${param.size || 3}`);
}

export const signup = user => {
  return axios.post("/api/1.0/users", user);
};
export const login = user => {
  return axios.post("/api/1.0/login", {}, {auth: user});
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
