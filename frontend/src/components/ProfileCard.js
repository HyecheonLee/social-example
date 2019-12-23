import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import Input from "./Input";
import * as api from "../api/apiCalls";
import {useSelector} from "react-redux";
import ButtonWithProgress from "./ButtonWithProgress";

function ProfileCard({user}) {
  const auth = useSelector(state => ({...state.auth}));
  const {username} = useParams();
  const [state, setState] = useState({
    userProfile: {
      username: user.username,
      image: user.image,
      displayName: user.displayName
    },
    originUser: {
      ...user
    },
    pendingUpdateCall: false,
    isEditable: auth.username === username,
    inEditMode: false,
    loadedImage: undefined
  });
  const {userProfile, inEditMode, isEditable} = state;
  const onChangeHandler = e => {
    const {name, value} = e.target;
    setState(preValue => ({
      ...preValue,
      userProfile: {
        ...preValue.userProfile,
        [name]: value
      }
    }));
  };
  const onFileSelectHandler = e => {
    if (e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setState({
        ...state,
        loadedImage: reader.result
      });
    };
    reader.readAsDataURL(file);
  };
  const onSaveHandler = e => {
    e.preventDefault();
    setState(value => ({
      ...value,
      pendingUpdateCall: true
    }));
    const userUpdate = {
      displayName: userProfile.displayName,
      image: state.loadedImage && state.loadedImage.split(",")[1]
    };
    api
    .updateUser(auth.id, userUpdate)
    .then(response => {
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
        },
        pendingUpdateCall: false
      }));
    })
    .catch(error => {
      setState(value => ({
        ...value,
        pendingUpdateCall: false
      }));
    });
  };
  const onCancelHandler = e => {
    setState(value => ({
      ...value,
      inEditMode: false,
      userProfile: {
        username: value.originUser.username,
        image: value.originUser.image,
        displayName: value.originUser.displayName
      },
      loadedImage: undefined
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
              src={state.loadedImage}
              className="rounded-circle shadow"
          />
        </div>
        <div className="card-body text-center">
          {!inEditMode && (
              <h4>{`${userProfile.displayName}@${userProfile.username}`}</h4>
          )}
          {inEditMode && (
              <div className="mb-2">
                <Input
                    name="displayName"
                    onChange={onChangeHandler}
                    value={userProfile.displayName}
                    label={`Change Display Name for ${userProfile.username}`}
                />
                <input
                    className="form-control-file mt-2"
                    type={"file"}
                    onChange={onFileSelectHandler}
                />
              </div>
          )}
          {isEditable && !inEditMode && (
              <button
                  className="btn btn-outline-success"
                  onClick={e => setState(
                      value => ({...value, inEditMode: true}))}
              >
                <i className="fas fa-user-edit"/>
                Edit
              </button>
          )}
          {isEditable && inEditMode && (
              <>
                <ButtonWithProgress
                    className="btn btn-primary"
                    text={
                      <span>
                  <i className="fas fa-save"/>
                  Save
                </span>
                    }
                    pendingApiCall={state.pendingUpdateCall}
                    disabled={state.pendingUpdateCall}
                    onClick={onSaveHandler}
                />
                <button
                    disabled={state.pendingUpdateCall}
                    className="btn btn-secondary ml-1"
                    onClick={onCancelHandler}
                >
                  <i className="fas fa-window-close"/> Cancel
                </button>
              </>
          )}
        </div>
      </div>
  );
}

export default ProfileCard;
