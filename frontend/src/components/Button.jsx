import React from 'react';

function Button({ children, ...props }) {
  return (
    <button className="sign custom-btn" {...props}>
      {children}
    </button>
  );
}

export default Button;
