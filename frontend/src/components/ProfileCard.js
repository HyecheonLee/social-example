import React from 'react';
import defaultPicture from '../assets/profile.png';
import {Link} from "react-router-dom";

function ProfileCard({user}) {
  let imageSource = defaultPicture;
  if (user.image) {
    imageSource = `/images/profile/${user.image}`
  }
  return (
      <div className="card">
        <div className="card-header text-center">
          <img alt={"profile"} width={200} height={200} src={imageSource}
               className="rounded-circle shadow"
          />
        </div>
        <div className="card-body text-center">
          <h4>{`${user.displayName}@${user.username}`}</h4></div>
      </div>
  );
}

export default ProfileCard;
