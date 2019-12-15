import {applyMiddleware, createStore} from "redux";
import rootReducer from "./index";
import thunk from "redux-thunk";
import logger from "redux-logger";

const configureStore = (addLogger = true) => {
	const middleware = addLogger ? applyMiddleware(thunk, logger) : applyMiddleware(thunk);
	return createStore(
		rootReducer,
		middleware
	);
};
export default configureStore;