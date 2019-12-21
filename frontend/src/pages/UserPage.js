import React, {useEffect, useState} from "react";
import * as apiCalls from '../api/apiCalls';
import ProfileCard from "../components/ProfileCard";

export default function UserPage({match}) {
  const [state, setState] = useState({
    user: undefined,
    userNotFound: false
  });
  const {user} = state;
  useEffect(() => {
    const username = match.params.username;
    apiCalls.getUser(username)
    .then(response => {
      setState({
        user: {...response.data},
        userNotFound: false
      })
    }).catch(error => {
      setState({
        user: undefined,
        userNotFound: true
      })
    });
    return () => {
      setState({user: undefined});
    };
  }, [match.params.username]);
  if (state.userNotFound) {
    return (
        <div className="alert alert-danger text-center">
          <div className="alert-heading">
            <i className="fas fa-exclamation-triangle fa-3x"/>
          </div>
          <h5>User not found</h5>
        </div>
    );
  }
  return <div data-testid="UserPage">
    {user && (<ProfileCard user={user}/>)}
  </div>;
}
