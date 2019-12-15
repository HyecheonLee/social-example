import { applyMiddleware, createStore } from "redux";
import rootReducer from "./index";
import thunk from "redux-thunk";
import logger from "redux-logger";
import * as apiCalls from "../api/apiCalls";

const configureStore = (addLogger = true) => {
  let localStorageData = localStorage.getItem("hoax-auth");

  let persistedState = {
    id: 0,
    username: "",
    displayName: "",
    image: "",
    password: "",
    isLoggedIn: false
  };
  if (localStorageData) {
    try {
      persistedState = JSON.parse(localStorageData);
      apiCalls.setAuthorizationHeader(persistedState);
    } catch (error) {}
  }

  const middleware = addLogger
    ? applyMiddleware(thunk, logger)
    : applyMiddleware(thunk);
  const store = createStore(rootReducer, { auth: persistedState }, middleware);

  store.subscribe(() => {
    localStorage.setItem("hoax-auth", JSON.stringify(store.getState().auth));
    apiCalls.setAuthorizationHeader(store.getState().auth);
  });

  return store;
};

export default configureStore;
