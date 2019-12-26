import React from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import {format} from "timeago.js";

function HoaxView({hoax}) {
  const {user} = hoax;
  const relativeDate = format(hoax.timestamp, "ko_KR");

  return (
      <div className="card p-1">
        <div content="d-flex">
          <ProfileImageWithDefault
              className="rounded-circle"
              width={32}
              height={32}
              image={user.image}
          />
          <div content="flex-fill m-auto pl-2">
            <h6 className={"d-inline"}>
              {user.displayName}@{user.username}
            </h6>
            <span className={"text-black-50"}> - </span>
            <span className={"text-black-50"}>{relativeDate}</span>
          </div>
        </div>
        <div content={"pl-5"}>{hoax.content}</div>
      </div>
  );
}

export default HoaxView;
