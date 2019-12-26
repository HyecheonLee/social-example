import React from "react";
import UserList from "../components/UserList";
import HoaxSubmit from "../components/HoaxSubmit";
import {useSelector} from "react-redux";
import HoaxFeed from "../components/HoaxFeed";

export default function HomePage() {
  const auth = useSelector(state => ({...state.auth}));
  return (
      <div data-testid="homepage">
        <div className="row">
          <div className="col-8">
            {auth.isLoggedIn && <HoaxSubmit/>}
            <HoaxFeed/>
          </div>
          <div className="col-4">
            <UserList/>
          </div>
        </div>
      </div>
  );
}
