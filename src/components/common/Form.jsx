import React from 'react';

const Form = ({
  children,
  onSubmit,
  className = '',
  ...rest
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      {...rest}
    >
      {children}
    </form>
  );
};

export const FormGroup = ({
  children,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const FormRow = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap -mx-2 ${className}`}>
      {children}
    </div>
  );
};

export const FormCol = ({
  children,
  className = '',
  width = 'full',
}) => {
  const widthClasses = {
    'full': 'w-full',
    '1/2': 'w-full md:w-1/2',
    '1/3': 'w-full md:w-1/3',
    '2/3': 'w-full md:w-2/3',
    '1/4': 'w-full md:w-1/4',
    '3/4': 'w-full md:w-3/4',
  };

  return (
    <div className={`px-2 mb-4 ${widthClasses[width]} ${className}`}>
      {children}
    </div>
  );
};

export const FormActions = ({
  children,
  className = '',
  align = 'left',
}) => {
  const alignClasses = {
    'left': 'justify-start',
    'center': 'justify-center',
    'right': 'justify-end',
    'between': 'justify-between',
  };

  return (
    <div className={`flex items-center mt-6 ${alignClasses[align]} ${className}`}>
      {children}
    </div>
  );
};

export default Form; 