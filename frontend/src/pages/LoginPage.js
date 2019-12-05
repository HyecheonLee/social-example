import React, { useState } from "react";
import Input from "../components/Input";

export default function LoginPage(props) {
  const [state, setState] = useState({
    username: "",
    password: "",
    apiError: "Login failure"
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
    props.actions.postLogin(body).catch(error => {
      if (error.response) {
        setState({ apiError: error.response.data.message });
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
        <button
          disabled={disableSubmit}
          onClick={onClickLogin}
          className="btn btn-primary"
        >
          Login
        </button>
      </div>
    </div>
  );
}
LoginPage.defaultProps = {
  actions: {
    postLogin: () => new Promise((resolve, reject) => resolve({}))
  }
};
