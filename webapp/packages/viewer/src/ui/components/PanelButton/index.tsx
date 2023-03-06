import React from 'react';
import { IconBaseProps, IconType } from 'react-icons';
import classNames from 'classnames';
import Tooltip from '../Tooltip';

interface PanelButtonProps {
  name: string;
  description?: string;
  icon?: IconType;
  iconProps?: IconBaseProps;
  isActive: boolean;
  disabled?: boolean;
  border?: boolean;
  containerClassName?: string;
  iconClassName?: string;
  onClick?: () => void;
  disableTooltip?: boolean;
}

const PanelButton: React.FC<PanelButtonProps> = ({
  name,
  description,
  icon,
  iconProps,
  isActive,
  onClick,
  disabled = false,
  containerClassName,
  iconClassName,
  disableTooltip = false,
  border = true
}) => {
  function renderButtonContent() {
    if (icon) {
      const Icon = icon;
      return <Icon {...iconProps} />;
    }
    return <div className={'pl-2 pr-2'}>{name}</div>;
  }

  function renderButtonComponent() {
    return (
      <div
        key={name}
        className={classNames(
          'h-full w-full',
          'grid place-items-center border-primary-light rounded-lg text-sm',
          {
            'border-2': border,
            'bg-primary-light text-primary-dark': isActive,
            'text-primary-light': !isActive,
            'opacity-40 cursor-default': disabled,
            'cursor-pointer ': !disabled
          },
          iconClassName
        )}
        onClick={disabled ? undefined : onClick}
      >
        {renderButtonContent()}
      </div>
    );
  }

  return (
    <div className={classNames('w-full h-full', containerClassName)}>
      {!disableTooltip && <Tooltip tooltipText={description ? description : name}>{renderButtonComponent()}</Tooltip>}
      {disableTooltip && renderButtonComponent()}
    </div>
  );
};

export default PanelButton;
