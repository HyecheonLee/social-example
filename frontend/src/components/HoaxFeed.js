import React, {useEffect, useState} from 'react';
import * as apiCalls from '../api/apiCalls';

function HoaxFeed({username = ""}) {
  const [state, setState] = useState({
    hoaxes: []
  });
  useEffect(() => {
    apiCalls.loadHoaxes(username)
    .then(response => {
      setState({
        hoaxes: response.data.content
      });
    });
    return () => {
    };
  }, [username]);
  return (
      <div>
        {state.hoaxes.length === 0 && <div
            className="card card-header text-center">There are no hoaxes</div>}
      </div>
  );
}

export default HoaxFeed;