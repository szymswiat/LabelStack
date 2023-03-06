import React, { ReactNode } from 'react';
import classNames from 'classnames';

interface WindowProps {
  className?: string;
  children?: ReactNode;
}

const Window: React.FC<WindowProps> = ({ className, children }) => {
  return (
    <div
      className={classNames(className, 'rounded-sm', {
        'bg-dark-bg': className.search('bg-') === -1
      })}
    >
      {children}
    </div>
  );
};

export default Window;
