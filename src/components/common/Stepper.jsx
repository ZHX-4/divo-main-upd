import React from 'react';

const Stepper = ({
  steps,
  activeStep,
  orientation = 'horizontal',
  className = '',
  onStepClick,
  alternativeLabel = false,
  showLabels = true,
}) => {
  const isVertical = orientation === 'vertical';
  const isClickable = !!onStepClick;

  const renderStepIcon = (step, index) => {
    const isActive = index === activeStep;
    const isCompleted = index < activeStep;

    if (step.icon && isCompleted) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }

    if (step.icon) {
      return (
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isActive
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {step.icon}
        </div>
      );
    }

    return (
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full ${
          isCompleted
            ? 'bg-primary-600 text-white'
            : isActive
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-600'
        }`}
      >
        {isCompleted ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <span>{index + 1}</span>
        )}
      </div>
    );
  };

  const renderConnector = (index) => {
    const isCompleted = index < activeStep;
    const isLast = index === steps.length - 1;

    if (isLast) return null;

    if (isVertical) {
      return (
        <div className="ml-4 mt-2 mb-2">
          <div
            className={`w-0.5 h-10 ${
              isCompleted ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          />
        </div>
      );
    }

    return (
      <div className="flex-1 mx-2">
        <div
          className={`h-0.5 ${isCompleted ? 'bg-primary-600' : 'bg-gray-300'}`}
        />
      </div>
    );
  };

  return (
    <div
      className={`${
        isVertical ? 'flex flex-col' : 'flex items-center'
      } ${className}`}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={`flex ${
              isVertical
                ? 'items-start'
                : alternativeLabel
                ? 'flex-col items-center'
                : 'items-center'
            } ${isClickable ? 'cursor-pointer' : ''}`}
            onClick={isClickable ? () => onStepClick(index) : undefined}
          >
            {renderStepIcon(step, index)}
            
            {showLabels && (
              <div
                className={`${
                  isVertical || alternativeLabel
                    ? 'ml-4'
                    : 'ml-2'
                }`}
              >
                <div
                  className={`text-sm font-medium ${
                    index === activeStep
                      ? 'text-gray-900'
                      : index < activeStep
                      ? 'text-primary-600'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                  {step.optional && (
                    <span className="text-xs text-gray-400 ml-1">(Optional)</span>
                  )}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {step.description}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {renderConnector(index)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper; 