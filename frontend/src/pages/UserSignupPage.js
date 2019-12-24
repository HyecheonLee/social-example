import React, {useState} from "react";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import {signupHandler} from "../redux/auth";
import {useDispatch} from "react-redux";

function UserSignupPage({ history }) {
  let [state, setState] = useState({
    displayName: "",
    username: "",
    password: "",
    passwordRepeat: "",
    pendingApiCall: false,
    errors: {},
    passwordRepeatConfirmed: true
  });
  const dispatch = useDispatch();

  function deleteError(name) {
    const { errors } = state;
    if (errors[name]) {
      delete errors[name];
    }
    return errors;
  }

  const onChange = e => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
      errors: deleteError(name)
    });
  };

  const onChangePassword = e => {
    const { value, name } = e.target;
    let passwordRepeatConfirmed;
    if (name === "password") {
      passwordRepeatConfirmed = state.passwordRepeat === value;
    } else {
      passwordRepeatConfirmed = state.password === value;
    }
    const errors = { ...state.errors };
    errors.passwordRepeat = passwordRepeatConfirmed
      ? ""
      : "Repeat your password";
    setState({
      ...state,
      [name]: value,
      passwordRepeatConfirmed,
      errors: deleteError(name)
    });
  };

  const onClickSignup = e => {
    const user = {
      username: state.username,
      displayName: state.displayName,
      password: state.password
    };
    setState({ ...state, pendingApiCall: true });
    dispatch(signupHandler(user))
      .then(async response => {
        setState({ ...state, pendingApiCall: false });
      })
      .then(value => {
        if (history) {
          history.push("/");
        }
      })
      .catch(apiError => {
        let errors = { ...state.errors };
        if (apiError.response.data && apiError.response.data.validationErrors) {
          errors = { ...apiError.response.data.validationErrors };
        }
        setState({ ...state, pendingApiCall: false, errors });
      });
  };
  return (
    <div className="container">
      <h1 className="text-center">Sign up</h1>
      <div className="col-12 mb-3">
        <Input
          label="displayName"
          className="form-control"
          name={"displayName"}
          value={state.displayName}
          onChange={onChange}
          placeholder={"Your display name"}
          hasError={state.errors.displayName && true}
          error={state.errors.displayName}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          label="username"
          className="form-control"
          name={"username"}
          value={state.username}
          onChange={onChange}
          placeholder={"Your username"}
          hasError={state.errors.username && true}
          error={state.errors.username}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          label="password"
          className="form-control"
          name={"password"}
          value={state.password}
          type="password"
          onChange={onChangePassword}
          placeholder={"Your password"}
          hasError={state.errors.password && true}
          error={state.errors.password}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          label="Repeat your password"
          className="form-control"
          name={"passwordRepeat"}
          value={state.passwordRepeat}
          type="password"
          onChange={onChangePassword}
          placeholder={"Repeat your password"}
        />
      </div>
      <div className="text-center">
        <ButtonWithProgress
          disabled={state.pendingApiCall || !state.passwordRepeatConfirmed}
          className="btn btn-primary"
          onClick={onClickSignup}
          pendingApiCall={state.pendingApiCall}
          text="Sign up"
        />
      </div>
    </div>
  );
}

export default UserSignupPage;
