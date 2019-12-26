import React, {useEffect, useState} from "react";
import * as apiCalls from "../api/apiCalls";
import Spinner from "./Spinner";

function HoaxFeed({username = ""}) {
  const [state, setState] = useState({
    page: {
      content: []
    },
    isLoading: false
  });
  useEffect(() => {
    setState(prevState => ({...prevState, isLoading: true}));
    apiCalls.loadHoaxes(username).then(response => {
      setState({
        page: response.data,
        isLoading: false
      });
    });
    return () => {
    };
  }, [username]);
  if (state.isLoading) {
    return <Spinner/>;
  }

  if (state.page.content.length === 0) {
    return (
        <div className="card card-header text-center">There are no hoaxes</div>
    );
  }
  return <div>{state.page.content.map((hoax) => {
    return <span key={hoax.id}>{hoax.content}</span>
  })}</div>;
}

export default HoaxFeed;
