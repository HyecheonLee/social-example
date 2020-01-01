import axios from "axios";

const USER_URL = "/api/1.0/users";
const LOGIN_URL = "/api/1.0/login";
const HOAX_URL = "/api/1.0/hoaxes";

export function postHoaxFile(file) {
  return axios.post(`${HOAX_URL}/upload`, file);
}

export function loadNewHoaxCount(hoaxId, username) {
  if (username) {
    return loadHoaxesOfUserCountById(username, hoaxId, {direction: "after"});
  } else {
    return loadHoaxesCountById(hoaxId, {direction: "after"});
  }
}

export function loadHoaxesOfUserCountById(username, hoaxId, params) {
  const path = `${USER_URL}/${username}/hoaxes/${hoaxId}/count${makeParam(
      params
  )}`;
  return axios.get(path);
}

export function loadHoaxesCountById(hoaxId, params) {
  const path = `${HOAX_URL}/${hoaxId}/count${makeParam(params)}`;
  return axios.get(path);
}

export function loadHoaxesOfUserById(username, hoaxId, params) {
  const path = `${USER_URL}/${username}/hoaxes/${hoaxId}${makeParam(params)}`;
  return axios.get(path);
}

export function loadOldHoaxes(hoaxId, username) {
  if (username) {
    return loadHoaxesOfUserById(username, hoaxId, {
      page: 0,
      size: 5,
      direction: "before"
    });
  } else {
    return loadHoaxesById(hoaxId, {page: 0, size: 5, direction: "before"});
  }
}

export function loadNewHoaxes(hoaxId, username) {
  if (username) {
    return loadHoaxesOfUserById(username, hoaxId, {
      page: 0,
      size: 5,
      direction: "after"
    });
  } else {
    return loadHoaxesById(hoaxId, {page: 0, size: 5, direction: "after"});
  }
}

export function loadHoaxesById(
    hoaxId,
    params = {page: 0, size: 5, direction: "after"}
) {
  const path = `${HOAX_URL}/${hoaxId}${makeParam(params)}`;
  return axios.get(path);
}

export function loadHoaxes(username, param) {
  let api;
  if (username) {
    api = `${USER_URL}/${username}/hoaxes${makeParam(param)}`;
  } else {
    api = `${HOAX_URL}${makeParam(param)}`;
  }
  return axios.get(api);
}

function makeParam(params) {
  if (!params) {
    return "";
  } else {
    const keys = ["direction", "page", "size", "sort"];
    const result = keys
    .filter(value => {
      return params.hasOwnProperty(value);
    })
    .map(value => {
      return value + "=" + params[value];
    })
    .join("&");
    if (result) {
      return "?" + result;
    }
    return "";
  }
}

export function postHoax(hoax) {
  return axios.post(`${HOAX_URL}`, hoax);
}

export function updateUser(userId, body) {
  return axios.put(`${USER_URL}/${userId}`, body);
}

export function getUser(username) {
  return axios.get(`${USER_URL}/${username}`);
}

export function listUsers(param = {page: 0, size: 3}) {
  return axios.get(
      `${USER_URL}?page=${param.page || 0}&size=${param.size || 3}`
  );
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
