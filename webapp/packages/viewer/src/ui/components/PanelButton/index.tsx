import React from 'react';
import { IconBaseProps, IconType } from 'react-icons';
import classNames from 'classnames';
import Tooltip from '../Tooltip';

export interface PanelButtonProps {
  name: string;
  description?: string;
  icon?: IconType;
  iconProps?: IconBaseProps;
  isActive: boolean;
  disabled?: boolean;
  border?: boolean;
  containerClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  iconClassName?: string;
  onClick?: () => void;
  disableTooltip?: boolean;
  fullSize?: boolean;
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
  activeClassName,
  inactiveClassName,
  iconClassName,
  disableTooltip = false,
  border = true,
  fullSize = false
}) => {
  if (activeClassName == null) {
    activeClassName = 'bg-dark-text text-dark-dark-text';
  }
  if (inactiveClassName == null) {
    inactiveClassName = 'text-dark-text';
  }

  function renderButtonContent() {
    if (icon) {
      const Icon = icon;
      return <Icon className={iconClassName} {...iconProps} />;
    }
    return <div className={'pl-2 pr-2'}>{name}</div>;
  }

  function renderButtonComponent() {
    return (
      <div
        key={name}
        className={classNames('h-full w-full', 'grid place-items-center border-dark-text rounded-lg text-sm', {
          'border-2': border,
          [activeClassName]: isActive,
          [inactiveClassName]: !isActive,
          'opacity-40 cursor-default': disabled,
          'cursor-pointer ': !disabled
        })}
        onClick={disabled ? undefined : onClick}
      >
        {renderButtonContent()}
      </div>
    );
  }

  return (
    <div className={classNames(fullSize ? 'w-full h-full' : '', containerClassName)}>
      {!disableTooltip && <Tooltip tooltipText={description ? description : name}>{renderButtonComponent()}</Tooltip>}
      {disableTooltip && renderButtonComponent()}
    </div>
  );
};

export default PanelButton;
