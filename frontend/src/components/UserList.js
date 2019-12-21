import React, {useCallback, useEffect, useState} from "react";
import * as apiCalls from "../api/apiCalls";
import UserListItem from "./UserListItem";

function UserList(props) {
  const [page, pageState] = useState({
    content: [],
    number: 0,
    size: 3,
    last: false
  });

  const loadData = useCallback((requestedPage = 0) => {
    apiCalls
    .listUsers({page: requestedPage, size: page.size})
    .then(response => {
      pageState({
        ...response.data
      });
    })
  }, [page.size]);

  useEffect(() => {
    loadData(page.number);
  }, [page.number, loadData]);

  const onClickNext = useCallback((e) => {
    pageState(state => ({
      ...state,
      number: state.number + 1
    }));
  }, []);
  const onClickPrev = useCallback((e) => {
    pageState(state => ({
      ...state,
      number: state.number - 1
    }));
  });
  return (
      <div className="card">
        <h3 className="card-title m-auto">Users</h3>
        <div className="list-group list-group-flush" data-testid="usergroup">
          {page.content.map(user => {
            return (<UserListItem key={user.username} user={user}/>
            )
          })}
        </div>
        <div className="clearfix">
          {!page.first &&
          <span className="badge badge-light float-left"
                style={{cursor: "pointer"}}
                onClick={onClickPrev}>{"< previous"}</span>

          }
          {!page.last &&
          <span className="badge badge-light float-right"
                style={{cursor: "pointer"}}
                onClick={onClickNext}>{"next >"}</span>
          }
        </div>
      </div>
  );
}

export default UserList;
