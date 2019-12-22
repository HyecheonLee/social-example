import React from 'react';
import defaultPicture from '../assets/profile.png';

const ProfileImageWithDefault = (props) => {
  let imageSource = defaultPicture;
  if (props.image) {
    imageSource = `/images/profile/${props.image}`
  }
  return (
      //eslint-disable-next-line
      <img {...props} src={props.src || imageSource}
           onError={e => e.target.src = defaultPicture}
      />
  );
};

export default ProfileImageWithDefault;
