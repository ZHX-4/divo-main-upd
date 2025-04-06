import React from 'react';
import Card from './Card';

const StatsCard = ({
  title,
  value,
  description,
  icon,
  trend,
  className = '',
}) => {
  return (
    <Card className={`${className}`}>
      <div className="flex items-start">
        {icon && (
          <div className="flex-shrink-0 p-3 rounded-md bg-primary-100 text-primary-600">
            {icon}
          </div>
        )}
        
        <div className={icon ? 'ml-4' : ''}>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            
            {trend && (
              <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? (
                  <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="sr-only">{trend.isPositive ? 'Increased' : 'Decreased'} by</span>
                {trend.value}%
                {trend.text && <span className="ml-1">{trend.text}</span>}
              </p>
            )}
          </div>
          
          {description && (
            <p className="mt-2 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;