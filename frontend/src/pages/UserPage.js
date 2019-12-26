import React, {useEffect, useState} from "react";
import * as apiCalls from "../api/apiCalls";
import ProfileCard from "../components/ProfileCard";
import {useSelector} from "react-redux";
import HoaxFeed from "../components/HoaxFeed";
import {useParams} from "react-router-dom";

export default function UserPage({match}) {
  const auth = useSelector(state => ({...state.auth}));
  const [state, setState] = useState({
    user: undefined,
    userNotFound: false,
    isLoadingUser: false
  });
  const {username} = useParams();
  const {user} = state;
  useEffect(() => {
    const username = match.params.username;
    setState(value => ({...value, isLoadingUser: true}));
    apiCalls
    .getUser(username)
    .then(response => {
      setState({
        user: {...response.data},
        userNotFound: false,
        isLoadingUser: false
      });
    })
    .catch(error => {
      setState({
        user: undefined,
        userNotFound: true,
        isLoadingUser: false
      });
    });
    return () => {
      setState({user: undefined});
    };
  }, [match.params.username]);

  let pageContent;
  if (state.isLoadingUser) {
    pageContent = (
        <div className="d-flex">
          <div className="spinner-border text-black-50 m-auto">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
    );
  } else if (state.userNotFound) {
    pageContent = (
        <div className="alert alert-danger text-center">
          <div className="alert-heading">
            <i className="fas fa-exclamation-triangle fa-3x"/>
          </div>
          <h5>User not found</h5>
        </div>
    );
  } else {
    let isEditable = auth.username === match.params.username;
    pageContent = user && <ProfileCard user={user} isEditable={isEditable}/>;
  }
  return (
      <div data-testid="UserPage">
        <div className="row">
          <div className="col">
            {pageContent}
          </div>
          <div className="col">
            <HoaxFeed username={username}/>
          </div>
        </div>
      </div>
  );
}
