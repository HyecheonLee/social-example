import React from "react";
import defaultPicture from "../assets/profile.png";
import { Link } from "react-router-dom";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import Input from "./Input";

function ProfileCard({ user, isEditable, inEditMode }) {
  return (
    <div className="card">
      <div className="card-header text-center">
        <ProfileImageWithDefault
          alt={"profile"}
          width={200}
          height={200}
          src={user.imag}
          className="rounded-circle shadow"
        />
      </div>
      <div className="card-body text-center">
        {!inEditMode && <h4>{`${user.displayName}@${user.username}`}</h4>}
        {inEditMode && (
          <div className="mb-2">
            <Input
              value={user.displayName}
              label={`Change Display Name for ${user.username}`}
            />
          </div>
        )}
        {isEditable && !inEditMode && (
          <button className="btn btn-outline-success">
            <i className="fas fa-user-edit" /> Edit
          </button>
        )}
        {isEditable && inEditMode && (
          <>
            <button className="btn btn-primary">
              <i className="fas fa-save" /> Save
            </button>
            <button className="btn btn-secondary ml-1">
              <i className="fas fa-window-close" /> Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
