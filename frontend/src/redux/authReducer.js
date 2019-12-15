const initialState = {
	id: 0,
	username: "",
	displayName: "",
	image: "",
	password: "",
	isLoggedIn: false
};

function authReducer(state = initialState, action) {
	switch (action.type) {
		case "logout-success":
			return {
				id: 0,
				username: "",
				displayName: "",
				image: "",
				password: "",
				isLoggedIn: false
			};
		default:
			return state;
	}
}

export default authReducer;
