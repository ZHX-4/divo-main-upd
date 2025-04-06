import React, { forwardRef } from 'react';

const Checkbox = forwardRef(
  (
    {
      label,
      helperText,
      error = false,
      errorText,
      onChange,
      className = '',
      id,
      ...rest
    },
    ref
  ) => {

    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
    

    const handleChange = (e) => {
      if (onChange) {
        onChange(e.target.checked);
      }
    };
    
    return (
      <div className={`${className}`}>
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              onChange={handleChange}
              className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${
                error ? 'border-red-300' : ''
              }`}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error
                  ? `${checkboxId}-error`
                  : helperText
                  ? `${checkboxId}-helper`
                  : undefined
              }
              {...rest}
            />
          </div>
          
          {label && (
            <div className="ml-3 text-sm">
              <label
                htmlFor={checkboxId}
                className={`font-medium ${error ? 'text-red-900' : 'text-gray-700'}`}
              >
                {label}
              </label>
              
              {helperText && !error && (
                <p id={`${checkboxId}-helper`} className="text-gray-500">
                  {helperText}
                </p>
              )}
              
              {error && errorText && (
                <p id={`${checkboxId}-error`} className="text-red-600">
                  {errorText}
                </p>
              )}
            </div>
          )}
        </div>
        
        {!label && error && errorText && (
          <p id={`${checkboxId}-error`} className="mt-1 text-sm text-red-600">
            {errorText}
          </p>
        )}
        
        {!label && !error && helperText && (
          <p id={`${checkboxId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox; 