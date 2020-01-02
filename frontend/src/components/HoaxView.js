import React from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useSelector } from "react-redux";

function HoaxView({ hoax, onClickDelete }) {
  const { user } = hoax;
  const auth = useSelector(state => ({ ...state.auth }));
  const relativeDate = format(hoax.timestamp, "ko");
  const attachmentImageVisible =
    hoax.attachment && hoax.attachment.fileType.startsWith("image");
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
          <Link to={`/${user.username}`} className="list-group-item-action">
            <h6 className={"d-inline"}>
              {user.displayName}@{user.username}
            </h6>
          </Link>
          <span className={"text-black-50"}> - </span>
          <span className={"text-black-50"}>{relativeDate}</span>
        </div>
        {auth.id === user.id && (
          <button
            onClick={onClickDelete}
            className="btn btn-outline-danger btn-sm"
          >
            <i className="far fa-trash-alt" />
          </button>
        )}
      </div>
      <div content={"pl-5"}>{hoax.content}</div>
      {attachmentImageVisible && (
        <div content={"pl-5"}>
          <img
            alt="attachment"
            src={`/images/attachments/${hoax.attachment.name}`}
            className="img-fluid"
          />
        </div>
      )}
    </div>
  );
}

export default HoaxView;
