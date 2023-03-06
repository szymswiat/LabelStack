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
          'bg-dark-card-bg text-dark-text': !hasClassName(className, 'bg-'),
          'w-full': !hasClassName(className, 'w-'),
          'h-full': !hasClassName(className, 'h-')
        },
        'rounded-sm shadow-layout-custom-dark',
        className
      )}
    >
      <>{children}</>
    </div>
  );
};

export default LayoutCard;
