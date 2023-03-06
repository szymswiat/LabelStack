import React from 'react';
import classNames from 'classnames';

interface DividerProps {
  orientation: 'horizontal' | 'vertical';
}

const Divider: React.FC<DividerProps> = ({ orientation }) => {
  return (
    <div
      className={classNames('h-full w-full flex justify-center', {
        'flex-row': orientation === 'vertical',
        'flex-col': orientation === 'horizontal'
      })}
    >
      <div
        className={classNames('border-[1px] border-primary-light', {
          'w-[1px] h-full': orientation === 'vertical',
          'h-[1px] w-full': orientation === 'horizontal'
        })}
      />
    </div>
  );
};

export default Divider;
