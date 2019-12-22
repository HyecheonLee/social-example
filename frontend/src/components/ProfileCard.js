import React, {useEffect, useState} from "react";
import {
  useParams
} from 'react-router-dom'
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import Input from "./Input";
import * as api from '../api/apiCalls';
import {useSelector} from "react-redux";

function ProfileCard({user}) {
  const auth = useSelector(state => ({...state.auth}));
  const {username} = useParams();
  const [state, setState] = useState({
    userProfile: {
      username: user.username,
      image: user.image,
      displayName: user.displayName,
    },
    originUser: {
      ...user
    },
    isEditable: auth.username === username,
    inEditMode: false
  });
  const {userProfile, inEditMode, isEditable} = state;
  const onChangeHandler = (e) => {
    const {name, value} = e.target;
    setState(preValue => ({
      ...preValue,
      userProfile: {
        ...preValue.userProfile,
        [name]: value
      }
    }))
  };
  const onSaveHandler = (e) => {
    e.preventDefault();
    api.updateUser(auth.id, userProfile).then(response => {
      const {username, image, displayName} = response.data;
      setState(value => ({
        ...value,
        inEditMode: false,
        userProfile: {
          username,
          image,
          displayName
        },
        originUser: {
          ...response.data
        }
      }));
    }).catch(error => {

    });
  };
  const onCancelHandler = (e) => {
    setState(
        value => ({
          ...value, inEditMode: false,
          userProfile: {
            username: value.originUser.username,
            image: value.originUser.image,
            displayName: value.originUser.displayName,
          }
        }));
  };
  return (
      <div className="card">
        <div className="card-header text-center">
          <ProfileImageWithDefault
              alt={"profile"}
              width={200}
              height={200}
              image={userProfile.image}
              // src={userProfile.image}
              className="rounded-circle shadow"
          />
        </div>
        <div className="card-body text-center">
          <form onSubmit={onSaveHandler}>
            {!inEditMode &&
            <h4>{`${userProfile.displayName}@${userProfile.username}`}</h4>}
            {inEditMode && (
                <div className="mb-2">
                  <Input
                      name="displayName"
                      onChange={onChangeHandler}
                      value={userProfile.displayName}
                      label={`Change Display Name for ${userProfile.username}`}
                  />
                </div>
            )}
            {isEditable && !inEditMode && (
                <button
                    className="btn btn-outline-success"
                    onClick={e => setState(
                        value => ({...value, inEditMode: true}))}>
                  <i className="fas fa-user-edit"/>Edit
                </button>
            )}
            {isEditable && inEditMode && (
                <>
                  <button className="btn btn-primary" type="submit">
                    <i className="fas fa-save"/> Save
                  </button>
                  <button
                      className="btn btn-secondary ml-1"
                      onClick={onCancelHandler}>
                    <i className="fas fa-window-close"/> Cancel
                  </button>
                </>
            )}
          </form>
        </div>
      </div>
  );
}

export default ProfileCard;
