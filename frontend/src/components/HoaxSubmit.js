import React, {useState} from 'react';
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import {useSelector} from "react-redux";
import * as apiCalls from '../api/apiCalls';

function HoaxSubmit(props) {
  const initValue = {isFocus: false, row: 1, content: ""};
  const auth = useSelector(state => ({...state.auth}));
  const [textArea, setTextRow] = useState(initValue);
  const onClickHoaxify = () => {
    const hoax = {
      content: textArea.content
    };
    apiCalls.postHoax(hoax).then(response => {
      setTextRow(initValue);
    });
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
            <button
                onClick={onClickHoaxify}
                className={"btn btn-success"}>Hoaxify
            </button>
            <button
                onClick={e => setTextRow(initValue)}
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