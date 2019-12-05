import React, { useState } from "react";
import Input from "../components/Input";

export default function LoginPage() {
  const [state, setState] = useState({ username: "" });
  const onChange = event => {
    const { value, name } = event.target;
    setState({
      ...state,
      [name]: value
    });
  };
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
      <div className="text-center">
        <button className="btn btn-primary">Login</button>
      </div>
    </div>
  );
}
