import logo from "../assets/hoaxify-logo.png";
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/auth";

function TopBar() {
  const auth = useSelector(state => ({ ...state.auth }));
  const dispatch = useDispatch();
  let links;
  const onClickLogout = () => {
    dispatch(logout());
  };
  if (auth.isLoggedIn) {
    links = (
      <>
        <ul className="nav navbar-nav ml-auto">
          <li
            onClick={onClickLogout}
            className="nav-item nav-link"
            style={{ cursor: "pointer" }}
          >
            Logout
          </li>
          <li className="nav-item">
            <Link to={`/${auth.username}`} className="nav-link">
              My Profile
            </Link>
          </li>
        </ul>
      </>
    );
  } else {
    links = (
      <>
        <li className="nav-item">
          <Link to="/signup" className="nav-link">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </li>
      </>
    );
  }

  return (
    <div className="bg-white shadow-sm mb-2">
      <div className="container">
        <nav className="navbar navbar-light navbar-expand">
          <Link to="/" className="navbar-brand">
            <img src={logo} width="60" alt="Hoaxify" /> Hoaxify
          </Link>
          <ul className="nav navbar-nav ml-auto">{links}</ul>
        </nav>
      </div>
    </div>
  );
}

export default TopBar;
