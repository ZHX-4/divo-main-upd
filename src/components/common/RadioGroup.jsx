import React, { forwardRef } from 'react';

const RadioGroup = forwardRef(
  (
    {
      name,
      options,
      value,
      onChange,
      label,
      helperText,
      error = false,
      errorText,
      className = '',
      layout = 'vertical',
    },
    ref
  ) => {

    const groupId = `radio-group-${Math.random().toString(36).substring(2, 9)}`;
    

    const handleChange = (e) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };
    
    return (
      <div
        ref={ref}
        className={className}
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-describedby={
          error
            ? `${groupId}-error`
            : helperText
            ? `${groupId}-helper`
            : undefined
        }
      >
        {label && (
          <label
            id={`${groupId}-label`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        
        <div className={`space-${layout === 'vertical' ? 'y' : 'x'}-4`}>
          {options.map((option) => {
            const optionId = `${name}-${option.value}`;
            
            return (
              <div
                key={option.value}
                className={`relative flex ${
                  layout === 'vertical' ? 'items-start' : 'items-center mr-4'
                } ${layout === 'horizontal' ? 'inline-flex' : ''}`}
              >
                <div className="flex h-5 items-center">
                  <input
                    id={optionId}
                    name={name}
                    type="radio"
                    value={option.value}
                    checked={value === option.value}
                    onChange={handleChange}
                    disabled={option.disabled}
                    className={`h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500 ${
                      error ? 'border-red-300' : ''
                    }`}
                  />
                </div>
                
                <div className="ml-3 text-sm">
                  <label
                    htmlFor={optionId}
                    className={`font-medium ${
                      option.disabled
                        ? 'text-gray-400'
                        : error
                        ? 'text-red-900'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </label>
                  
                  {option.description && (
                    <p
                      className={`${
                        option.disabled
                          ? 'text-gray-400'
                          : error
                          ? 'text-red-500'
                          : 'text-gray-500'
                      }`}
                    >
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {error && errorText && (
          <p id={`${groupId}-error`} className="mt-2 text-sm text-red-600">
            {errorText}
          </p>
        )}
        
        {!error && helperText && (
          <p id={`${groupId}-helper`} className="mt-2 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup; 