import React, {useState} from 'react';
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import {useSelector} from "react-redux";

function HoaxSubmit(props) {
  const auth = useSelector(state => ({...state.auth}));
  const [textArea, setTextRow] = useState({
    isFocus: false,
    row: 1
  });
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
                    className="form-control w-100"
                    onFocus={e => setTextRow({isFocus: true, row: 3})}
                    onBlur={e => setTextRow({isFocus: false, row: 1})}
          />
          {textArea.isFocus &&
          <div className="text-right mt-1">
            <button
                className={"btn btn-success"}>Hoaxify
            </button>
            <button
                onClick={e => setTextRow({isFocus: false, row: 1})}
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