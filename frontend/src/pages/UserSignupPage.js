import React, { useState } from "react";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";

function UserSignupPage({ actions }) {
  let [state, setState] = useState({
    displayName: "",
    username: "",
    password: "",
    passwordRepeat: "",
    pendingApiCall: false,
    errors: {},
    passwordRepeatConfirmed: true
  });

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
    errors.passwordRepeat = passwordRepeatConfirmed ? "" : "비밀번호 확인";
    setState({
      ...state,
      [name]: value,
      passwordRepeatConfirmed,
      errors: deleteError(name)
    });
  };

  const onClickSignup = e => {
    if (actions) {
      const user = {
        username: state.username,
        displayName: state.displayName,
        password: state.password
      };
      setState({ ...state, pendingApiCall: true });
      actions
        .postSignup(user)
        .then(response => {
          setState({ ...state, pendingApiCall: false });
        })
        .catch(apiError => {
          let errors = { ...state.errors };
          if (
            apiError.response.data &&
            apiError.response.data.validationErrors
          ) {
            errors = { ...apiError.response.data.validationErrors };
          }
          setState({ ...state, pendingApiCall: false, errors });
        });
    }
  };
  return (
    <div className="container">
      <h1 className="text-center">Sign up</h1>
      <div className="col-12 mb-3">
        <Input
          label="아이디"
          className="form-control"
          name={"displayName"}
          value={state.displayName}
          onChange={onChange}
          placeholder={"당신의 아이디"}
          hasError={state.errors.displayName && true}
          error={state.errors.displayName}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          label="이름"
          className="form-control"
          name={"username"}
          value={state.username}
          onChange={onChange}
          placeholder={"당신의 성함"}
          hasError={state.errors.username && true}
          error={state.errors.username}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          label="비밀번호"
          className="form-control"
          name={"password"}
          value={state.password}
          type="password"
          onChange={onChangePassword}
          placeholder={"당신의 비밀번호"}
          hasError={state.errors.password && true}
          error={state.errors.password}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          label="비밀번호 확인"
          className="form-control"
          name={"passwordRepeat"}
          value={state.passwordRepeat}
          type="password"
          onChange={onChangePassword}
          placeholder={"비밀번호 확인"}
        />
      </div>
      <div className="text-center">
        <ButtonWithProgress
          disabled={state.pendingApiCall || !state.passwordRepeatConfirmed}
          className="btn btn-primary"
          onClick={onClickSignup}
          pendingApiCall={state.pendingApiCall}
          text="Sign up"
        ></ButtonWithProgress>
      </div>
    </div>
  );
}

UserSignupPage.defaultProps = {
  actions: {
    postSignup: () =>
      new Promise((resolve, reject) => {
        resolve({});
      })
  }
};
export default UserSignupPage;
