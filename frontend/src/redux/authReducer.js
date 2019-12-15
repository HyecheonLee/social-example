const initialState = {
  id: 0,
  username: "",
  displayName: "",
  image: "",
  password: "",
  isLoggedIn: false
};

function authReducer(state = initialState, action) {
  if (!state) {
    return state;
  }
  return state;
}

export default authReducer;
