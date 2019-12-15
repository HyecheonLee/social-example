import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {BrowserRouter} from "react-router-dom";

import * as serviceWorker from "./serviceWorker";
import App from "./containers/App";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import logger from "redux-logger";
import rootReducer from "./redux";

const loggedInState = {
	id: 1,
	username: "user1",
	displayName: "display1",
	image: "profile1.png",
	password: "P4ssword",
	isLoggedIn: true
};
const store = createStore(
	rootReducer,
	{auth: {...loggedInState}},
	applyMiddleware(logger)
);

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</Provider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
