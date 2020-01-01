import React, {useEffect, useState} from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import {useSelector} from "react-redux";
import * as apiCalls from "../api/apiCalls";
import ButtonWithProgress from "./ButtonWithProgress";
import classNames from "classnames";
import Input from "./Input";

function HoaxSubmit(props) {
  const stateInit = {
    isFocus: false,
    row: 1,
    content: "",
    file: undefined,
    image: undefined,
    attachment: undefined
  };
  const auth = useSelector(state => ({...state.auth}));
  const [state, setState] = useState(stateInit);
  const [pendingApi, setPendingApi] = useState(false);
  const [error, setError] = useState({isError: false, validationErrors: {}});
  useEffect(() => {
    if (state.file) {
      uploadFile();
    }
  }, [state.file]);
  const onClickCancel = e => {
    setState(stateInit);
    setError({isError: false, validationErrors: {}});
  };
  const onClickHoaxify = () => {
    const hoax = {
      content: state.content,
      attachment: state.attachment
    };
    setPendingApi(true);
    apiCalls
    .postHoax(hoax)
    .then(response => {
      setPendingApi(false);
      setState(stateInit);
    })
    .catch(error => {
      if (error.response.data && error.response.data.validationErrors) {
        setError({
          isError: true,
          validationErrors: error.response.data.validationErrors
        });
      }
      setPendingApi(false);
    });
  };
  const onChangeHandler = e => {
    if (error.isError) {
      setError({isError: false, validationErrors: {}});
    }
    const {name, value} = e.target;
    setState(preValue => ({
      ...preValue,
      [name]: value
    }));
  };

  const onFileSelect = e => {
    if (e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setState(prevState => ({
        ...prevState,
        image: reader.result,
        file
      }));
    };
    reader.readAsDataURL(file);
  };
  const uploadFile = () => {
    const body = new FormData();
    body.append("file", state.file);
    apiCalls.postHoaxFile(body).then(response => {
      setState(prevState => ({...prevState, attachment: response.data}));
    });
  };
  return (
      <div className="card d-flex flex-row p-1">
        <ProfileImageWithDefault
            className={"rounded-circle m-1"}
            width={32}
            height={32}
            image={auth.image}
        />
        <div className="flex-fill">
        <textarea
            rows={state.row}
            name={"content"}
            className={classNames("form-control", "w-100", {
              "is-invalid": error.isError
            })}
            onChange={onChangeHandler}
            value={state.content}
            onFocus={e => setState({...state, isFocus: true, row: 3})}
        />
          {error.isError && (
              <span className={"invalid-feedback"}>
            {error.validationErrors.content}
          </span>
          )}
          {state.isFocus && (
              <div>
                <div className="pt-1">
                  <Input type="file" onChange={onFileSelect}/>
                  {state.image && (
                      <img
                          className="mt-1 img-thumbnail"
                          src={state.image}
                          alt="upload"
                          width="128"
                          height="64"
                      />
                  )}
                </div>
                <div className="text-right mt-1">
                  <ButtonWithProgress
                      pendingApiCall={pendingApi}
                      text={"Hoaxify"}
                      disabled={pendingApi}
                      onClick={onClickHoaxify}
                      className={"btn btn-success"}
                  />
                  <button
                      disabled={pendingApi}
                      onClick={onClickCancel}
                      className={"btn btn-light ml-1"}
                  >
                    <i className={"fas fa-times"}/>
                    Cancel
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}

export default HoaxSubmit;
