import classNames from 'classnames';
import React, { ReactNode } from 'react';

export interface LayoutCardProps {
  children?: ReactNode;
  className?: string;
  disableDefaultSize?: boolean;
}

const LayoutCard: React.FC<LayoutCardProps> = ({ children, className, disableDefaultSize = false }) => {
  return (
    <div
      className={classNames(
        'bg-dark-card-bg rounded-lg shadow-layout-custom-dark',
        { 'w-full h-full': !disableDefaultSize },
        className
      )}
    >
      <>{children}</>
    </div>
  );
};

export default LayoutCard;
