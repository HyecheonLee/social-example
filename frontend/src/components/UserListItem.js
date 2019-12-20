import React from 'react';
import defaultPicture from '../assets/profile.png';

const UserListItem = ({user}) => {
  let imageSource = defaultPicture;
  if (user.image) {
    imageSource = `/images/profile/${user.image}`
  }
  return (
      <div key={user.id} className="list-group-item list-group-item-action">
        <img className={"rounded-circle"} alt="profile" width={32} height={32}
             src={imageSource}/>
        <span className={"pl-2"}>{`${user.displayName}@${user.username}`}</span>
      </div>
  );
};

export default UserListItem;
