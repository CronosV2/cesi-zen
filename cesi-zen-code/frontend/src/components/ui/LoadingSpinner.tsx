import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = '', 
  className = '',
  fullScreen = false
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4 border-t-1 border-b-1';
      case 'lg':
        return 'h-16 w-16 border-t-4 border-b-4';
      default:
        return 'h-12 w-12 border-t-2 border-b-2';
    }
  };

  const spinner = (
    <div className={`flex ${fullScreen ? 'justify-center items-center h-64' : 'items-center'} ${className}`}>
      <div className={`animate-spin rounded-full border-primary ${getSizeClasses()}`}></div>
      {text && <span className="ml-3">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="container mx-auto p-6 max-w-7xl pt-20">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner; 