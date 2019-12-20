import React, {useEffect, useState} from "react";
import * as apiCalls from "../api/apiCalls";

function UserList(props) {
  const [page, pageState] = useState({
    content: [],
    number: 0,
    size: 3
  });
  useEffect(() => {
    apiCalls
    .listUsers({page: page.number, size: page.size})
    .then(response => {
      pageState({
        ...response.data
      });
    });
  }, []);
  return (
      <div children="card">
        <h3 className="card-title m-auto">Users</h3>
        <div className="list-group list-group-flush" data-testid="usergroup">
          {page.content.map(user => {
            return (
                <div key={user.id}
                     className="list-group-item-action">{`${user.displayName}@${user.username}`}</div>
            )
          })}
        </div>
      </div>
  );
}

export default UserList;
