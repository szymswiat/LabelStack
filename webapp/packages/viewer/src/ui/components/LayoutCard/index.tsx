import classNames from 'classnames';
import React from 'react';
import { hasClassName } from '../../../utils';


export interface LayoutCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const LayoutCard: React.FC<LayoutCardProps> = (props) => {
  const { children, className } = props;

  return (
    <div
      {...props}
      className={classNames(
        {
          'bg-dark-card-bg': !hasClassName(className, 'bg-'),
          'w-full': !hasClassName(className, 'w-'),
          'h-full': !hasClassName(className, 'h-')
        },
        'rounded-lg shadow-layout-custom-dark',
        className
      )}
    >
      <>{children}</>
    </div>
  );
};

export default LayoutCard;
