import React from "react";
import {Route, Switch} from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import UserSignupPage from "../pages/UserSignupPage";
import UserPage from "../pages/UserPage";
import TopBar from "../components/TopBar";


function App() {
	return (
		<div>
			<TopBar/>
			<div className="container">
				<Switch>
					<Route exact path="/" component={HomePage}/>
					<Route
						exact
						path="/login"
						component={props => <LoginPage {...props} />}
					/>
					<Route
						path="/signup"
						component={props => <UserSignupPage {...props}/>}
					/>
					<Route path="/:username" component={UserPage}/>
				</Switch>
			</div>
		</div>
	);
}

export default App;
