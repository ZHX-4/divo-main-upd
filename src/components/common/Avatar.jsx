import React from 'react';

const Avatar = ({
  src,
  alt = 'User avatar',
  size = 'md',
  status,
  className = '',
  initials,
  rounded = true,
  onClick,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  };

  const roundedClass = rounded ? 'rounded-full' : 'rounded-md';
  const cursorClass = onClick ? 'cursor-pointer' : '';


  const getInitialsColor = (initials) => {
    const charCode = initials.charCodeAt(0);
    const colors = [
      'bg-blue-200 text-blue-800',
      'bg-green-200 text-green-800',
      'bg-yellow-200 text-yellow-800',
      'bg-red-200 text-red-800',
      'bg-purple-200 text-purple-800',
      'bg-pink-200 text-pink-800',
      'bg-indigo-200 text-indigo-800',
    ];
    return colors[charCode % colors.length];
  };

  return (
    <div className="relative inline-block">
      {src ? ( 
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} ${roundedClass} object-cover ${cursorClass} ${className}`}
          onClick={onClick}
        />
      ) : initials ? (
        <div
          className={`${sizeClasses[size]} ${roundedClass} ${getInitialsColor(initials)} flex items-center justify-center font-medium ${cursorClass} ${className}`}
          onClick={onClick}
        >
          {initials.substring(0, 2).toUpperCase()}
        </div>
      ) : (
        <div
          className={`${sizeClasses[size]} ${roundedClass} bg-gray-200 flex items-center justify-center ${cursorClass} ${className}`}
          onClick={onClick}
        >
          <svg
            className="w-1/2 h-1/2 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      
      {status && (
        <span
          className={`absolute bottom-0 right-0 block ${statusSizes[size]} ${statusColors[status]} ${roundedClass} ring-2 ring-white`}
        />
      )}
    </div>
  );
};

export default Avatar; 