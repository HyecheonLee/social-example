import React from "react";
import Input from "../components/Input";
export default function LoginPage() {
  return (
    <div className="container">
      <h1 className="text-center">Login</h1>
      <div className="col-12 mb-3">
        <Input label="Username" placeholder="Your username" />
      </div>
      <div className="col-12 mb-3">
        <Input type="password" label="Password" placeholder="Your password" />
      </div>
      <div className="text-center">
        <button className="btn btn-primary">Login</button>
      </div>
    </div>
  );
}
