import React from 'react';
import Link from 'next/link';

const Breadcrumb = ({
  items,
  separator = '/',
  className = '',
  itemClassName = '',
  activeItemClassName = '',
  homeIcon,
}) => {
  const defaultHomeIcon = (
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );

  return (
    <nav className={`flex items-center text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isHome = index === 0;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400">{separator}</span>
              )}
              
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`flex items-center text-gray-600 hover:text-primary-600 ${itemClassName}`}
                >
                  {isHome && (homeIcon || defaultHomeIcon)}
                  {item.icon && !isHome && <span className="mr-1">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={`flex items-center ${
                    isLast
                      ? `font-medium text-gray-800 ${activeItemClassName}`
                      : `text-gray-600 ${itemClassName}`
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {isHome && (homeIcon || defaultHomeIcon)}
                  {item.icon && !isHome && <span className="mr-1">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 