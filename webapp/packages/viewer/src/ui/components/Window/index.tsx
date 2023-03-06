import React, { ReactNode } from 'react';
import classNames from 'classnames';

interface WindowProps {
  className?: string;
  children?: ReactNode;
}

const Window: React.FC<WindowProps> = ({ className, children }) => {
  return (
    <div
      className={classNames(className, 'rounded-lg border-primary-light border-2', {
        'bg-primary-dark': className.search('bg-') === -1
      })}
    >
      {children}
    </div>
  );
};

export default Window;
