import React from "react";

export default function ButtonWithProgress({
  onClick,
  disabled,
  pendingApiCall,
  text,
  className
}) {
  return (
      <button className={className || "btn btn-primary"} onClick={onClick}
              disabled={disabled}>
        {pendingApiCall && (
            <div className="spinner-border text-light spinner-border-sm mr-1">
              <span className="sr-only">Loading...</span>
            </div>
        )}
        {text}
      </button>
  );
}
