import React, { ReactNode } from 'react';
import Window from '../Window';
import PanelButton from '../PanelButton';
import { BsXLg } from 'react-icons/bs';
import classNames from 'classnames';

interface CloseableProps {
  className?: string;
  onClose?: () => void;
  headerComponent?: ReactNode;
  children?: ReactNode;
}

const CloseableWindow: React.FC<CloseableProps> = ({ className, onClose, headerComponent, children }) => {
  return (
    <Window className={classNames('flex flex-col gap-y-4 p-2', className)}>
      {onClose && (
        <div className={'flex flex-row-reverse pl-2'}>
          <PanelButton
            containerClassName={'w-10 h-10'}
            name={'Close Window'}
            isActive={false}
            icon={BsXLg}
            iconProps={{ size: 20 }}
            onClick={() => onClose()}
            border={false}
          />
          <div className={'flex-grow'} />
          {headerComponent}
        </div>
      )}
      {children}
    </Window>
  );
};

export default CloseableWindow;
