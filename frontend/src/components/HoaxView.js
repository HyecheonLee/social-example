import React from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import {format, register} from "timeago.js";

const localeFunc = (number, index, totalSec) => {
  return [
    ['방금', '곧'],
    ['%s초 전', '%s초 후'],
    ['1분 전', '1분 후'],
    ['%s분 전', '%s분 후'],
    ['1시간 전', '1시간 후'],
    ['%s시간 전', '%s시간 후'],
    ['1일 전', '1일 후'],
    ['%s일 전', '%s일 후'],
    ['1주일 전', '1주일 후'],
    ['%s주일 전', '%s주일 후'],
    ['1개월 전', '1개월 후'],
    ['%s개월 전', '%s개월 후'],
    ['1년 전', '1년 후'],
    ['%s년 전', '%s년 후'],
  ][index];
};

function HoaxView({hoax}) {
  const {user} = hoax;
  register('ko', localeFunc);
  const relativeDate = format(hoax.timestamp, "ko");

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
