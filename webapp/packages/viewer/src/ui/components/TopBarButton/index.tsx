import React from 'react';
import { PanelButtonProps } from '../PanelButton';
import PanelButton from '../PanelButton';
import classNames from 'classnames';

export interface TopBarButtonProps extends PanelButtonProps {}

const TopBarButton: React.FC<TopBarButtonProps> = (props) => {
  props = { ...props };
  const { containerClassName, iconClassName } = props;

  delete props.containerClassName;
  delete props.iconClassName;

  return (
    <PanelButton
      containerClassName={classNames('w-10 h-10', containerClassName)}
      iconClassName={classNames('w-5 h-5', iconClassName)}
      activeClassName='bg-dark-accent text-dark-card-bg border-none'
      {...props}
    ></PanelButton>
  );
};

export default TopBarButton;
