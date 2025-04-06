import React from 'react';

const TabButton = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`${
        active
          ? 'border-primary-500 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200`}
    >
      {children}
    </button>
  );
};

export default TabButton;