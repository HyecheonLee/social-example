import React from 'react';
import defaultPicture from '../assets/profile.png';
import {Link} from 'react-router-dom';

const UserListItem = ({user}) => {
  let imageSource = defaultPicture;
  if (user.image) {
    imageSource = `/images/profile/${user.image}`
  }
  return (
      <Link to={`/${user.username}`}
            className="list-group-item list-group-item-action">
        <img className={"rounded-circle"} alt="profile" width={32} height={32}
             src={imageSource}/>
        <span className={"pl-2"}>{`${user.displayName}@${user.username}`}</span>
      </Link>
  );
};

export default UserListItem;
