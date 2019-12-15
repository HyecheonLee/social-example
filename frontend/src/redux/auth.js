const LOGOUT_SUCCESS = "auth/LOGOUT_SUCCESS";
const LOGIN_SUCCESS = "auth/LOGIN_SUCCESS";

const initialState = {
	id: 0,
	username: "",
	displayName: "",
	image: "",
	password: "",
	isLoggedIn: false
};
export const logout = () => ({
	type: LOGOUT_SUCCESS,
	auth: {...initialState}
});
export const loginSuccess = (response) => ({
	type: LOGIN_SUCCESS,
	auth: {...response, isLoggedIn: true}
});

function auth(state = initialState, action) {
	switch (action.type) {
		case LOGOUT_SUCCESS:
			return action.auth;
		case LOGIN_SUCCESS:
			return action.auth;
		default:
			return state;
	}
}

export default auth;
