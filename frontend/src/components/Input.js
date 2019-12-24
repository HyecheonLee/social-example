import React from "react";
import classNames from "classnames";

function Input(props) {
  let isValid;
  let inputClassName = "form-control";
  if (props.type === "file") {
    inputClassName += "-file"
  }
  if (props.hasError !== undefined) {
    isValid = props.hasError ? "is-invalid" : "is-valid";
  }

  return (
      <div>
        {props.label && <label>{props.label}</label>}
        <input
            name={props.name}
            className={classNames(inputClassName, isValid)}
            placeholder={props.placeholder}
            type={props.type || "text"}
            value={props.value}
            onChange={props.onChange}
        />
        {props.hasError && (
            <span className="invalid-feedback">{props.error}</span>
        )}
      </div>
  );
}

Input.defaultProps = {
  onChange: () => {
  }
};

export default Input;
