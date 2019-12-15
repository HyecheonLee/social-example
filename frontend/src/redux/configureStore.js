import {applyMiddleware, createStore} from "redux";
import rootReducer from "./index";
import thunk from "redux-thunk";
import logger from "redux-logger";
import {setAuthorizationHeader} from "../api/apiCalls";

const configureStore = (addLogger = true) => {
	const localStorageData = localStorage.getItem("hoax-auth");
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
			setAuthorizationHeader(persistedState);
		} catch (e) {

		}
	}
	const middleware = addLogger ? applyMiddleware(thunk, logger) : applyMiddleware(thunk);

	const store = createStore(
		rootReducer,
		persistedState,
		middleware
	);
	store.subscribe(() => {
		localStorage.setItem("hoax-auth", JSON.stringify(store.getState()));
		setAuthorizationHeader(store.getState());
	});
	return store;
};
export default configureStore;