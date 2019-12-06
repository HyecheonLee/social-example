import React, { useState } from "react";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";

export default function LoginPage(props) {
  const [state, setState] = useState({
    username: "",
    password: "",
    apiError: "Login failure",
    pendingApiCall: false
  });
  const onChange = event => {
    const { value, name } = event.target;
    setState({
      ...state,
      [name]: value,
      apiError: undefined
    });
  };
  const onClickLogin = e => {
    const body = {
      username: state.username,
      password: state.password
    };
    setState({ pendingApiCall: true });
    props.actions
      .postLogin(body)
      .then(response => {
        setState({ pendingApiCall: false });
      })
      .catch(error => {
        if (error.response) {
          setState({
            apiError: error.response.data.message,
            pendingApiCall: false
          });
        }
      });
  };
  let disableSubmit = false;
  if (state.username === "") {
    disableSubmit = true;
  }
  if (state.password === "") {
    disableSubmit = true;
  }

  return (
    <div className="container">
      <h1 className="text-center">Login</h1>
      <div className="col-12 mb-3">
        <Input
          label="Username"
          placeholder="Your username"
          value={state.username}
          onChange={onChange}
          name="username"
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          name="password"
          onChange={onChange}
          type="password"
          label="Password"
          placeholder="Your password"
        />
      </div>
      {state.apiError && (
        <div className="col-12 mb-3">
          <div className="alert alert-danger">{state.apiError}</div>
        </div>
      )}
      <div className="text-center">
        <ButtonWithProgress
          disabled={disableSubmit || state.pendingApiCall}
          onClick={onClickLogin}
          className="btn btn-primary"
          text="Login"
          pendingApiCall={state.pendingApiCall}
        >
          Login
        </ButtonWithProgress>
      </div>
    </div>
  );
}

LoginPage.defaultProps = {
  actions: {
    postLogin: () => new Promise((resolve, reject) => resolve({}))
  }
};
