import React, {useState} from 'react';
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import {useSelector} from "react-redux";
import * as apiCalls from '../api/apiCalls';
import ButtonWithProgress from "./ButtonWithProgress";

function HoaxSubmit(props) {
  const textAreaInit = {isFocus: false, row: 1, content: ""};
  const auth = useSelector(state => ({...state.auth}));
  const [textArea, setTextRow] = useState(textAreaInit);
  const [pendingApi, setPendingApi] = useState(false);
  const onClickHoaxify = () => {
    const hoax = {
      content: textArea.content
    };
    setPendingApi(true);
    apiCalls.postHoax(hoax).then(response => {
      setPendingApi(false);
      setTextRow(textAreaInit);
    }).catch(error => {
      setPendingApi(false);
    })
  };
  const onChangeHandler = (e) => {
    const {name, value} = e.target;
    setTextRow(preValue => ({
      ...preValue,
      [name]: value
    }));
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
          <textarea rows={textArea.row}
                    name={"content"}
                    className="form-control w-100"
                    onChange={onChangeHandler}
                    value={textArea.content}
                    onFocus={e => setTextRow(
                        {...textArea, isFocus: true, row: 3})}
          />
          {textArea.isFocus &&
          <div className="text-right mt-1">
            <ButtonWithProgress
                pendingApiCall={pendingApi}
                text={"Hoaxify"}
                disabled={pendingApi}
                onClick={onClickHoaxify}
                className={"btn btn-success"}/>
            <button
                disabled={pendingApi}
                onClick={e => setTextRow(textAreaInit)}
                className={"btn btn-light ml-1"}>
              <i className={"fas fa-times"}/>Cancel
            </button>
          </div>
          }
        </div>
      </div>
  );
}

export default HoaxSubmit;