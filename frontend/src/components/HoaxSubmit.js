import React from 'react';
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import {useSelector} from "react-redux";

function HoaxSubmit(props) {
  const auth = useSelector(state => ({...state.auth}));
  return (
      <div className="card d-flex flex-row p-1">
        <ProfileImageWithDefault
            className={"rounded-circle m-1"}
            width={32}
            height={32}
            image={auth.image}
        />
        <div className="flex-fill">
          <textarea rows={1} className="form-control w-100"/>
        </div>
      </div>
  );
}

export default HoaxSubmit;