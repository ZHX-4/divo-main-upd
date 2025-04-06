import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  noPadding = false,
  bordered = false,
  hoverable = false,
}) => {

  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  

  const shadowBorderClasses = bordered
    ? 'border border-gray-200'
    : 'shadow';
  

  const hoverClasses = hoverable
    ? 'transition-shadow duration-300 hover:shadow-lg'
    : '';
  

  const bodyPaddingClasses = noPadding ? '' : 'p-4 sm:p-6';
  
  return (
    <div className={`${baseClasses} ${shadowBorderClasses} ${hoverClasses} ${className}`}>
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 px-4 py-4 sm:px-6 ${headerClassName}`}>
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className={`${bodyPaddingClasses} ${bodyClassName}`}>{children}</div>
      
      {footer && (
        <div className={`border-t border-gray-200 px-4 py-4 sm:px-6 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 