import React from 'react';
import {Link} from 'react-router-dom';
import ProfileImageWithDefault from "./ProfileImageWithDefault";

const UserListItem = ({user}) => {
  return (
      <Link to={`/${user.username}`}
            className="list-group-item list-group-item-action">
        <ProfileImageWithDefault
            className={"rounded-circle"} alt="profile" width={32} height={32}
            image={user.imag}/>
        <span className={"pl-2"}>{`${user.displayName}@${user.username}`}</span>
      </Link>
  );
};

export default UserListItem;
