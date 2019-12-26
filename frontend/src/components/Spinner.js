import React from 'react';

function Spinner(props) {
  return (
      <div className="d-flex">
        <div className="spinner-border text-black-50 m-auto">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
  );
}

export default Spinner;