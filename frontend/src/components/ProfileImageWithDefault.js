import React from 'react';
import defaultPicture from '../assets/profile.png';

const ProfileImageWithDefault = (props, {image}) => {
  let imageSource = defaultPicture;
  if (image) {
    imageSource = `/images/profile/${image}`
  }
  return (
      //eslint-disable-next-line
      <img {...props} src={props.src || imageSource}
           onError={e => e.target.src = defaultPicture}
      />
  );
};

export default ProfileImageWithDefault;
