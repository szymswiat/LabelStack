import classNames from 'classnames';
import React, { useId } from 'react';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  description?: string;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, description, className }) => {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={classNames('flex flex-row w-full text-sm font-medium relative cursor-pointer', className)}
    >
      <input
        type="checkbox"
        id={id}
        className="sr-only peer"
        checked={checked}
        onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
      />
      <div
        className={classNames(
          'w-11 h-6 rounded-full peer bg-dark-bg border-dark-text',
          'peer-checked:after:translate-x-full peer-checked:after:bg-dark-accent',
          "after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-dark-text peer-checked:after:border-dark-accent",
          'after:border after:rounded-full after:h-5 after:w-5 after:transition-all'
        )}
      />
      {description && <span className="ml-3 text-sm font-medium place-self-center">{description}</span>}
    </label>
  );
};

export default Switch;
