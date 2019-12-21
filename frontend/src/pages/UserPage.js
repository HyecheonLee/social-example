import React, {useEffect, useState} from "react";
import * as apiCalls from '../api/apiCalls';

export default function UserPage({match}) {
  const [state, setState] = useState({user: undefined});
  const {user} = state;
  useEffect(() => {
    const username = match.params.username;
    apiCalls.getUser(username)
    .then(response => {
      setState({user: {...response.data}})
    });
    return () => {
      setState({user: undefined});
    };
  }, [match.params.username]);

  return <div data-testid="UserPage">
    {user && (<span>{`${user.displayName}@${user.username}`}</span>)}
  </div>;
}
