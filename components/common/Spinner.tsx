
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div
      style={{
        border: '3px solid rgba(255, 255, 255, 0.3)',
        borderTop: '3px solid white',
      }}
      className="w-5 h-5 border-t-white rounded-full animate-spin inline-block ml-2"
    ></div>
  );
};

export default Spinner;
