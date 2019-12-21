import React, {useCallback, useEffect, useState} from "react";
import * as apiCalls from "../api/apiCalls";
import UserListItem from "./UserListItem";

function UserList(props) {
  const [state, setState] = useState(
      {
        page: {
          content: [],
          number: 0,
          size: 3
        },
        error: {
          isError: false,
          message: ""
        }
      });
  const {page, error} = state;
  const loadData = useCallback((requestedPage = 0) => {
    apiCalls
    .listUsers({page: requestedPage, size: page.size})
    .then(response => {
      setState({
        page: {
          ...response.data
        },
        error: {
          isError: false,
          message: ""
        }
      });
    })
    .catch(error => {
      setState(value => ({
        page: {
          ...value.page
        },
        error: {
          isError: true,
          message: "User load failed"
        }
      }))
    })
  }, [page.size]);
  useEffect(() => {
    loadData(page.number);
  }, []);
  const onClickNext = e => {
    loadData(page.number + 1);
  };
  const onClickPrev = (e) => {
    loadData(page.number - 1);
  };
  console.log("xxx");
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
        {error.isError && <span
            className="text-center text-danger">{error.message}</span>}
      </div>
  );
}

export default UserList;
