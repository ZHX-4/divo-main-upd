import React from 'react';

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  pill = false,
  className = '',
  icon,
  onClick,
}) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-indigo-100 text-indigo-800',
    light: 'bg-gray-50 text-gray-600',
    dark: 'bg-gray-700 text-white',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  const shapeClass = pill ? 'rounded-full' : rounded ? 'rounded-md' : 'rounded';
  const cursorClass = onClick ? 'cursor-pointer hover:opacity-80' : '';

  return (
    <span
      className={`inline-flex items-center font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${shapeClass} ${cursorClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge; 