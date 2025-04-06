import React, { forwardRef } from 'react';

const TextArea = forwardRef(
  (
    {
      label,
      helperText,
      error = false,
      errorText,
      onChange,
      fullWidth = true,
      className = '',
      id,
      rows = 4,
      maxLength,
      showCharCount = false,
      value = '',
      ...rest
    },
    ref
  ) => {

    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

    const handleChange = (e) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };
    

    const baseTextareaClasses = 'block rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0';
    

    const errorClasses = error
      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500';
    

    const widthClasses = fullWidth ? 'w-full' : '';
    

    const charCount = typeof value === 'string' ? value.length : 0;
    const showCount = showCharCount || maxLength;
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          onChange={handleChange}
          maxLength={maxLength}
          className={`${baseTextareaClasses} ${errorClasses} ${widthClasses} py-2 px-3 text-base`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
              ? `${textareaId}-helper`
              : undefined
          }
          value={value}
          {...rest}
        />
        
        <div className="mt-1 flex justify-between">
          {error && errorText ? (
            <p id={`${textareaId}-error`} className="text-sm text-red-600">
              {errorText}
            </p>
          ) : helperText ? (
            <p id={`${textareaId}-helper`} className="text-sm text-gray-500">
              {helperText}
            </p>
          ) : (
            <span></span>
          )}
          
          {showCount && (
            <p className="text-sm text-gray-500">
              {charCount}
              {maxLength && ` / ${maxLength}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea; 