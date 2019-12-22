import React from 'react';
import defaultPicture from '../assets/profile.png';
import {Link} from "react-router-dom";
import ProfileImageWithDefault from "./ProfileImageWithDefault";

function ProfileCard({user, isEditable}) {
  return (
      <div className="card">
        <div className="card-header text-center">
          <ProfileImageWithDefault alt={"profile"} width={200} height={200}
                                   src={user.imag}
                                   className="rounded-circle shadow"
          />
        </div>
        <div className="card-body text-center">
          <h4>{`${user.displayName}@${user.username}`}</h4>
          {isEditable && <button
              className="btn btn-outline-success">
            <i className="fas fa-user-edit"/> Edit
          </button>}
        </div>
      </div>
  );
}

export default ProfileCard;
