import logo from "../assets/hoaxify-logo.png";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../redux/auth";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import classNames from "classnames";

function TopBar() {
  const [state, setState] = useState({toggle: false});
  const auth = useSelector(state => ({...state.auth}));
  const dispatch = useDispatch();

  const onClickLogout = () => {
    dispatch(logout());
  };
  let links;
  console.log(state);
  if (auth.isLoggedIn) {
    links = (
        <ul className="nav navbar-nav ml-auto">
          <li className="nav-item dropdown"
              onClick={e => {
                setState(value => ({toggle: !value.toggle}))
              }}>
            <div className={"d-flex"} style={{cursor: "pointer"}}>
              <ProfileImageWithDefault
                  image={auth.image}
                  className="rounded-circle m-auto"
                  width={32}
              />
              <span
                  className={"nav-link dropdown-toggle"}>{auth.displayName}</span>
            </div>
            <div className={classNames("p-0", "shadow", "dropdown-menu",
                {"show": state.toggle})}>
              <Link to={`/${auth.username}`} className="dropdown-item">
                <i className={"fas fa-user text-info"}/>My Profile
              </Link>
              <span
                  onClick={onClickLogout}
                  className="dropdown-item"
                  style={{cursor: "pointer"}}
              >
                <i className={"fas fa-sign-out-alt text-danger"}/>Logout
              </span>
            </div>
          </li>
        </ul>
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
              <img src={logo} width="60" alt="Hoaxify"/> Hoaxify
            </Link>
            <ul className="nav navbar-nav ml-auto">{links}</ul>
          </nav>
        </div>
      </div>
  );
}

export default TopBar;
