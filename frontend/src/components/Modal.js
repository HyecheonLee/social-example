import React from "react";
import ButtonWithProgress from "./ButtonWithProgress";
import classnames from "classnames";

const Modal = props => {
  const {
    title,
    visible,
    body,
    okButton,
    cancelButton,
    onClickOk,
    onClickCancel,
    pendingApiCall
  } = props;
  let rootStyle;
  if (visible) {
    rootStyle = { backgroundColor: "#000000b0" };
  }
  return (
      <div
          className={classnames("modal", "fade", { "d-block show": visible })}
          style={rootStyle}
          data-testid="modal-root"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
            </div>
            <div className="modal-body">{body}</div>
            <div className="modal-footer">
              <button
                  className="btn btn-secondary"
                  onClick={onClickCancel}
                  disabled={pendingApiCall}
              >
                {cancelButton}
              </button>
              <ButtonWithProgress
                  className="btn btn-danger"
                  onClick={onClickOk}
                  disabled={pendingApiCall}
                  pendingApiCall={pendingApiCall}
                  text={okButton}
              />
            </div>
          </div>
        </div>
      </div>
  );
};
Modal.defaultProps = {
  okButton: "Ok",
  cancelButton: "Cancel"
};
export default Modal;
